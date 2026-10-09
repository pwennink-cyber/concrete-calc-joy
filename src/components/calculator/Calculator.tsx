import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import {
  concreteTypes,
  planning,
  projectTypes,
  unloadingMethods,
  UNKNOWN_CONCRETE,
} from "@/config/site";
import {
  initialCalculatorState,
  type CalculatorState,
  type PriceResult,
} from "@/lib/calculator-types";
import {
  advisedConcreteFor,
  calculatePrice,
  computeVolumes,
  earliestDeliveryDate,
  getConcreteType,
  isSelectableDate,
  isValidPostcode,
  needsPumpAdvice,
} from "@/lib/pricing";
import { formatEuro, formatVolume } from "@/lib/format";
import { PriceSummary } from "./PriceSummary";

const STEP_LABELS = [
  "Locatie & project",
  "Hoeveelheid",
  "Betonsoort",
  "Levering",
  "Levermoment",
] as const;

const inputClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";
const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";

function RadioCard({
  checked,
  onSelect,
  title,
  description,
  name,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  name: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
        checked ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="mt-1 size-4 accent-[var(--primary)]"
      />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}

function validateStep(step: number, s: CalculatorState): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!isValidPostcode(s.postcode)) errors.push("Vul een geldige postcode in (bijv. 1234 AB).");
    if (!s.houseNumber.trim()) errors.push("Vul je huisnummer in.");
    if (!s.projectType) errors.push("Kies je projecttype.");
  }
  if (step === 2) {
    if (s.volumeMode === "known" && Number(s.knownVolume.replace(",", ".")) <= 0) {
      errors.push("Vul de benodigde hoeveelheid beton in.");
    }
    if (s.volumeMode === "calculate") {
      if (Number(s.length.replace(",", ".")) <= 0) errors.push("Vul de lengte in meters in.");
      if (Number(s.width.replace(",", ".")) <= 0) errors.push("Vul de breedte in meters in.");
      if (Number(s.thicknessCm.replace(",", ".")) <= 0) errors.push("Vul de dikte in centimeters in.");
    }
  }
  if (step === 3 && !s.concreteType) errors.push("Kies een betonsoort of advies.");
  if (step === 4) {
    if (!s.accessWithinFourMeters) errors.push("Geef aan of de betonwagen binnen 4 meter kan komen.");
    if (!s.unloadingMethod) errors.push("Kies een losmethode.");
  }
  if (step === 5 && !s.asap) {
    const check = isSelectableDate(s.preferredDate);
    if (!check.ok) errors.push(check.reason ?? "Kies een geldige leverdatum.");
    if (!s.timeslot) errors.push("Kies een tijdvak.");
  }
  return errors;
}

export function Calculator({ onPriceResult }: { onPriceResult?: (result: PriceResult) => void }) {
  const [state, setState] = useState<CalculatorState>(initialCalculatorState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  const set = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const price = useMemo(() => calculatePrice(state), [state]);
  const volumes = useMemo(() => computeVolumes(state), [state]);
  onPriceResult?.(price);

  const goTo = (next: number) => {
    const stepErrors = validateStep(step, state);
    if (next > step && stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors([]);
    setStep(Math.min(5, Math.max(1, next)));
  };

  const advised = advisedConcreteFor(state.projectType);
  const advisedType = getConcreteType(advised);
  const pumpAdvice = needsPumpAdvice(state);
  const dateCheck = isSelectableDate(state.preferredDate);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        {/* Voortgang */}
        <ol className="mb-8 flex flex-wrap gap-2" aria-label="Stappen">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => goTo(n)}
                  aria-current={active ? "step" : undefined}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                        ? "bg-success-soft text-foreground"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {n}. {label}
                </button>
              </li>
            );
          })}
        </ol>

        {errors.length > 0 && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <ul className="list-inside list-disc space-y-1">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stap 1 */}
        {step === 1 && (
          <fieldset>
            <legend className="text-xl font-bold">Waar komt het beton terecht?</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_120px_100px]">
              <div>
                <label htmlFor="postcode" className={labelClass}>
                  Postcode
                </label>
                <input
                  id="postcode"
                  className={inputClass}
                  placeholder="1234 AB"
                  autoComplete="postal-code"
                  value={state.postcode}
                  onChange={(e) => set("postcode", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="huisnummer" className={labelClass}>
                  Huisnummer
                </label>
                <input
                  id="huisnummer"
                  className={inputClass}
                  inputMode="numeric"
                  value={state.houseNumber}
                  onChange={(e) => set("houseNumber", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="toevoeging" className={labelClass}>
                  Toevoeging
                </label>
                <input
                  id="toevoeging"
                  className={inputClass}
                  placeholder="bis"
                  value={state.addition}
                  onChange={(e) => set("addition", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <span className={labelClass}>Ik bestel als</span>
                <div className="grid grid-cols-2 gap-2">
                  <RadioCard
                    name="klanttype"
                    checked={state.customerType === "particulier"}
                    onSelect={() => set("customerType", "particulier")}
                    title="Particulier"
                  />
                  <RadioCard
                    name="klanttype"
                    checked={state.customerType === "zakelijk"}
                    onSelect={() => set("customerType", "zakelijk")}
                    title="Zakelijk"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="projecttype" className={labelClass}>
                  Projecttype
                </label>
                <select
                  id="projecttype"
                  className={inputClass}
                  value={state.projectType}
                  onChange={(e) => set("projectType", e.target.value as CalculatorState["projectType"])}
                >
                  <option value="">Kies je project…</option>
                  {projectTypes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>
        )}

        {/* Stap 2 */}
        {step === 2 && (
          <fieldset>
            <legend className="text-xl font-bold">Hoeveel beton heb je nodig?</legend>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <RadioCard
                name="volumemodus"
                checked={state.volumeMode === "known"}
                onSelect={() => set("volumeMode", "known")}
                title="Ik weet de hoeveelheid"
                description="Vul direct het aantal kubieke meters in."
              />
              <RadioCard
                name="volumemodus"
                checked={state.volumeMode === "calculate"}
                onSelect={() => set("volumeMode", "calculate")}
                title="Bereken het voor mij"
                description="Lengte × breedte × dikte."
              />
            </div>

            {state.volumeMode === "known" ? (
              <div className="mt-6 max-w-xs">
                <label htmlFor="volume" className={labelClass}>
                  Hoeveelheid (m³)
                </label>
                <input
                  id="volume"
                  className={inputClass}
                  inputMode="decimal"
                  placeholder="bijv. 4,5"
                  value={state.knownVolume}
                  onChange={(e) => set("knownVolume", e.target.value)}
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <div>
                  <label htmlFor="lengte" className={labelClass}>
                    Lengte (m)
                  </label>
                  <input
                    id="lengte"
                    className={inputClass}
                    inputMode="decimal"
                    value={state.length}
                    onChange={(e) => set("length", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="breedte" className={labelClass}>
                    Breedte (m)
                  </label>
                  <input
                    id="breedte"
                    className={inputClass}
                    inputMode="decimal"
                    value={state.width}
                    onChange={(e) => set("width", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="dikte" className={labelClass}>
                    Dikte (cm)
                  </label>
                  <input
                    id="dikte"
                    className={inputClass}
                    inputMode="decimal"
                    value={state.thicknessCm}
                    onChange={(e) => set("thicknessCm", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="vlakken" className={labelClass}>
                    Aantal vlakken
                  </label>
                  <input
                    id="vlakken"
                    className={inputClass}
                    inputMode="numeric"
                    value={state.surfaces}
                    onChange={(e) => set("surfaces", e.target.value)}
                  />
                </div>
              </div>
            )}

            <label className="mt-6 flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                className="size-4 accent-[var(--primary)]"
                checked={state.useSafetyMargin}
                onChange={(e) => set("useSafetyMargin", e.target.checked)}
              />
              Tel 5% veiligheidsmarge mee voor morsen en meetverschillen
            </label>

            {volumes.orderVolume > 0 && (
              <p className="mt-4 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
                Berekende bestelhoeveelheid: {formatVolume(volumes.orderVolume)} (afgerond op 0,1 m³)
              </p>
            )}
          </fieldset>
        )}

        {/* Stap 3 */}
        {step === 3 && (
          <fieldset>
            <legend className="text-xl font-bold">Welke betonsoort past bij je project?</legend>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {concreteTypes.map((c) => (
                <RadioCard
                  key={c.id}
                  name="betonsoort"
                  checked={state.concreteType === c.id}
                  onSelect={() => set("concreteType", c.id)}
                  title={`${c.label} — ${formatEuro(c.pricePerM3)} per m³`}
                  description={c.description}
                />
              ))}
              <RadioCard
                name="betonsoort"
                checked={state.concreteType === UNKNOWN_CONCRETE}
                onSelect={() => set("concreteType", UNKNOWN_CONCRETE)}
                title="Ik weet het niet"
                description="Wij geven een indicatief advies op basis van je project."
              />
            </div>
            {state.concreteType === UNKNOWN_CONCRETE && advisedType && (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-card p-4 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>
                  Op basis van je project adviseren wij{" "}
                  <strong>{advisedType.label}</strong> ({formatEuro(advisedType.pricePerM3)} per m³).{" "}
                  {advisedType.description}
                </span>
              </p>
            )}
          </fieldset>
        )}

        {/* Stap 4 */}
        {step === 4 && (
          <fieldset>
            <legend className="text-xl font-bold">Hoe kunnen wij het beton lossen?</legend>
            <div className="mt-6">
              <span className={labelClass}>Kan de betonwagen binnen 4 meter van de stortplaats komen?</span>
              <div className="grid grid-cols-3 gap-2">
                {(["ja", "nee", "weetniet"] as const).map((answer) => (
                  <RadioCard
                    key={answer}
                    name="bereikbaarheid"
                    checked={state.accessWithinFourMeters === answer}
                    onSelect={() => set("accessWithinFourMeters", answer)}
                    title={answer === "weetniet" ? "Weet ik niet" : answer === "ja" ? "Ja" : "Nee"}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {unloadingMethods.map((m) => (
                <RadioCard
                  key={m.id}
                  name="losmethode"
                  checked={state.unloadingMethod === m.id}
                  onSelect={() => set("unloadingMethod", m.id)}
                  title={m.label}
                  description={m.description}
                />
              ))}
            </div>

            {pumpAdvice && state.unloadingMethod !== "pomp" && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-accent px-4 py-3 text-sm text-accent-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  Met meer dan 4 meter afstand is een betonpomp meestal nodig. Kies anders hierboven
                  voor de pomp; de toeslag staat dan in je prijsopbouw.
                </span>
              </p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="lostijd" className={labelClass}>
                  Lostijd (minuten)
                </label>
                <select
                  id="lostijd"
                  className={inputClass}
                  value={state.unloadingMinutes}
                  onChange={(e) => set("unloadingMinutes", e.target.value)}
                >
                  {[30, 45, 60, 75, 90].map((m) => (
                    <option key={m} value={String(m)}>
                      {m} minuten
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="afstand" className={labelClass}>
                  Afstand tot stortplaats (m)
                </label>
                <input
                  id="afstand"
                  className={inputClass}
                  inputMode="numeric"
                  value={state.distanceMeters}
                  onChange={(e) => set("distanceMeters", e.target.value)}
                />
              </div>
              {state.unloadingMethod === "pomp" && (
                <div>
                  <label htmlFor="slang" className={labelClass}>
                    Extra slangmeters
                  </label>
                  <input
                    id="slang"
                    className={inputClass}
                    inputMode="numeric"
                    value={state.extraHoseMeters}
                    onChange={(e) => set("extraHoseMeters", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="obstakels" className={labelClass}>
                Bijzonderheden op de locatie (optioneel)
              </label>
              <textarea
                id="obstakels"
                className={inputClass}
                rows={3}
                placeholder="Bijvoorbeeld: smalle straat, kabels boven de tuin, bocht bij de oprit…"
                value={state.obstacles}
                onChange={(e) => set("obstacles", e.target.value)}
              />
            </div>
          </fieldset>
        )}

        {/* Stap 5 */}
        {step === 5 && (
          <fieldset>
            <legend className="text-xl font-bold">Wanneer mag het beton geleverd worden?</legend>
            <div className="mt-6 space-y-4">
              <RadioCard
                name="snel"
                checked={state.asap}
                onSelect={() => set("asap", !state.asap)}
                title="Zo snel mogelijk"
                description="Wij plannen jouw levering in de eerste beschikbare periode."
              />
              {!state.asap && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="datum" className={labelClass}>
                        Gewenste leverdatum
                      </label>
                      <input
                        id="datum"
                        type="date"
                        className={inputClass}
                        min={earliestDeliveryDate()}
                        value={state.preferredDate}
                        onChange={(e) => set("preferredDate", e.target.value)}
                      />
                      {state.preferredDate && !dateCheck.ok && (
                        <p className="mt-1.5 text-xs text-destructive">{dateCheck.reason}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="tijdvak" className={labelClass}>
                        Tijdvak
                      </label>
                      <select
                        id="tijdvak"
                        className={inputClass}
                        value={state.timeslot}
                        onChange={(e) => set("timeslot", e.target.value)}
                      >
                        <option value="">Kies een tijdvak…</option>
                        {planning.timeslots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--primary)]"
                      checked={state.flexible}
                      onChange={(e) => set("flexible", e.target.checked)}
                    />
                    Ik ben flexibel: lever mij op de goedkoopste mogelijkheid
                  </label>
                </>
              )}
            </div>
          </fieldset>
        )}

        {/* Navigatie desktop */}
        <div className="mt-8 hidden items-center justify-between md:flex">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-md border border-input px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Vorige
          </button>
          {step < 5 ? (
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Volgende
              <ArrowRight className="size-4" aria-hidden />
            </button>
          ) : (
            <a
              href="#aanvraag"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Naar aanvraag
              <ArrowRight className="size-4" aria-hidden />
            </a>
          )}
        </div>
      </div>

      {/* Prijskaart desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <PriceSummary result={price} />
          <a
            href="#aanvraag"
            className="mt-4 flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Aanvraag starten
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </aside>

      {/* Mobiele prijsbalk */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 shadow-card backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Totaal incl. btw</p>
            <p className="text-lg font-bold text-primary">{formatEuro(price.total)}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={step === 1}
              className="inline-flex items-center justify-center rounded-md border border-input px-3 py-2.5 text-sm font-semibold disabled:opacity-40"
              aria-label="Vorige stap"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
              >
                Volgende
                <ArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <a
                href="#aanvraag"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
              >
                Naar aanvraag
                <ArrowRight className="size-4" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Doorlopende data voor het boekingsformulier */}
      <span className="hidden">{formatEuro(0)}</span>
      <BookingBridge state={state} price={price} />
    </div>
  );
}

import { BookingForm } from "@/components/booking/BookingForm";

function BookingBridge({ state, price }: { state: CalculatorState; price: PriceResult }) {
  return <BookingForm calc={state} price={price} />;
}

import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { submitBookingRequest } from "@/lib/booking.functions";
import type { CalculatorState, PriceResult } from "@/lib/calculator-types";
import { getConcreteType, isSelectableDate, isValidPostcode, resolveConcreteTypeId } from "@/lib/pricing";
import { formatDateNl } from "@/lib/format";

const inputClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";
const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";

const num = (value: string): number => {
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

interface Props {
  calc: CalculatorState;
  price: PriceResult;
}

export function BookingForm({ calc, price }: Props) {
  const navigate = useNavigate();
  const clientToken = useRef(crypto.randomUUID());
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    deliveryStreet: "",
    deliveryPostcode: "",
    deliveryCity: "",
    billingSame: true,
    billingStreet: "",
    billingPostcode: "",
    billingCity: "",
    accessNotes: "",
    projectNotes: "",
    website: "", // honeypot
    acceptTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const calculatorComplete =
    isValidPostcode(calc.postcode) &&
    calc.projectType !== "" &&
    price.hasVolume &&
    calc.accessWithinFourMeters !== "" &&
    calc.unloadingMethod !== "" &&
    (calc.asap || (calc.preferredDate !== "" && isSelectableDate(calc.preferredDate).ok));

  const concrete = getConcreteType(resolveConcreteTypeId(calc));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!calculatorComplete) {
      setError("Vul eerst alle stappen van de calculator in.");
      return;
    }
    if (!form.acceptTerms) {
      setError("Ga akkoord met de voorwaarden en het privacybeleid.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitBookingRequest({
        data: {
          website: form.website,
          clientToken: clientToken.current,
          customerType: calc.customerType,
          firstName: form.firstName,
          lastName: form.lastName,
          companyName: calc.customerType === "zakelijk" ? form.companyName : "",
          email: form.email,
          phone: form.phone,
          deliveryStreet: form.deliveryStreet,
          deliveryPostcode: `${calc.postcode} ${calc.houseNumber}${calc.addition ? " " + calc.addition : ""}`.trim(),
          deliveryCity: form.deliveryCity,
          billingSame: form.billingSame,
          billingStreet: form.billingSame ? "" : form.billingStreet,
          billingPostcode: form.billingSame ? "" : form.billingPostcode,
          billingCity: form.billingSame ? "" : form.billingCity,
          projectType: calc.projectType,
          dimensions:
            calc.volumeMode === "calculate"
              ? {
                  mode: "calculate",
                  length: num(calc.length),
                  width: num(calc.width),
                  thicknessCm: num(calc.thicknessCm),
                  surfaces: num(calc.surfaces),
                }
              : { mode: "known" },
          netVolume: price.netVolume,
          marginVolume: price.marginVolume,
          orderVolume: price.orderVolume,
          concreteType: concrete?.label ?? calc.concreteType,
          accessWithinFourMeters: calc.accessWithinFourMeters as "ja" | "nee" | "weetniet",
          unloadingMethod: calc.unloadingMethod,
          unloadingMinutes: num(calc.unloadingMinutes),
          distanceMeters: calc.distanceMeters.trim() ? num(calc.distanceMeters) : null,
          obstacles: calc.obstacles,
          extraHoseMeters: num(calc.extraHoseMeters),
          asap: calc.asap,
          preferredDate: calc.asap ? null : calc.preferredDate,
          timeslot: calc.timeslot,
          flexible: calc.flexible,
          priceLines: price.lines,
          subtotal: price.subtotal,
          vat: price.vat,
          total: price.total,
          accessNotes: form.accessNotes,
          projectNotes: form.projectNotes,
          acceptTerms: true,
        },
      });

      if (result.ok) {
        navigate({
          to: "/bevestiging/$aanvraagnummer",
          params: { aanvraagnummer: result.requestNumber },
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Je aanvraag kon niet worden verstuurd. Probeer het opnieuw of bel ons.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="aanvraag" className="scroll-mt-24">
      <h2 className="text-2xl font-bold">Je aanvraag afronden</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Vul je gegevens in en verstuur je reserveringsaanvraag. Wij controleren je aanvraag en
        bevestigen de levering telefonisch of per e-mail.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Samenvatting van je berekening
        </h3>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <li>
            <span className="text-muted-foreground">Betonsoort: </span>
            <strong>{concrete?.label ?? "—"}</strong>
          </li>
          <li>
            <span className="text-muted-foreground">Hoeveelheid: </span>
            <strong>{price.orderVolume.toFixed(1).replace(".", ",")} m³</strong>
          </li>
          <li>
            <span className="text-muted-foreground">Levering: </span>
            <strong>
              {calc.asap
                ? "Zo snel mogelijk"
                : `${formatDateNl(calc.preferredDate)}${calc.timeslot ? ` (${calc.timeslot.replace("-", ":00 – ")})` : ""}`}
            </strong>
          </li>
          <li>
            <span className="text-muted-foreground">Totaal incl. btw: </span>
            <strong className="text-primary">
              {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(price.total)}
            </strong>
          </li>
        </ul>
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6" noValidate>
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Laat dit veld leeg
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="voornaam" className={labelClass}>
              Voornaam
            </label>
            <input id="voornaam" className={inputClass} autoComplete="given-name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
          </div>
          <div>
            <label htmlFor="achternaam" className={labelClass}>
              Achternaam
            </label>
            <input id="achternaam" className={inputClass} autoComplete="family-name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
          </div>
          {calc.customerType === "zakelijk" && (
            <div className="sm:col-span-2">
              <label htmlFor="bedrijfsnaam" className={labelClass}>
                Bedrijfsnaam
              </label>
              <input id="bedrijfsnaam" className={inputClass} autoComplete="organization" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
            </div>
          }
          <div>
            <label htmlFor="email" className={labelClass}>
              E-mailadres
            </label>
            <input id="email" type="email" className={inputClass} autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div>
            <label htmlFor="telefoon" className={labelClass}>
              Telefoonnummer
            </label>
            <input id="telefoon" type="tel" className={inputClass} autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
          </div>
          <div>
            <label htmlFor="straat" className={labelClass}>
              Leveradres (straat)
            </label>
            <input id="straat" className={inputClass} autoComplete="street-address" value={form.deliveryStreet} onChange={(e) => set("deliveryStreet", e.target.value)} required />
          </div>
          <div>
            <label htmlFor="woonplaats" className={labelClass}>
              Woonplaats
            </label>
            <input id="woonplaats" className={inputClass} autoComplete="address-level2" value={form.deliveryCity} onChange={(e) => set("deliveryCity", e.target.value)} required />
          </div>
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={form.billingSame}
            onChange={(e) => set("billingSame", e.target.checked)}
          />
          Factuuradres is hetzelfde als het leveradres
        </label>

        {!form.billingSame && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="factuurstraat" className={labelClass}>
                Factuuradres
              </label>
              <input id="factuurstraat" className={inputClass} value={form.billingStreet} onChange={(e) => set("billingStreet", e.target.value)} />
            </div>
            <div>
              <label htmlFor="factuurpostcode" className={labelClass}>
                Postcode
              </label>
              <input id="factuurpostcode" className={inputClass} value={form.billingPostcode} onChange={(e) => set("billingPostcode", e.target.value)} />
            </div>
            <div>
              <label htmlFor="factuurplaats" className={labelClass}>
                Woonplaats
              </label>
              <input id="factuurplaats" className={inputClass} value={form.billingCity} onChange={(e) => set("billingCity", e.target.value)} />
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="toegang" className={labelClass}>
              Bijzonderheden bereikbaarheid (optioneel)
            </label>
            <textarea id="toegang" className={inputClass} rows={2} value={form.accessNotes} onChange={(e) => set("accessNotes", e.target.value)} />
          </div>
          <div>
            <label htmlFor="opmerking" className={labelClass}>
              Opmerkingen bij je project (optioneel)
            </label>
            <textarea id="opmerking" className={inputClass} rows={2} value={form.projectNotes} onChange={(e) => set("projectNotes", e.target.value)} />
          </div>
        </div>

        <label className="mt-5 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-[var(--primary)]"
            checked={form.acceptTerms}
            onChange={(e) => set("acceptTerms", e.target.checked)}
          />
          <span>
            Ik ga akkoord met de algemene voorwaarden en het privacybeleid van BetaalbaarBeton.nl.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Versturen…
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" aria-hidden />
              Aanvraag versturen
            </>
          )}
        </button>
      </form>
    </section>
  );
}

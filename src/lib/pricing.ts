import {
  concreteTypes,
  pricing,
  planning,
  projectTypes,
  type ConcreteTypeId,
  type ProjectTypeId,
} from "@/config/site";
import type { CalculatorState, PriceLine, PriceResult } from "@/lib/calculator-types";

const POSTCODE_REGEX = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/;

export function isValidPostcode(value: string): boolean {
  return POSTCODE_REGEX.test(value.trim());
}

export function normalizePostcode(value: string): string {
  const cleaned = value.replace(/\s+/g, "").toUpperCase();
  return cleaned.length === 6 ? `${cleaned.slice(0, 4)} ${cleaned.slice(4)}` : cleaned;
}

export function transportZoneForPostcode(postcode: string) {
  if (!isValidPostcode(postcode)) return null;
  const digits = Number(postcode.replace(/\s+/g, "").slice(0, 2));
  return pricing.transportZones.find((z) => digits >= z.from && digits <= z.to) ?? null;
}

function toNumber(value: string | number): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Rondt omhoog af op 0,1 m³. */
export function roundUpToTenth(value: number): number {
  return Math.ceil(Math.round(value * 1000) / 100) / 10;
}

export function getConcreteType(id: string) {
  return concreteTypes.find((c) => c.id === id) ?? null;
}

export function getProjectType(id: string) {
  return projectTypes.find((p) => p.id === id) ?? null;
}

/** Indicatief betonsoortadvies op basis van het projecttype. */
export function advisedConcreteFor(projectType: ProjectTypeId | ""): ConcreteTypeId {
  const project = projectTypes.find((p) => p.id === projectType);
  return (project?.advisedConcrete ?? "standaard") as ConcreteTypeId;
}

export function resolveConcreteTypeId(state: CalculatorState): ConcreteTypeId {
  if (state.concreteType && state.concreteType !== "onbekend") {
    return state.concreteType as ConcreteTypeId;
  }
  return advisedConcreteFor(state.projectType);
}

export function computeVolumes(state: CalculatorState) {
  const net =
    state.volumeMode === "known"
      ? toNumber(state.knownVolume)
      : toNumber(state.length) *
        toNumber(state.width) *
        (toNumber(state.thicknessCm) / 100) *
        Math.max(1, Math.round(toNumber(state.surfaces) || 1));

  const netVolume = Math.max(0, Math.round(net * 1000) / 1000);
  const marginVolume = state.useSafetyMargin ? netVolume * pricing.safetyMarginRate : 0;
  const rawOrder = netVolume + marginVolume;
  const orderVolume = rawOrder > 0 ? Math.max(pricing.minimumOrderM3, roundUpToTenth(rawOrder)) : 0;

  return {
    netVolume,
    marginVolume: Math.round(marginVolume * 100) / 100,
    orderVolume,
  };
}

function isSaturday(dateValue: string): boolean {
  if (!dateValue) return false;
  const parsed = new Date(`${dateValue}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed.getDay() === 6;
}

/** Adviseert een betonpomp op basis van bereikbaarheid en afstand. */
export function needsPumpAdvice(state: CalculatorState): boolean {
  const distance = toNumber(state.distanceMeters);
  return state.accessWithinFourMeters === "nee" || distance > 4;
}

export function calculatePrice(state: CalculatorState): PriceResult {
  const { netVolume, marginVolume, orderVolume } = computeVolumes(state);
  const lines: PriceLine[] = [];

  const concrete = getConcreteType(resolveConcreteTypeId(state));
  const pricePerM3 = concrete?.pricePerM3 ?? 0;

  if (orderVolume > 0 && concrete) {
    lines.push({
      label: concrete.label,
      detail: `${orderVolume.toLocaleString("nl-NL", { minimumFractionDigits: 1 })} m³ × € ${pricePerM3.toFixed(2)} per m³`,
      amount: Math.round(orderVolume * pricePerM3 * 100) / 100,
    });
  }

  const zone = transportZoneForPostcode(state.postcode);
  const transportFee = zone ? zone.fee : pricing.fallbackTransportFee;
  lines.push({
    label: "Transportkosten",
    detail: zone ? `${zone.label} (postcodegebied ${zone.from}–${zone.to})` : "Indicatief tarief, zone nog niet bekend",
    amount: transportFee,
  });

  if (orderVolume > 0 && orderVolume < pricing.smallOrderThresholdM3) {
    lines.push({
      label: "Kleine-bestellingstoeslag",
      detail: `Bij minder dan ${pricing.smallOrderThresholdM3} m³`,
      amount: pricing.smallOrderFee,
    });
  }

  if (state.unloadingMethod === "pomp") {
    lines.push({
      label: "Inzet betonpomp",
      detail: `Inclusief ${pricing.includedHoseMeters} meter slang`,
      amount: pricing.pumpFee,
    });

    const extraHose = Math.max(0, Math.round(toNumber(state.extraHoseMeters)));
    if (extraHose > 0) {
      lines.push({
        label: "Extra meters pompslang",
        detail: `${extraHose} meter × € ${pricing.pricePerExtraHoseMeter.toFixed(2)}`,
        amount: Math.round(extraHose * pricing.pricePerExtraHoseMeter * 100) / 100,
      });
    }
  }

  const minutes = Math.max(0, Math.round(toNumber(state.unloadingMinutes)));
  const extraMinutes = Math.max(0, minutes - pricing.includedUnloadingMinutes);
  if (extraMinutes > 0) {
    const blocks = Math.ceil(extraMinutes / pricing.extraUnloadingBlockMinutes);
    lines.push({
      label: "Extra lostijd",
      detail: `${blocks} × ${pricing.extraUnloadingBlockMinutes} minuten boven de inbegrepen ${pricing.includedUnloadingMinutes} minuten`,
      amount: Math.round(blocks * pricing.pricePerExtraUnloadingBlock * 100) / 100,
    });
  }

  if (!state.asap && isSaturday(state.preferredDate)) {
    lines.push({
      label: "Zaterdagtoeslag",
      detail: "Levering op zaterdag",
      amount: pricing.saturdaySurcharge,
    });
  }

  if (!state.asap && state.timeslot) {
    const surcharge = pricing.timeslotSurcharges[state.timeslot] ?? 0;
    if (surcharge > 0) {
      const slot = planning.timeslots.find((s) => s.id === state.timeslot);
      lines.push({
        label: "Tijdvaktoeslag",
        detail: slot?.label ?? state.timeslot,
        amount: surcharge,
      });
    }
  }

  const subtotal = Math.round(lines.reduce((sum, line) => sum + line.amount, 0) * 100) / 100;
  const vat = Math.round(subtotal * pricing.vatRate * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;

  return {
    netVolume,
    marginVolume,
    orderVolume,
    lines,
    subtotal,
    vat,
    total,
    hasVolume: orderVolume > 0,
  };
}

/** Eerste datum die aangevraagd kan worden (JJJJ-MM-DD). */
export function earliestDeliveryDate(from = new Date()): string {
  const date = new Date(from);
  let added = 0;
  while (added < planning.minimumLeadTimeDays) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) added += 1;
  }
  return toIsoDate(date);
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isSelectableDate(value: string): { ok: boolean; reason?: string } {
  if (!value) return { ok: false, reason: "Kies een leverdatum." };
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return { ok: false, reason: "Deze datum is ongeldig." };
  if (value < earliestDeliveryDate()) {
    return {
      ok: false,
      reason: `Kies een datum vanaf ${earliestDeliveryDate()}. Eerder leveren? Bel ons even.`,
    };
  }
  if (!planning.availableWeekdays.includes(parsed.getDay() as never)) {
    return { ok: false, reason: "Op deze dag leveren wij niet." };
  }
  if (planning.blockedDates.includes(value)) {
    return { ok: false, reason: "Deze datum is niet beschikbaar." };
  }
  return { ok: true };
}

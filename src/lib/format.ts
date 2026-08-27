const currency = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const numberNl = new Intl.NumberFormat("nl-NL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatEuro(value: number): string {
  return currency.format(Number.isFinite(value) ? value : 0);
}

export function formatVolume(value: number): string {
  return `${numberNl.format(Number.isFinite(value) ? value : 0)} m³`;
}

export function formatDateNl(value: string): string {
  if (!value) return "";
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

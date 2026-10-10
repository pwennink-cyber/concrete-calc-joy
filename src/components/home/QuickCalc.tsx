import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calculator as CalcIcon } from "lucide-react";
import { pricing } from "@/config/site";
import { formatNumber } from "@/lib/format";

export function QuickCalc() {
  const [l, setL] = useState("");
  const [b, setB] = useState("");
  const [d, setD] = useState("");
  const n = (v: string) => Number(v.replace(",", ".")) || 0;
  const net = n(l) * n(b) * (n(d) / 100);
  const advised = Math.ceil(net * (1 + pricing.safetyMarginRate) * 10 - 1e-9) / 10;

  const field = (id: string, label: string, v: string, set: (s: string) => void, unit: string) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{label}</label>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          value={v}
          onChange={(e) => set(e.target.value)}
          className="h-12 w-full rounded-md border border-input bg-background px-3 pr-10"
          placeholder="0"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );

  return (
    <div id="calculator" className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <CalcIcon className="h-4 w-4" aria-hidden /> Stap 1 van de prijscalculator
      </div>
      <h2 className="mt-2 text-xl font-extrabold">Hoeveel beton heb je nodig?</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {field("qc-l", "Lengte", l, setL, "m")}
        {field("qc-b", "Breedte", b, setB, "m")}
        {field("qc-d", "Dikte", d, setD, "cm")}
      </div>
      <div className="mt-4 rounded-md bg-secondary p-4" aria-live="polite">
        <p className="text-sm text-muted-foreground">Aanbevolen bestelhoeveelheid (incl. 5% marge)</p>
        <p className="text-2xl font-extrabold">{net > 0 ? `${formatNumber(advised)} m³` : "– m³"}</p>
      </div>
      <Link
        to="/bestellen"
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Bereken je betonprijs <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <p className="mt-3 text-xs text-muted-foreground">In de volledige calculator kies je betonsoort, levering en datum en zie je direct je prijs.</p>
    </div>
  );
}

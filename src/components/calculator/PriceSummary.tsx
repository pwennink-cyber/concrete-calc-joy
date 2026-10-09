import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PriceResult } from "@/lib/calculator-types";
import { formatEuro, formatVolume } from "@/lib/format";

export function PriceSummary({ result }: { result: PriceResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">Jouw prijsindicatie</h3>
        {result.hasVolume && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
            {formatVolume(result.orderVolume)}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Benodigd volume</span>
          <span className="font-medium text-foreground">{formatVolume(result.netVolume)}</span>
        </div>
        {result.marginVolume > 0 && (
          <div className="flex justify-between">
            <span>Incl. 5% marge</span>
            <span className="font-medium text-foreground">{formatVolume(result.orderVolume)}</span>
          </div>
        )}
      </div>

      {result.lines.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            Prijsopbouw
            {expanded ? (
              <ChevronUp className="size-4" aria-hidden />
            ) : (
              <ChevronDown className="size-4" aria-hidden />
            )}
          </button>
          {expanded && (
            <ul className="mt-3 space-y-2 text-sm">
              {result.lines.map((line, i) => (
                <li key={`${line.label}-${i}`} className="flex items-start justify-between gap-3">
                  <span>
                    <span className="font-medium">{line.label}</span>
                    {line.detail && (
                      <span className="block text-xs text-muted-foreground">{line.detail}</span>
                    )}
                  </span>
                  <span className="whitespace-nowrap font-medium">{formatEuro(line.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <dl className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <dt>Subtotaal excl. btw</dt>
          <dd>{formatEuro(result.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <dt>Btw (21%)</dt>
          <dd>{formatEuro(result.vat)}</dd>
        </div>
        <div className="flex justify-between text-base font-bold text-foreground">
          <dt>Totaal incl. btw</dt>
          <dd className="text-primary">{formatEuro(result.total)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Dit is een indicatieve prijs. Wij controleren je aanvraag en bevestigen de definitieve prijs.
      </p>
    </div>
  );
}

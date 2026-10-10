import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Printer } from "lucide-react";
import { contact } from "@/config/site";

export const Route = createFileRoute("/bevestiging/$aanvraagnummer")({
  head: () => ({
    meta: [
      { title: "Bevestiging van je aanvraag | BetaalbaarBeton.nl" },
      { name: "description", content: "Je reserveringsaanvraag voor een betonlevering is ontvangen." },
      { property: "og:title", content: "Bevestiging van je aanvraag | BetaalbaarBeton.nl" },
      { property: "og:description", content: "Je reserveringsaanvraag voor een betonlevering is ontvangen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Bevestiging,
});

function Bevestiging() {
  const { aanvraagnummer } = Route.useParams();
  const steps = [
    "Wij controleren je gegevens, de leverlocatie en de bereikbaarheid.",
    "We kijken of de betonsoort past bij je project en of je gewenste planning mogelijk is.",
    "Je ontvangt van ons een definitieve bevestiging met de definitieve prijs.",
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-10">
        <CheckCircle2 className="h-12 w-12 text-success" aria-hidden />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Bedankt voor je aanvraag bij BetaalbaarBeton.nl.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We controleren je gegevens, leverlocatie en gewenste planning. Je ontvangt zo snel mogelijk een definitieve bevestiging.
        </p>
        <div className="mt-6 rounded-md bg-secondary p-5">
          <p className="text-sm text-muted-foreground">Jouw aanvraagnummer</p>
          <p className="text-2xl font-extrabold tracking-wide">{aanvraagnummer}</p>
          <p className="mt-1 text-sm text-muted-foreground">Noem dit nummer als je contact met ons opneemt.</p>
        </div>
        <h2 className="mt-8 text-xl font-bold">Wat gebeurt er nu?</h2>
        <ol className="mt-3 space-y-3">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-anthracite text-sm font-bold text-anthracite-foreground">{i + 1}</span>{s}</li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted-foreground">Je aanvraag is nog niet definitief. Vragen? Bel {contact.phone} of mail {contact.email}.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row print:hidden">
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border px-5 font-bold hover:border-foreground">
            <Printer className="h-4 w-4" aria-hidden />Print of bewaar als PDF
          </button>
          <Link to="/" className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90">Terug naar de homepage</Link>
        </div>
      </div>
    </div>
  );
}

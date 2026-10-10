import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, CalendarCheck, Calculator, CheckCircle2, ClipboardCheck, Building2, Factory,
  Home, Layers, Warehouse, Route as RouteIcon, Eye, MousePointerClick, UserCheck, Users,
  HelpCircle, Truck, Phone, MessageCircle, MapPin, Loader2, ChevronDown,
} from "lucide-react";
import { contact, faqItems } from "@/config/site";
import { isValidPostcode, transportZoneForPostcode } from "@/lib/pricing";
import { submitCallbackRequest } from "@/lib/booking.functions";
import heroImg from "@/assets/hero-betonstorting.jpg";
import vloerImg from "@/assets/toepassingen-vloer.jpg";
import wijkImg from "@/assets/levering-wijk.jpg";
import { QuickCalc } from "./QuickCalc";

const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 font-bold text-primary-foreground transition-colors hover:bg-primary/90";
const btnSecondary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 font-bold text-foreground transition-colors hover:border-foreground";

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {intro && <p className="mt-3 text-lg text-muted-foreground">{intro}</p>}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-anthracite text-anthracite-foreground">
      <img src={heroImg} alt="Betonmixer stort beton via een goot in de bekisting van een fundering" className="absolute inset-0 h-full w-full object-cover opacity-30" width={1920} height={1080} fetchPriority="high" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Betaalbaar beton, direct voor jouw project.</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">Bereken binnen enkele minuten je prijs en plan eenvoudig jouw betonlevering.</p>
          <ul className="mt-6 space-y-2">
            {["Transparante prijsindicatie", "Levering op jouw gewenste datum", "Voor particulier en professional"].map((t) => (
              <li key={t} className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />{t}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/bestellen" className={btnPrimary}>Bereken je betonprijs <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <a href="#contact" className="inline-flex min-h-12 items-center justify-center rounded-md border border-anthracite-foreground/40 px-5 font-bold hover:border-anthracite-foreground">Vraag persoonlijk advies</a>
          </div>
        </div>
        <div className="text-foreground"><QuickCalc /></div>
      </div>
    </section>
  );
}

export function Workflow() {
  const steps = [
    { icon: Calculator, title: "Bereken je prijs", text: "Vul je project in de calculator in en zie direct een indicatieve prijs met alle kosten apart." },
    { icon: CalendarCheck, title: "Kies je levermoment", text: "Geef je gewenste datum en tijdvak door en verstuur je reserveringsaanvraag." },
    { icon: ClipboardCheck, title: "Controle en bevestiging", text: "Wij controleren locatie, bereikbaarheid en planning en bevestigen daarna je levering." },
  ];
  return (
    <section id="werkwijze" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHead eyebrow="Werkwijze" title="Van berekening naar levering in drie stappen" />
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="border-t-4 border-primary pt-5">
            <div className="flex items-center gap-3"><span className="text-3xl font-extrabold text-concrete-strong">0{i + 1}</span><s.icon className="h-6 w-6 text-primary" aria-hidden /></div>
            <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Applications() {
  const items = [
    { icon: Layers, title: "Funderingen", text: "Stroken, poeren en plaatfunderingen met stevig funderingsbeton." },
    { icon: Home, title: "Woningvloeren", text: "Goed af te werken vloerbeton voor begane grond en verdiepingen." },
    { icon: RouteIcon, title: "Opritten en terrassen", text: "Vorstbestendig of fijn beton voor buitenwerk dat lang meegaat." },
    { icon: Warehouse, title: "Schuren en aanbouwen", text: "Beton voor vloer en fundering van je schuur, garage of uitbouw." },
    { icon: Factory, title: "Bedrijfsvloeren", text: "Grotere hoeveelheden vloerbeton, met pomp en planning op maat." },
    { icon: Building2, title: "Zakelijke bouwprojecten", text: "Voor aannemers en vakmensen: heldere prijzen en vaste afspraken." },
  ];
  return (
    <section id="toepassingen" className="scroll-mt-24 bg-secondary py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHead eyebrow="Toepassingen" title="Beton voor ieder project" intro="Of je nu een terras stort of een bedrijfsvloer laat leveren: je berekent het op dezelfde eenvoudige manier." />
          <img src={vloerImg} alt="Vakmannen werken een vers gestorte betonvloer af" loading="lazy" width={1600} height={1000} className="mt-8 aspect-[4/3] w-full rounded-lg object-cover" />
        </div>
        <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {items.map((it) => (
            <li key={it.title} className="flex flex-col bg-card p-6">
              <it.icon className="h-7 w-7 text-primary" aria-hidden />
              <h3 className="mt-3 text-lg font-bold">{it.title}</h3>
              <p className="mt-1 flex-1 text-muted-foreground">{it.text}</p>
              <Link to="/bestellen" className="mt-4 inline-flex items-center gap-1 font-bold text-foreground hover:text-primary">Bereken mijn prijs <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Benefits() {
  const items = [
    { icon: Eye, title: "Transparante prijsopbouw", text: "Elke kostenpost apart zichtbaar, excl. en incl. btw." },
    { icon: MousePointerClick, title: "Eenvoudig online aanvragen", text: "In een paar minuten van berekening naar aanvraag." },
    { icon: UserCheck, title: "Persoonlijke controle", text: "Wij checken elke aanvraag vóór de levering wordt bevestigd." },
    { icon: Users, title: "Particulier én professional", text: "Eén heldere werkwijze voor iedereen die beton nodig heeft." },
    { icon: HelpCircle, title: "Hulp bij de juiste betonsoort", text: "Twijfel je? Wij denken mee over de beste keuze." },
    { icon: Truck, title: "Levering via regionale partners", text: "Beton van een centrale in jouw regio, vers op locatie." },
  ];
  return (
    <section id="voordelen" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHead eyebrow="Voordelen" title="Waarom BetaalbaarBeton.nl?" />
      <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-anthracite text-primary"><it.icon className="h-5 w-5" aria-hidden /></span>
            <div><h3 className="font-bold">{it.title}</h3><p className="mt-1 text-muted-foreground">{it.text}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DeliveryArea() {
  const [pc, setPc] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPostcode(pc)) {
      setMsg({ ok: false, text: "Vul een geldige postcode in, bijvoorbeeld 1234 AB." });
      return;
    }
    const zone = transportZoneForPostcode(pc);
    setMsg({
      ok: true,
      text: `Je postcode valt in ${zone ? zone.label : "ons werkgebied"}. Bereken je prijs om transportkosten te zien. Wij controleren beschikbaarheid en bereikbaarheid na je aanvraag.`,
    });
  }
  return (
    <section id="levergebied" className="scroll-mt-24 bg-anthracite py-16 text-anthracite-foreground lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Levergebied</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Beton leveren in heel Nederland, via regionale partners</h2>
          <p className="mt-3 text-lg opacity-90">Wij werken met een netwerk van regionale betoncentrales. Beschikbaarheid verschilt per postcode en planning; daarom controleren we elke aanvraag persoonlijk.</p>
          <form onSubmit={check} className="mt-6 flex flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor="pc-check" className="sr-only">Postcode</label>
            <input id="pc-check" value={pc} onChange={(e) => setPc(e.target.value)} placeholder="1234 AB" autoComplete="postal-code" className="h-12 flex-1 rounded-md border border-input bg-background px-3 text-foreground" />
            <button type="submit" className={btnPrimary}><MapPin className="h-4 w-4" aria-hidden />Controleer mijn postcode</button>
          </form>
          {msg && <p role="status" className={`mt-3 font-semibold ${msg.ok ? "text-success-soft" : "text-primary"}`}>{msg.text}</p>}
        </div>
        <img src={wijkImg} alt="Betonmixer levert beton in een woonwijk" loading="lazy" width={1600} height={1000} className="aspect-[4/3] w-full rounded-lg object-cover" />
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHead eyebrow="Veelgestelde vragen" title="Antwoord op je vragen over beton bestellen" />
      <div className="mt-8 divide-y divide-border border-y border-border">
        {faqItems.map((f) => (
          <details key={f.question} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold">
              {f.question}<ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="pb-5 text-muted-foreground">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    if (name.length < 2 || phone.replace(/\D/g, "").length < 8) {
      setState("error"); setErr("Vul je naam en een geldig telefoonnummer in."); return;
    }
    setState("sending");
    try {
      await submitCallbackRequest({ data: { website: String(fd.get("website") || ""), name, phone, preferredMoment: String(fd.get("moment") || ""), question: String(fd.get("question") || "") } });
      setState("done");
    } catch (e2) {
      setState("error");
      setErr(e2 instanceof Error && e2.message.length < 160 ? e2.message : "Versturen is niet gelukt. Probeer het opnieuw.");
    }
  }
  const input = "h-12 w-full rounded-md border border-input bg-background px-3";
  return (
    <section id="contact" className="scroll-mt-24 bg-secondary py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="Contact" title="Liever persoonlijk advies?" intro="Bel of app ons, of laat je terugbellen. We denken graag mee over hoeveelheid, betonsoort en bereikbaarheid." />
          <dl className="mt-6 space-y-2">
            <div className="flex gap-2"><dt className="font-bold">Telefoon:</dt><dd>{contact.phone}</dd></div>
            <div className="flex gap-2"><dt className="font-bold">E-mail:</dt><dd>{contact.email}</dd></div>
            <div className="flex gap-2"><dt className="font-bold">WhatsApp:</dt><dd>{contact.whatsapp}</dd></div>
            <div className="flex gap-2"><dt className="font-bold">Openingstijden:</dt><dd>{contact.openingHours}</dd></div>
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={`tel:${contact.phone}`} className={btnPrimary}><Phone className="h-4 w-4" aria-hidden />Bel ons</a>
            <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={btnSecondary}><MessageCircle className="h-4 w-4" aria-hidden />Stuur een WhatsApp</a>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-xl font-extrabold">Laat mij terugbellen</h3>
          {state === "done" ? (
            <p role="status" className="mt-4 flex items-start gap-2 font-semibold text-success"><CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />Bedankt! We bellen je zo snel mogelijk terug.</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
              <div className="hidden" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <div><label htmlFor="cb-name" className="mb-1 block text-sm font-semibold">Naam</label><input id="cb-name" name="name" required autoComplete="name" className={input} /></div>
              <div><label htmlFor="cb-phone" className="mb-1 block text-sm font-semibold">Telefoonnummer</label><input id="cb-phone" name="phone" type="tel" required autoComplete="tel" className={input} /></div>
              <div><label htmlFor="cb-moment" className="mb-1 block text-sm font-semibold">Gewenst terugbelmoment</label><input id="cb-moment" name="moment" placeholder="Bijv. dinsdagochtend" className={input} /></div>
              <div><label htmlFor="cb-q" className="mb-1 block text-sm font-semibold">Korte vraag (optioneel)</label><textarea id="cb-q" name="question" rows={3} maxLength={600} className="w-full rounded-md border border-input bg-background p-3" /></div>
              {state === "error" && <p role="alert" className="font-semibold text-destructive">{err}</p>}
              <button type="submit" disabled={state === "sending"} className={`${btnPrimary} w-full disabled:opacity-60`}>
                {state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Versturen…</> : "Verstuur terugbelverzoek"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

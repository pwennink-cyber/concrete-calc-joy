# BetaalbaarBeton.nl — complete website met werkende betoncalculator

Een Nederlandstalige, conversiegerichte site met een volledig werkende prijscalculator, boekingsflow en veilige opslag in Lovable Cloud. Alle bedrijfsgegevens en tarieven komen uit één centraal configuratiebestand met duidelijke placeholders.

## Visuele richting

- Donker antraciet, warm gebroken wit, helder oranje accent, betongrijs; groen alleen voor bevestigingen.
- Manrope als hoofdlettertype, stevige koppen, ruime witruimte, licht afgeronde hoeken, subtiele schaduwen, Lucide-iconen.
- Twee tot drie gegenereerde, realistische bouwfoto's: hero (betonstorting), toepassingen, levergebied/werkwijze.
- Respecteert `prefers-reduced-motion`.

## Pagina's

- `/` — hero met calculator, werkwijze, toepassingen, voordelen, levergebied, FAQ, contact
- `/bestellen` — volledige calculator + boekingsflow
- `/bevestiging/$aanvraagnummer` — bevestigingspagina (printbaar)
- `/voorwaarden`, `/privacy`, `/cookies`
- Sticky header met navigatie, telefoonknop en oranje "Bereken je prijs"; toegankelijk mobiel menu.

## Calculator (5 stappen, staat blijft behouden)

1. Postcode (4 cijfers + 2 letters), huisnummer, klanttype, projecttype
2. Hoeveelheid: zelf invoeren of berekenen (l × b × d/100 × aantal), 5% marge met schakelaar, afronden omhoog op 0,1 m³
3. Betonsoort met korte uitleg; bij "Ik weet het niet" een indicatief advies op basis van projecttype
4. Bereikbaarheid, losmethode, lostijd, afstand, obstakels, extra slangmeters + contextuele meldingen (bijv. pomp waarschijnlijk nodig)
5. Levermoment: datum (verleden geblokkeerd), tijdvak, "zo snel mogelijk", "flexibel"

Prijskaart is sticky op desktop, compacte sticky onderbalk op mobiel; prijsregels uitklapbaar; prijs werkt live bij.

## Prijsberekening

Alle tarieven in `src/config/site.ts`: m³-prijs per betonsoort, minimum afname, kleine-bestellingstoeslag, transportzones per postcodecijfer, pompkosten, slangmeters, extra lostijd, zaterdag- en tijdvaktoeslag, 21% btw. Uitsplitsing per regel → subtotaal excl. btw → btw → totaal incl. btw, met duidelijke disclaimer dat de prijs indicatief is.

## Boekingsflow en opslag

Formulier met contact-, lever- en factuurgegevens, opmerkingen, akkoordvinkjes; volledige samenvatting vóór verzenden. Verzending via een server function met Zod-validatie, honeypot, rate limiting en bescherming tegen dubbele inzending. Aanvraagnummer `BB-2026-000123`. Daarna bevestigingspagina met samenvatting, vervolgstappen en printknop. Geen persoonsgegevens in localStorage.

## Backend

Lovable Cloud aanzetten en twee tabellen maken:
- `booking_requests` — alle velden uit de aanvraag inclusief prijsregels (jsonb)
- `callback_requests` — terugbelverzoeken

RLS: publiek mag uitsluitend invoegen, niet lezen/wijzigen/verwijderen. Inserts lopen server-side met validatie.

## SEO en toegankelijkheid

Route-specifieke titels/meta/OG, canonical op betaalbaarbeton.nl, FAQ structured data, sitemap en robots.txt. Semantische HTML, labels, zichtbare focus, één H1 per pagina, toetsenbord- en screenreadervriendelijk mobiel menu.

## Technisch

React + TypeScript, Tailwind-tokens in `src/styles.css`, React Hook Form + Zod, Lucide, TanStack Start server functions. Herbruikbare componenten voor header, hero, calculator(stappen), prijsoverzicht, boekingsformulier, bevestiging, toepassingen, werkwijze, FAQ, contact, footer.

## Placeholders (centraal)

`[TELEFOONNUMMER]`, `[E-MAILADRES]`, `[WHATSAPP-NUMMER]`, `[OPENINGSTIJDEN]`, `[BEDRIJFSADRES]`, `[KVK-NUMMER]`, `[BTW-NUMMER]`. Geen verzonnen reviews, keurmerken of bedrijfsgegevens. E-mailverzending wordt niet geconfigureerd zolang er geen echt e-mailadres is; de haak daarvoor blijft aanwezig.

## Buiten scope

Accountomgeving, beheerdashboard, betalingen.

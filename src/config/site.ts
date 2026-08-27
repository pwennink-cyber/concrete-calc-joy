/**
 * Centraal configuratiebestand voor BetaalbaarBeton.nl.
 *
 * Alle bedrijfsgegevens, contactgegevens, tarieven, toeslagen en
 * planningsinstellingen staan hier. Pas uitsluitend dit bestand aan
 * wanneer definitieve gegevens of tarieven bekend zijn.
 *
 * Waarden tussen [VIERKANTE HAKEN] zijn placeholders.
 */

export const company = {
  name: "BetaalbaarBeton.nl",
  slogan: "Sterk beton. Heldere prijs.",
  promise:
    "Professioneel beton bestellen tegen een transparante en betaalbare prijs, zonder ingewikkeld proces.",
  address: "[BEDRIJFSADRES]",
  kvk: "[KVK-NUMMER]",
  vatNumber: "[BTW-NUMMER]",
} as const;

export const contact = {
  phone: "[TELEFOONNUMMER]",
  email: "[E-MAILADRES]",
  whatsapp: "[WHATSAPP-NUMMER]",
  openingHours: "[OPENINGSTIJDEN]",
  /** Interne ontvanger voor meldingen. Vul in zodra bekend. */
  internalNotificationEmail: "[E-MAILADRES]",
} as const;

export const seo = {
  siteUrl: "https://betaalbaarbeton.nl",
  homeTitle:
    "Betaalbaar beton bestellen en direct je prijs berekenen | BetaalbaarBeton.nl",
  homeDescription:
    "Bereken eenvoudig hoeveel beton je nodig hebt, ontvang een transparante prijsindicatie en vraag direct jouw betonlevering aan bij BetaalbaarBeton.nl.",
} as const;

/* -------------------------------------------------------------------------
 * Projecttypen
 * ---------------------------------------------------------------------- */

export const projectTypes = [
  { id: "fundering", label: "Fundering", advisedConcrete: "funderingsbeton" },
  { id: "woningvloer", label: "Woningvloer", advisedConcrete: "vloerbeton" },
  { id: "oprit", label: "Oprit", advisedConcrete: "vorstbestendig" },
  { id: "terras", label: "Terras", advisedConcrete: "fijn" },
  { id: "schuur", label: "Schuur of aanbouw", advisedConcrete: "standaard" },
  { id: "bedrijfsvloer", label: "Bedrijfsvloer", advisedConcrete: "vloerbeton" },
  { id: "anders", label: "Ander project", advisedConcrete: "standaard" },
] as const;

export type ProjectTypeId = (typeof projectTypes)[number]["id"];

/* -------------------------------------------------------------------------
 * Betonsoorten en m³-prijzen (voorbeeldtarieven, excl. btw)
 * ---------------------------------------------------------------------- */

export const concreteTypes = [
  {
    id: "standaard",
    label: "Standaard constructiebeton",
    description: "Veelzijdig beton voor algemene bouwwerken en constructies.",
    pricePerM3: 105,
  },
  {
    id: "funderingsbeton",
    label: "Funderingsbeton",
    description: "Stevig beton voor funderingen, poeren en fundamentstroken.",
    pricePerM3: 102,
  },
  {
    id: "vloerbeton",
    label: "Vloerbeton",
    description: "Goed vlak af te werken beton voor woning- en bedrijfsvloeren.",
    pricePerM3: 110,
  },
  {
    id: "fijn",
    label: "Fijn beton",
    description: "Fijnere korrel, prettig voor dunnere lagen en gladde afwerking.",
    pricePerM3: 116,
  },
  {
    id: "vloeibaar",
    label: "Vloeibaar beton",
    description: "Zeer vloeibaar beton dat zichzelf verdeelt. Minder trilwerk nodig.",
    pricePerM3: 124,
  },
  {
    id: "vorstbestendig",
    label: "Vorstbestendig beton",
    description: "Beter bestand tegen vorst en dooizout. Geschikt voor buitenwerk.",
    pricePerM3: 121,
  },
] as const;

export type ConcreteTypeId = (typeof concreteTypes)[number]["id"];

export const UNKNOWN_CONCRETE = "onbekend" as const;

/* -------------------------------------------------------------------------
 * Tarieven en toeslagen (voorbeeldwaarden, excl. btw)
 * ---------------------------------------------------------------------- */

export const pricing = {
  /** Btw-percentage als factor. */
  vatRate: 0.21,
  /** Minimale bestelhoeveelheid in m³. */
  minimumOrderM3: 1,
  /** Onder deze hoeveelheid geldt een kleine-bestellingstoeslag. */
  smallOrderThresholdM3: 3,
  smallOrderFee: 75,
  /** Standaard veiligheidsmarge (5%). */
  safetyMarginRate: 0.05,
  /** Transportkosten per postcodezone (eerste twee cijfers van de postcode). */
  transportZones: [
    { id: "zone-1", label: "Zone 1", from: 10, to: 39, fee: 95 },
    { id: "zone-2", label: "Zone 2", from: 40, to: 59, fee: 115 },
    { id: "zone-3", label: "Zone 3", from: 60, to: 79, fee: 135 },
    { id: "zone-4", label: "Zone 4", from: 80, to: 99, fee: 155 },
  ],
  /** Gebruikt wanneer de postcode nog niet bekend is. */
  fallbackTransportFee: 115,
  /** Inzet betonpomp. */
  pumpFee: 395,
  /** Aantal meters slang dat bij de pompprijs is inbegrepen. */
  includedHoseMeters: 20,
  pricePerExtraHoseMeter: 8.5,
  /** Inbegrepen lostijd in minuten en tarief voor extra lostijd. */
  includedUnloadingMinutes: 30,
  pricePerExtraUnloadingBlock: 45,
  extraUnloadingBlockMinutes: 15,
  /** Toeslag voor levering op zaterdag. */
  saturdaySurcharge: 145,
  /** Toeslag per tijdvak. */
  timeslotSurcharges: {
    "07-09": 45,
    "09-12": 0,
    "12-15": 0,
    "15-17": 25,
  } as Record<string, number>,
} as const;

/* -------------------------------------------------------------------------
 * Planning
 * ---------------------------------------------------------------------- */

export const planning = {
  /** 0 = zondag ... 6 = zaterdag. Leverdagen die aangevraagd kunnen worden. */
  availableWeekdays: [1, 2, 3, 4, 5, 6],
  /** Datums die niet aangevraagd kunnen worden, formaat JJJJ-MM-DD. */
  blockedDates: ["2026-12-25", "2026-12-26", "2027-01-01"] as string[],
  /** Minimaal aantal werkdagen tussen aanvraag en gewenste leverdatum. */
  minimumLeadTimeDays: 2,
  timeslots: [
    { id: "07-09", label: "07:00 – 09:00 (vroege levering)" },
    { id: "09-12", label: "09:00 – 12:00" },
    { id: "12-15", label: "12:00 – 15:00" },
    { id: "15-17", label: "15:00 – 17:00" },
  ],
} as const;

/* -------------------------------------------------------------------------
 * Losmethoden
 * ---------------------------------------------------------------------- */

export const unloadingMethods = [
  {
    id: "mixer",
    label: "Rechtstreeks vanuit de betonmixer",
    description: "De mixer stort via de goot direct op de stortplaats.",
  },
  {
    id: "kruiwagen",
    label: "Met kruiwagens",
    description: "Je verplaatst het beton zelf met kruiwagens naar de stortplaats.",
  },
  {
    id: "pomp",
    label: "Met een betonpomp",
    description: "Handig bij grotere afstand, hoogte of moeilijk bereikbare plekken.",
  },
  {
    id: "advies",
    label: "Ik wil hierover advies",
    description: "Wij denken mee over de beste losmethode voor jouw situatie.",
  },
] as const;

export type UnloadingMethodId = (typeof unloadingMethods)[number]["id"];

export const navLinks = [
  { label: "Beton bestellen", to: "/bestellen" },
  { label: "Prijscalculator", to: "/bestellen", hash: "calculator" },
  { label: "Werkwijze", to: "/", hash: "werkwijze" },
  { label: "Toepassingen", to: "/", hash: "toepassingen" },
  { label: "Levergebied", to: "/", hash: "levergebied" },
  { label: "Veelgestelde vragen", to: "/", hash: "faq" },
  { label: "Contact", to: "/", hash: "contact" },
] as const;

export const faqItems = [
  {
    question: "Hoe bereken ik hoeveel beton ik nodig heb?",
    answer:
      "Vermenigvuldig de lengte, de breedte en de dikte van je oppervlak. Reken in meters en deel de dikte in centimeters door 100. Onze calculator doet dit automatisch en telt standaard 5% veiligheidsmarge op voor morsen en kleine meetverschillen.",
  },
  {
    question: "Wat is de minimale bestelhoeveelheid?",
    answer:
      "In de calculator rekenen wij met een minimum van 1 m³. Onder 3 m³ geldt een kleine-bestellingstoeslag. De definitieve minimumhoeveelheid kan per regionale leverancier verschillen. Wij bevestigen dit bij je aanvraag.",
  },
  {
    question: "Is de berekende prijs definitief?",
    answer:
      "Nee. De calculator geeft een indicatieve prijs op basis van de gegevens die je invult. Wij controleren de leverlocatie, bereikbaarheid, betonsoort en planning en bevestigen daarna de definitieve prijs.",
  },
  {
    question: "Wanneer heb ik een betonpomp nodig?",
    answer:
      "Een betonpomp is meestal nodig wanneer de betonwagen niet binnen ongeveer vier meter van de stortplaats kan komen, of wanneer je op hoogte, achter een woning of over een obstakel moet storten. Twijfel je? Kies dan voor advies, dan kijken wij met je mee.",
  },
  {
    question: "Kan een betonwagen mijn locatie bereiken?",
    answer:
      "Een betonwagen is zwaar en breed en heeft een stevige, verharde ondergrond nodig. Smalle straten, lage doorrijhoogtes en zachte bermen kunnen een probleem zijn. Geef dit in de calculator aan, dan beoordelen wij de situatie vóór de bevestiging.",
  },
  {
    question: "Hoe lang van tevoren moet ik bestellen?",
    answer:
      "Plan je levering bij voorkeur enkele werkdagen vooruit. In de calculator kun je minimaal twee werkdagen vooruit reserveren. Heb je het beton eerder nodig? Neem dan telefonisch contact op, dan kijken wij naar de mogelijkheden.",
  },
  {
    question: "Kan ik als particulier beton bestellen?",
    answer:
      "Ja. BetaalbaarBeton.nl levert aan zowel particulieren als aan aannemers, vloerenbedrijven, hoveniers en zzp'ers. Je kiest in de calculator zelf of je particulier of zakelijk bestelt.",
  },
  {
    question: "Welke betonsoort heb ik nodig?",
    answer:
      "Dat hangt af van je project. Voor funderingen gebruik je funderingsbeton, voor vloeren vloerbeton en voor buitenwerk vaak vorstbestendig beton. Weet je het niet zeker? Kies dan 'Ik weet het niet'; wij geven een indicatief advies en controleren de geschiktheid.",
  },
  {
    question: "Wat gebeurt er als mijn leverlocatie niet bereikbaar is?",
    answer:
      "Wij nemen contact met je op en bespreken de mogelijkheden, bijvoorbeeld een betonpomp, een andere stortplaats of een aangepaste planning. Je aanvraag wordt pas definitief nadat de bereikbaarheid is gecontroleerd.",
  },
  {
    question: "Kan ik mijn gewenste leverdatum nog aanpassen?",
    answer:
      "Zolang de levering nog niet definitief is bevestigd, kun je je voorkeursdatum in overleg aanpassen. Neem hiervoor contact met ons op. Voorwaarden voor wijzigen of annuleren na bevestiging: [ALGEMENE VOORWAARDEN].",
  },
  {
    question: "Hoe lang mag het lossen duren?",
    answer:
      "In de calculator rekenen wij standaard met 30 minuten lostijd. Heb je meer tijd nodig, geef dat dan aan. Extra lostijd rekenen wij per kwartier en zie je terug als aparte prijsregel.",
  },
  {
    question: "Wat gebeurt er na mijn reserveringsaanvraag?",
    answer:
      "Je ontvangt direct een aanvraagnummer. Wij controleren je gegevens, de leverlocatie, de betonsoort en de planning en nemen daarna contact met je op om de levering definitief te bevestigen.",
  },
] as const;

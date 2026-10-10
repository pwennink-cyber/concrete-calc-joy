import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/layout/LegalPage";
import { company } from "@/config/site";

export const Route = createFileRoute("/voorwaarden")({
  head: () => legalHead("Algemene voorwaarden", "De algemene voorwaarden van BetaalbaarBeton.nl voor aanvragen en betonleveringen."),
  component: () => (
    <LegalPage title="Algemene voorwaarden">
      <p>De definitieve algemene voorwaarden van {company.name} worden hier binnenkort gepubliceerd: [ALGEMENE VOORWAARDEN].</p>
      <h2>Aanvragen via de website</h2>
      <p>Een aanvraag via de calculator is een reserveringsaanvraag en nog geen definitieve opdracht. De getoonde prijs is indicatief. Een levering is pas definitief nadat wij locatie, bereikbaarheid, betonsoort en planning hebben gecontroleerd en de levering aan je hebben bevestigd.</p>
      <h2>Bedrijfsgegevens</h2>
      <p>{company.name}, {company.address}. KvK: {company.kvk}. Btw: {company.vatNumber}.</p>
    </LegalPage>
  ),
});

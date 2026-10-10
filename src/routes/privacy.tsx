import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/layout/LegalPage";
import { company, contact } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => legalHead("Privacyverklaring", "Welke gegevens BetaalbaarBeton.nl opslaat bij een aanvraag of terugbelverzoek, en waarom."),
  component: () => (
    <LegalPage title="Privacyverklaring">
      <p>{company.name} gaat zorgvuldig om met je persoonsgegevens. Hieronder lees je welke gegevens we opslaan en waarom.</p>
      <h2>Welke gegevens slaan we op?</h2>
      <ul>
        <li>Bij een reserveringsaanvraag: naam, eventueel bedrijfsnaam, e-mailadres, telefoonnummer, lever- en factuuradres, projectgegevens, gewenste levering en opmerkingen.</li>
        <li>Bij een terugbelverzoek: naam, telefoonnummer, gewenst terugbelmoment en je vraag.</li>
      </ul>
      <h2>Waarom?</h2>
      <p>Uitsluitend om je aanvraag te beoordelen, contact met je op te nemen en de levering te plannen en te factureren.</p>
      <h2>Opslag en beveiliging</h2>
      <p>Gegevens worden beveiligd opgeslagen en zijn niet openbaar in te zien. We slaan geen persoonsgegevens op in je browser.</p>
      <h2>Je rechten</h2>
      <p>Je kunt je gegevens inzien, laten corrigeren of laten verwijderen via {contact.email}. Bewaartermijnen en verdere details: [PRIVACYVERKLARING].</p>
    </LegalPage>
  ),
});

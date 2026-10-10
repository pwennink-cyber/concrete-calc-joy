import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/layout/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => legalHead("Cookiebeleid", "BetaalbaarBeton.nl gebruikt alleen noodzakelijke technische opslag en geen trackingcookies."),
  component: () => (
    <LegalPage title="Cookiebeleid">
      <p>Deze website gebruikt geen tracking- of advertentiecookies. Daarom tonen we ook geen cookiebanner.</p>
      <h2>Noodzakelijke opslag</h2>
      <p>Tijdens het invullen van de calculator onthoudt je browser tijdelijk je projectkeuzes, zodat je terug kunt gaan zonder opnieuw te beginnen. Persoonsgegevens worden daarbij niet opgeslagen.</p>
      <h2>Wijzigingen</h2>
      <p>Gaan we in de toekomst analytische of andere niet-noodzakelijke cookies gebruiken, dan vragen we eerst je toestemming.</p>
    </LegalPage>
  ),
});

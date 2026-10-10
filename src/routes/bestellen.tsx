import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/config/site";
import { Calculator } from "@/components/calculator/Calculator";

const title = "Beton bestellen en prijs berekenen per m³ | BetaalbaarBeton.nl";
const description =
  "Bereken stap voor stap hoeveel beton je nodig hebt, zie direct je prijs incl. btw en vraag je betonlevering aan op je gewenste datum.";

export const Route = createFileRoute("/bestellen")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${seo.siteUrl}/bestellen` }],
  }),
  component: Bestellen,
});

function Bestellen() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Beton bestellen</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
        Doorloop vijf korte stappen. Je prijs wordt bij iedere keuze direct bijgewerkt.
      </p>
      <div id="calculator" className="mt-8 scroll-mt-24">
        <Calculator />
      </div>
    </div>
  );
}

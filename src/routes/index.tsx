import { createFileRoute } from "@tanstack/react-router";
import { faqItems, seo } from "@/config/site";
import { Applications, Benefits, Contact, DeliveryArea, Faq, Hero, Workflow } from "@/components/home/Sections";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: seo.homeTitle },
      { name: "description", content: seo.homeDescription },
      { property: "og:title", content: seo.homeTitle },
      { property: "og:description", content: seo.homeDescription },
      { property: "og:url", content: seo.siteUrl },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: seo.siteUrl }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqLd) }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Workflow />
      <Applications />
      <Benefits />
      <DeliveryArea />
      <Faq />
      <Contact />
    </>
  );
}

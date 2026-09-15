import type { Metadata } from "next";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { getFAQs, getFaqsPage } from "@/lib/cms";
import { faqPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common NDS dumpster rental, residential trash and recycling, and commercial waste questions."
};

const categories = [
  { id: "dumpster", title: "Dumpster Rentals" },
  { id: "residential", title: "Residential Trash & Recycling" },
  { id: "commercial", title: "Commercial Trash & Recycling" }
] as const;

export default async function FAQPage() {
  const [page, faqs] = await Promise.all([getFaqsPage(), getFAQs()]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }} />
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">{page.hero.eyebrow}</p>
          <h1>{page.hero.heading}</h1>
          <p className="lead">{page.hero.description}</p>
        </div>
      </section>
      {categories.map((category, index) => (
        <section className={`section ${index % 2 ? "alt" : ""}`} id={category.id} key={category.id}>
          <div className="container">
            <div className="section-intro">
              <p className="eyebrow">{category.title}</p>
              <h2>{category.title} FAQs</h2>
            </div>
            <FAQAccordion faqs={faqs.filter((faq) => faq.category === category.id)} />
          </div>
        </section>
      ))}
    </>
  );
}

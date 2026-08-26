import type { Metadata } from "next";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { faqs } from "@/lib/cms/mock-data";
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

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }} />
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">FAQs</p>
          <h1>Questions about NDS service</h1>
          <p className="lead">Find quick answers for dumpster rentals, residential trash and recycling, and commercial waste service.</p>
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

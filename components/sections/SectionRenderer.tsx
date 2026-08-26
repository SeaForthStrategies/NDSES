import Link from "next/link";
import type { PageSection } from "@/types/cms";
import { FAQSection } from "./FAQSection";

export function SectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, index) => {
        if (section.type === "textImage") {
          return (
            <section className={`section ${index % 2 ? "alt" : ""}`} key={section.id}>
              <div className="container split">
                <div>
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.heading}</h2>
                  <p className="lead">{section.body}</p>
                </div>
                <div className="image-placeholder" aria-label={section.imageAlt || "NDS Environmental Solutions operations image"} />
              </div>
            </section>
          );
        }
        if (section.type === "serviceGrid") {
          return (
            <section className="section services-band" key={section.id}>
              <div className="container">
                <div className="section-intro">
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.heading}</h2>
                </div>
                <div className="grid three service-grid">
                  {section.services.map((service, serviceIndex) => (
                    <Link className="card service-card" data-service-index={serviceIndex} href={service.href} key={service.href}>
                      <span className="service-number">0{serviceIndex + 1}</span>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <strong>{service.ctaLabel} <span aria-hidden>→</span></strong>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        if (section.type === "cta") {
          return (
            <section className="section alt" key={section.id}>
              <div className="container split">
                <div>
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </div>
                <Link className="btn primary" href={section.href}>{section.label}</Link>
              </div>
            </section>
          );
        }
        if (section.type === "faq") return <FAQSection faqs={section.faqs} key={section.id} title={section.heading} />;
        if (section.type === "items") {
          return (
            <section className="section" key={section.id}>
              <div className="container">
                <div className="section-intro">
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.heading}</h2>
                </div>
                <div className="grid three items-grid">
                  {section.items.map((item) => (
                    <div className="card" key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}
    </>
  );
}

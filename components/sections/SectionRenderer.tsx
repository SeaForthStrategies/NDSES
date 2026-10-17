import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Home, Truck } from "lucide-react";
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
                {section.image ? (
                  <figure className="feature-image">
                    <Image src={section.image} alt={section.imageAlt ?? ""} width={1200} height={900} sizes="(max-width: 900px) 100vw, 560px" />
                  </figure>
                ) : null}
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
                  {section.services.map((service) => (
                    <Link className="card service-card" href={service.href} key={service.href}>
                      <ServiceIcon href={service.href} />
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <strong>{service.ctaLabel} <ArrowRight size={16} aria-hidden /></strong>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        if (section.type === "cta") {
          return (
            <section className="section statement-band" key={section.id}>
              <div className="container">
                <div className="statement">
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.heading}</h2>
                  <p className="lead">{section.body}</p>
                  <Link className="btn btn-gold" href={section.href}>{section.label} <ArrowRight size={18} aria-hidden /></Link>
                </div>
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

function ServiceIcon({ href }: { href: string }) {
  const Icon = href.startsWith("/commercial") ? Building2 : href.startsWith("/dumpster") ? Truck : Home;
  return (
    <span className="service-icon" aria-hidden>
      <Icon size={24} />
    </span>
  );
}

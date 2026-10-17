import { Metadata } from "next";
import Image from "next/image";
import { Building2, Recycle, Trash2 } from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { getCommercialContainers, getCommercialPage, getServiceAreas } from "@/lib/cms";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Commercial Waste Services",
  description: "Commercial waste collection, recycling, and permanent container service from NDSES."
};

export default async function CommercialPage() {
  const [page, containers, areas] = await Promise.all([getCommercialPage(), getCommercialContainers(), getServiceAreas()]);
  return (
    <>
      <PageHero {...page.hero} />
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Business Waste Management</p>
            <h2>Ongoing service for small businesses and industrial operations</h2>
            <p className="lead">Permanent dumpster services are ideal for businesses requiring ongoing waste and recycling solutions. For temporary needs, such as office cleanouts or construction projects, NDS also provides roll-off dumpsters.</p>
            <p>We service select areas of Walworth, Rock, Jefferson, Waukesha, and Kenosha counties. Please call to confirm your area.</p>
          </div>
          <div className="visual-stack">
            <figure className="asset-frame">
              <Image src="/nds-assets/commercial-01-115e487ff9.png" alt="NDS commercial service area map showing Walworth, Rock, Jefferson, Waukesha, and Kenosha counties" width={1300} height={842} sizes="(max-width: 900px) 100vw, 560px" />
            </figure>
            <div className="card tint">
              <h3>Flexible collection schedules</h3>
              <ul className="check-list compact">
                {["Monthly", "Every other week", "2 times per week", "3 times per week", "4 times per week", "5 times per week"].map((item) => <li key={item}><Building2 size={16} aria-hidden /> {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt" id="containers">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Container Options</p>
            <h2>Find the right size dumpster for your business</h2>
          </div>
          <div className="grid five service-grid">
            {containers.map((container) => (
              <article className="card container-card" key={container.slug}>
                <div className="dumpster-visual">
                  {container.image ? (
                    <Image src={container.image} alt={`${container.name} dumpster with dimensions`} width={280} height={220} sizes="(max-width: 640px) 90vw, 240px" />
                  ) : (
                    <Trash2 size={44} aria-hidden />
                  )}
                </div>
                <div className="dumpster-card-body">
                <h3>{container.name}</h3>
                <p>{container.description}</p>
                {container.dimensions || container.capacity ? (
                  <dl className="spec-list">
                    {container.dimensions ? (
                      <div>
                        <dt>Dimensions</dt>
                        <dd>{container.dimensions}</dd>
                      </div>
                    ) : null}
                    {container.capacity ? (
                      <div>
                        <dt>Capacity</dt>
                        <dd>{container.capacity}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
                <p className="ideal-label">Ideal for</p>
                <ul>{container.idealFor.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="recycling">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Recycling Services</p>
            <h2>Commercial recycling can be paired with trash service</h2>
            <p>Recycling services can be paired with your trash services for streamlined pickup.</p>
          </div>
          <div className="card">
            <ul className="check-list">
              {["Cardboard", "Paper", "Plastic", "Aluminum", "Mixed recycling"].map((item) => <li key={item}><Recycle size={18} aria-hidden /> {item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <ServiceAreaMap areas={areas.filter((area) => area.serviceTypes.includes("commercial") || area.serviceTypes.includes("rollOff"))} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Industries We Serve</p>
          <h2>Built for everyday business operations</h2>
          <div className="pill-grid">
            {["Restaurants", "Offices", "Retail Stores", "Apartment Complexes", "Schools", "Manufacturing", "Churches"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>
      <SectionRenderer sections={page.sections} />
      <section className="section" id="quote">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Request a Quote</p>
            <h2>Tell NDSES what your site needs</h2>
            <p>Form routing is configured through environment variables so NDSES can connect the final inbox or CRM without changing UI code.</p>
          </div>
          <InquiryForm formType="commercial" />
        </div>
      </section>
    </>
  );
}

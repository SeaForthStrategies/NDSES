import type { Metadata } from "next";
import Image from "next/image";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { getAboutContent, getAboutPage, getServiceAreas } from "@/lib/cms";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about NDS Environmental Solutions, a locally owned waste management provider serving Southern Wisconsin."
};

export default async function AboutPage() {
  const [page, content, areas] = await Promise.all([getAboutPage(), getAboutContent(), getServiceAreas()]);
  return (
    <>
      <PageHero {...page.hero} image={{ src: "/nds-assets/home-hero-truck.jpg", alt: "NDS collection truck parked by Delavan Lake", width: 1672, height: 941 }} />
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Our History</p>
            <h2>Our Story</h2>
            {content.history.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <figure className="asset-frame stack-top">
              <Image src="/nds-assets/branding-03-bffd0f61cb.png" alt="NDS Environmental Solutions branded collection truck" width={1795} height={877} sizes="(max-width: 900px) 100vw, 560px" />
            </figure>
          </div>
          <div className="card tint sticky-card">
            <p className="eyebrow">Our Mission</p>
            <h2>Reliable, affordable, eco-friendly service</h2>
            <p>{content.mission}</p>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <ServiceAreaMap areas={areas} />
        </div>
      </section>
    </>
  );
}

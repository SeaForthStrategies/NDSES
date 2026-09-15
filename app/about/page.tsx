import type { Metadata } from "next";
import Image from "next/image";
import { Users } from "lucide-react";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { getAboutContent, getAboutPage, getServiceAreas } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about NDS Environmental Solutions, a locally owned waste management provider serving Southern Wisconsin."
};

export default async function AboutPage() {
  const [page, content, areas] = await Promise.all([getAboutPage(), getAboutContent(), getServiceAreas()]);
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">{page.hero.eyebrow}</p>
          <h1>{page.hero.heading}</h1>
          <p className="lead">{page.hero.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Our History</p>
            <h2>Built for local service</h2>
            <p>{content.historyPlaceholder}</p>
            <figure className="asset-frame stack-top">
              <Image src="/nds-assets/branding-03-bffd0f61cb.png" alt="NDS Environmental Solutions branded collection truck" width={1795} height={877} />
            </figure>
            <p className="asset-caption">Client-supplied brand/vehicle image from the NDS Website Redesign workbook.</p>
          </div>
          <div className="card tint">
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
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Meet The Team</p>
            <h2>The people behind NDS</h2>
            <p>{content.teamPlaceholder}</p>
          </div>
          <div className="card team-placeholder">
            <Users size={42} aria-hidden />
            <h3>Team profiles coming soon</h3>
            <p>Names, roles, and photos can be inserted later without rebuilding this section.</p>
          </div>
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { DumpsterCard } from "@/components/dumpster/DumpsterCard";
import { DumpsterGuide } from "@/components/dumpster/DumpsterGuide";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { RentalProcess } from "@/components/sections/RentalProcess";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getDumpsterPage, getDumpsterSizes } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Dumpster Rentals",
  description: "Temporary dumpster rentals for projects, cleanouts, construction, and events."
};

export default async function DumpsterRentalsPage() {
  const [page, sizes] = await Promise.all([getDumpsterPage(), getDumpsterSizes()]);

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
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Find The Right Size Dumpster For You</p>
            <h2>Roll-off dumpster sizes</h2>
            <p className="lead">Each rental includes 2 tons of trash, delivery and pickup, disposal, and a 15 day rental period.</p>
          </div>
          <div className="grid four service-grid">
            {sizes.map((size) => <DumpsterCard dumpster={size} key={size.slug} />)}
          </div>
          <div className="button-row section-actions">
            <Link className="btn primary" href="/dumpster-calculator">Use Dumpster Calculator</Link>
            <Link className="btn secondary" href="tel:262-233-6131">Call 262-233-6131</Link>
          </div>
        </div>
      </section>
      <section className="section alt" id="materials">
        <div className="container grid two">
          <div className="card tint">
            <p className="eyebrow">Accepted Materials</p>
            <h2>What can go in a rental dumpster</h2>
            <ul className="check-list">
              {sizes[0]?.acceptedMaterials.map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden /> {item}</li>)}
            </ul>
          </div>
          <div className="card">
            <p className="eyebrow">Not Accepted</p>
            <h2>Keep these materials out</h2>
            <ul className="x-list">
              {sizes[0]?.prohibitedMaterials.map((item) => <li key={item}><XCircle size={18} aria-hidden /> {item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Rental Process</p>
            <h2>Four steps from quote to pickup</h2>
          </div>
          <RentalProcess />
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <DumpsterGuide sizes={sizes} />
        </div>
      </section>
      <SectionRenderer sections={page.sections} />
      <section className="section alt">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Rental Inquiry</p>
            <h2>Request a dumpster</h2>
            <p>The selected dumpster size is carried into this form when visitors choose an option above.</p>
          </div>
          <InquiryForm formType="dumpster" />
        </div>
      </section>
    </>
  );
}

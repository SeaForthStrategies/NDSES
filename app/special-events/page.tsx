import { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getSpecialEventsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Special Event Waste Services",
  description: "Temporary waste collection and cleanup support for events."
};

export default async function SpecialEventsPage() {
  const page = await getSpecialEventsPage();
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">{page.hero.eyebrow}</p>
          <h1>{page.hero.heading}</h1>
          <p className="lead">{page.hero.description}</p>
        </div>
      </section>
      <SectionRenderer sections={page.sections} />
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Event Quote</p>
            <h2>Plan containers and cleanup support</h2>
            <p>Use this form for festivals, community events, corporate events, weddings, and temporary collection needs.</p>
          </div>
          <InquiryForm formType="event" />
        </div>
      </section>
    </>
  );
}

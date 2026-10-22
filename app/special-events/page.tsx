import { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getSpecialEventsPage } from "@/lib/cms";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Special Event Waste Services",
  description: "Temporary waste collection and cleanup support for events."
};

export default async function SpecialEventsPage() {
  const page = await getSpecialEventsPage();
  return (
    <>
      <PageHero {...page.hero} />
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

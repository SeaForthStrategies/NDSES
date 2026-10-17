import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Request Service",
  description: "Start a residential trash and recycling service inquiry with NDS Environmental Solutions."
};

export default function RequestServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Request Service"
        heading="Start a residential service inquiry"
        description="Tell NDSES where service is needed and the team can confirm availability, schedules, and next steps."
      />
      <section className="section">
        <div className="container narrow">
          <InquiryForm formType="residential" />
        </div>
      </section>
    </>
  );
}

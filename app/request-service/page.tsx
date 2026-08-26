import { InquiryForm } from "@/components/forms/InquiryForm";

export default function RequestServicePage() {
  return (
    <section className="section page-hero">
      <div className="container grid two">
        <div>
          <p className="eyebrow">Request Service</p>
          <h1>Start a residential service inquiry</h1>
          <p className="lead">Tell NDSES where service is needed and the team can confirm availability, schedules, and next steps.</p>
        </div>
        <InquiryForm formType="residential" />
      </div>
    </section>
  );
}

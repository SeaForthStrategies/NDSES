import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Content Sources",
  description: "Terms, content-source notes, and client-supplied image attribution for the NDS Environmental Solutions website."
};

export default function TermsPage() {
  return (
    <section className="section page-hero">
      <div className="container grid two">
        <div>
          <p className="eyebrow">Legal</p>
          <h1>Terms and content sources</h1>
          <p className="lead">Formal legal terms should be reviewed by NDS Environmental Solutions before launch.</p>
        </div>
        <div className="card">
          <h2 className="compact-heading">Content and image attribution</h2>
          <p>Website copy, service details, schedules, FAQs, contact information, and visual assets are sourced from the client-provided <strong>NDS Website Redesign</strong> workbook unless otherwise noted.</p>
          <p>No third-party stock photography is intentionally used in this frontend. The primary logos, truck images, dumpster images, maps, and calendar graphics were extracted from the client-supplied workbook for NDS Environmental Solutions website production.</p>
          <p>Any remaining placeholder integration areas, including maps, payments, forms, social media, and CMS content, should be reviewed and approved before launch.</p>
        </div>
      </div>
    </section>
  );
}

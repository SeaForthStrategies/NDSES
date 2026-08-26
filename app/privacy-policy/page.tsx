import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy placeholder and launch review note for NDS Environmental Solutions."
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section page-hero">
      <div className="container grid two">
        <div>
          <p className="eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p className="lead">Formal privacy policy content should be reviewed by NDS Environmental Solutions before launch.</p>
        </div>
        <div className="card">
          <h2 className="compact-heading">Launch review required</h2>
          <p>This page is reserved for the final privacy policy covering contact forms, analytics, payment links, CMS integrations, and any future third-party services.</p>
          <p>Do not launch public form routing, analytics, PayEngine, or social integrations until the final policy has been reviewed and approved.</p>
        </div>
      </div>
    </section>
  );
}

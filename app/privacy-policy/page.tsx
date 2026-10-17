import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy placeholder and launch review note for NDS Environmental Solutions."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" heading="Privacy Policy" description="Formal privacy policy content should be reviewed by NDS Environmental Solutions before launch." />
      <section className="section">
        <div className="container legal-body">
        <div className="card">
          <h2 className="compact-heading">Launch review required</h2>
          <p>This page is reserved for the final privacy policy covering contact forms, analytics, payment links, CMS integrations, and any future third-party services.</p>
          <p>Do not launch public form routing, analytics, PayEngine, or social integrations until the final policy has been reviewed and approved.</p>
        </div>
        </div>
      </section>
    </>
  );
}

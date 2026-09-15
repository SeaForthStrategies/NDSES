import { Metadata } from "next";
import Image from "next/image";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { getContactPage, getGlobalSettings, getServiceNotices } from "@/lib/cms";
import { activeNoticesForLocation } from "@/lib/notices";
import { ServiceNoticeList } from "@/components/notices/ServiceNoticeList";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact NDS Environmental Solutions for service, quotes, questions, and urgent service updates."
};

export default async function ContactPage() {
  const [page, settings, notices] = await Promise.all([getContactPage(), getGlobalSettings(), getServiceNotices()]);
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
          <InquiryForm formType="general" />
          <aside className="card tint">
            <figure className="asset-frame contain">
              <Image src="/nds-assets/contact-us-01-ea0d03de5d.png" alt="NDS Environmental Solutions logo and phone number" width={797} height={527} />
            </figure>
            <h2>Contact Card</h2>
            <p><strong>{settings.companyName}</strong></p>
            <p>{settings.address}</p>
            {settings.mailingAddress ? <p>Mailing: {settings.mailingAddress}</p> : null}
            <p>Phone: <a href={`tel:${settings.phone}`}>{settings.phone}</a></p>
            <p>Email: <a href={`mailto:${settings.email}`}>{settings.email}</a></p>
            <p>Hours: {settings.businessHours}</p>
            <h3>Closure or delay information</h3>
            <ServiceNoticeList notices={activeNoticesForLocation(notices, "contact")} emptyMessage="No current closure or delay notices." />
          </aside>
        </div>
      </section>
    </>
  );
}

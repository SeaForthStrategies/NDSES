import { Metadata } from "next";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { getPaymentContent, getPaymentPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Make a Payment",
  description: "Secure payment entry point for NDS Environmental Solutions accounts."
};

export default async function MakePaymentPage() {
  const [page, content] = await Promise.all([getPaymentPage(), getPaymentContent()]);
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
            <h2>Online payment access</h2>
            <p>{content.note}</p>
            <ul>
              <li>Account number</li>
              <li>Payment amount</li>
              <li>Email for receipt</li>
              {content.methods.map((method) => <li key={method}>{method}</li>)}
            </ul>
          </div>
          <PaymentForm />
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { getPaymentContent, getPaymentPage } from "@/lib/cms";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Make a Payment",
  description: "Secure payment entry point for NDS Environmental Solutions accounts."
};

export default async function MakePaymentPage() {
  const [page, content] = await Promise.all([getPaymentPage(), getPaymentContent()]);
  return (
    <>
      <PageHero {...page.hero} />
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

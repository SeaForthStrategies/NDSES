import type { FAQ } from "@/types/cms";

export function FAQSection({ faqs, title = "FAQs" }: { faqs: FAQ[]; title?: string }) {
  return (
    <section className="section alt">
      <div className="container">
        <p className="eyebrow">Questions</p>
        <h2>{title}</h2>
        <div className="grid two stack-top">
          {faqs.map((faq) => (
            <details className="card" key={faq.question}>
              <summary><strong>{faq.question}</strong></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

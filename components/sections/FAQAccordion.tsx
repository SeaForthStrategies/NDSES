import type { FAQ } from "@/types/cms";

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="faq-stack">
      {faqs.map((faq) => (
        <details className="card faq-item" key={`${faq.category}-${faq.question}`}>
          <summary><strong>{faq.question}</strong></summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

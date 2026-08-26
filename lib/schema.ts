export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "NDS Environmental Solutions",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1635 Mound Rd",
      addressLocality: "Delavan",
      addressRegion: "WI",
      postalCode: "53115",
      addressCountry: "US"
    },
    telephone: "262-233-6131",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ndses.com",
    areaServed: "Southern Wisconsin"
  };
}

export function faqPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function serviceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "NDS Environmental Solutions",
      telephone: "262-233-6131"
    },
    areaServed: "Southern Wisconsin"
  };
}

export function breadcrumbSchema(items: Array<{ name: string; href: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ndses.com";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.href, baseUrl).toString()
    }))
  };
}

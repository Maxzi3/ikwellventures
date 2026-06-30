
export default function LocalBusinessSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: "IYKE WELL Ventures NIG LTD",
    alternateName: "Iyke Well Ventures",
    description:
      "Genuine and aftermarket Volvo spare parts dealer serving Ladipo Market, Mushin, and Lagos, Nigeria. Engine, brake, suspension, electrical, transmission and body parts for all Volvo models.",
    url: "https://ikwellventures.vercel.app",
    telephone: "+2348033056790",
    priceRange: "$$",
    image: "https://ikwellventures.vercel.app/og-image.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Olakunle Street, Papa Ajao",
      addressLocality: "Mushin",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    areaServed: [
      { "@type": "Place", name: "Ladipo Market" },
      { "@type": "Place", name: "Mushin" },
      { "@type": "Place", name: "Lagos" },
      { "@type": "Place", name: "Nigeria" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "22:00",
    },
    brand: {
      "@type": "Brand",
      name: "Volvo",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

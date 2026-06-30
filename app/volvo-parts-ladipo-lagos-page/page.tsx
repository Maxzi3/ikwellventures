import type { Metadata } from "next";
import HomePage from "@/app/page";

const PAGE_URL =
  (process.env.NEXT_PUBLIC_APP_URL ?? "https://ikwellventures.vercel.app") +
  "/volvo-parts-ladipo-lagos";

export const metadata: Metadata = {
  title:
    "Volvo Spare Parts Near Ladipo Market, Mushin Lagos | IYKE WELL Ventures",
  description:
    "Genuine & aftermarket Volvo spare parts serving Ladipo Market and Mushin, Lagos. Engine, brake, suspension, electrical, transmission & body parts for XC90, XC60, XC40, S90, S60, V90, V60, XC70, V70 & C30. Call or WhatsApp 0803 305 6790.",
  keywords: [
    "volvo parts ladipo",
    "volvo spare parts ladipo market",
    "volvo parts mushin lagos",
    "volvo parts papa ajao",
    "volvo car parts nigeria",
    "genuine volvo parts lagos",
    "volvo engine parts ladipo",
    "volvo brake parts mushin",
    "iyke well ventures",
  ],
  openGraph: {
    title:
      "Volvo Spare Parts Near Ladipo Market, Mushin Lagos | IYKE WELL Ventures",
    description:
      "Genuine & aftermarket Volvo spare parts for all models, serving Ladipo Market and Mushin, Lagos.",
    url: PAGE_URL,
    siteName: "IYKE WELL Ventures NIG LTD",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IYKE WELL Ventures NIG LTD Open Graph Image",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  alternates: {
    canonical: PAGE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Volvo Spare Parts Near Ladipo Market, Mushin Lagos",
    description:
      "Genuine & aftermarket Volvo spare parts serving Ladipo Market and Mushin, Lagos.",
    images: ["/og-image.png"],
  },
};

export default function VolvoPartsLadipoLagosPage() {
  return <HomePage />;
}

import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Toaster } from "@/components/ui/sonner";
import WhatsAppPopup from "@/components/WhatsAppPopup";


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});


export const metadata: Metadata = {
  title: "IYKE WELL Ventures NIG LTD | Genuine Volvo Spare Parts",
  description:
    "Your trusted source for genuine Volvo spare parts. Quality engine parts, brake systems, suspension components and more.",
  keywords: [
    "iyke Well Ventures Nig. Ltd",
    "Volvo parts",
    "volvo parts lagos",
    "genuine volvo spare parts",
    "mushin volvo parts",
    "ladipo volvo parts",
    "volvo engine parts nigeria",
    "volvo brake parts lagos",
    "volvo car parts mushin",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://ikwellventures.vercel.app/",
  ),
  openGraph: {
    title: "IYKE WELL Ventures NIG LTD | Genuine Volvo Spare Parts",
    description:
      "Your trusted source for genuine Volvo spare parts. Quality engine parts, brake systems, suspension components and more.",
    url:
      process.env.NEXT_PUBLIC_APP_URL ?? "https://ikwellventures.vercel.app/",
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
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "IYKE WELL Ventures NIG LTD",
    description:
      "Your trusted source for genuine Volvo spare parts. Quality engine parts, brake systems, suspension components and more.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#005792",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("bg-background", "font-sans", outfit.variable)}
    >
      <body className="font-sans antialiased">
        {children} <WhatsAppPopup /> <WhatsAppIcon />{" "}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

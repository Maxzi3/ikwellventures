import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Toaster } from "@/components/ui/sonner";


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});


export const metadata: Metadata = {
  title: "IKW Ventures | Genuine Volvo Spare Parts",
  description:
    "Your trusted source for genuine Volvo spare parts. Quality engine parts, brake systems, suspension components and more.",
  keywords: [
    "Volvo parts",
    "spare parts",
    "car parts",
    "genuine Volvo",
    "automotive",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://ikwellventures.vercel.app/",
  ),
  openGraph: {
    title: "IKW Ventures | Genuine Volvo Spare Parts",
    description:
      "Your trusted source for genuine Volvo spare parts. Quality engine parts, brake systems, suspension components and more.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://ikwellventures.vercel.app/",
    siteName: "IKW Ventures",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IKW Ventures Open Graph Image",
      },
    ],
    locale: "Ng_en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IKW Ventures",
    description: "Your trusted source for genuine Volvo spare parts. Quality engine parts, brake systems, suspension components and more.",
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
        {children} <WhatsAppIcon /> <Toaster position="top-right" />
      </body>
    </html>
  );
}

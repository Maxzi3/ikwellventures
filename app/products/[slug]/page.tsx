/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { connectToDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { extractIdSuffix } from "@/lib/slug";
import Link from "next/link";

const WHATSAPP_NUMBER = "2348033056790";
const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://ikwellventures.vercel.app";

type Category = { _id: string; name: string; slug: string };
type Product = {
  _id: string;
  name: string;
  partNumber?: string;
  description: string;
  image?: string;
  category: Category | null;
  inStock: boolean;
  featured: boolean;
};

// Direct DB lookup — no self-fetch over HTTP, so this works identically in
// dev (localhost) and prod regardless of what NEXT_PUBLIC_APP_URL is set to.
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const idSuffix = extractIdSuffix(slug);
    if (!idSuffix || idSuffix.length < 4) return null;

    await connectToDB();

    const candidates = await ProductModel.find({}, { _id: 1 }).lean();
    const match = candidates.find((p: any) =>
      p._id.toString().endsWith(idSuffix),
    );
    if (!match) return null;

    const product = await ProductModel.findById(match._id).populate(
      "category",
      "name slug",
    );
    if (!product) return null;

    return JSON.parse(JSON.stringify(product)); // strip Mongoose doc wrapper
  } catch (err) {
    console.error("getProduct:", err);
    return null;
  }
}

function getWhatsAppLink(productName: string, partNumber?: string) {
  const text = partNumber
    ? `Hi, I'm interested in buying *${productName}* (Part No: ${partNumber}). Please provide more details.`
    : `Hi, I'm interested in buying *${productName}*. Please provide more details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found | IYKE WELL Ventures" };
  }

  const title = `${product.name}${product.partNumber ? ` (${product.partNumber})` : ""} | Volvo Parts Lagos`;
  const description = `${product.description} Genuine & aftermarket Volvo part available from IYKE WELL Ventures, serving Ladipo Market & Mushin, Lagos. ${product.inStock ? "In stock" : "Currently out of stock"} — order via WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${slug}`,
      siteName: "IYKE WELL Ventures NIG LTD",
      images: product.image
        ? [{ url: product.image, width: 800, height: 800, alt: product.name }]
        : undefined,
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? [product.image] : undefined,
    sku: product.partNumber,
    brand: { "@type": "Brand", name: "Volvo" },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "NGN",
      url: `${SITE_URL}/products/${slug}`,
      seller: {
        "@type": "Organization",
        name: "IYKE WELL Ventures NIG LTD",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${slug}`,
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="flex-1">
        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              {" / "}
              <Link href="/products" className="hover:underline">
                Products
              </Link>
              {" / "}
              <span className="text-foreground">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={`${product.name}${product.partNumber ? ` - Part No ${product.partNumber}` : ""}`}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary">
                    <Wrench className="h-24 w-24 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {product.category?.name ?? "Volvo Part"}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                  {product.name}
                </h1>
                {product.partNumber && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Part No: {product.partNumber}
                  </p>
                )}
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <p
                  className={`mt-4 text-sm font-medium ${product.inStock ? "text-green-600" : "text-destructive"}`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
                <Button
                  size="lg"
                  asChild
                  disabled={!product.inStock}
                  className="mt-6"
                >
                  <a
                    href={getWhatsAppLink(product.name, product.partNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order via WhatsApp
                  </a>
                </Button>
                <p className="mt-8 text-sm text-muted-foreground">
                  Available from IYKE WELL Ventures, serving Ladipo Market and
                  Mushin, Lagos. Call or WhatsApp 0803 305 6790.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

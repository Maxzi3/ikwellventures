/* eslint-disable @typescript-eslint/no-explicit-any */

// Auto-generates sitemap.xml, including EVERY product as its own entry —
// this is what gets all those product pages discovered and indexed by
// Google without you manually maintaining a list.

import type { MetadataRoute } from "next";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { buildProductSlug } from "@/lib/slug";

const BASE =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://ikwellventures.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), priority: 1 },
    {
      url: `${BASE}/volvo-parts-ladipo-lagos`,
      lastModified: new Date(),
      priority: 0.9,
    },
    { url: `${BASE}/products`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), priority: 0.5 },
  ];

  try {
    await connectToDB();
    const products = await Product.find(
      {},
      { _id: 1, name: 1, updatedAt: 1 },
    ).lean();

    const productPages: MetadataRoute.Sitemap = products.map((p: any) => ({
      url: `${BASE}/products/${buildProductSlug(p.name, p._id.toString())}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      priority: 0.7,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("sitemap generation:", error);
    // If DB fails at build time, still ship the static pages rather than
    // failing the whole build.
    return staticPages;
  }
}

// File location: lib/slug.ts

/**
 * Turns a product name into a URL-friendly slug.
 * "Volvo XC90 Brake Pads (Front)" -> "volvo-xc90-brake-pads-front"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Builds the canonical, SEO-friendly URL path for a product.
 * Appends the last 6 chars of the Mongo _id to keep it unique even if two
 * products have very similar names.
 */
export function buildProductSlug(name: string, id: string): string {
  const shortId = id.slice(-6);
  return `${slugify(name)}-${shortId}`;
}

/**
 * Given a slug like "volvo-xc90-brake-pads-4f2a1c", extracts the trailing
 * id fragment so the API route can look the product up.
 */
export function extractIdSuffix(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

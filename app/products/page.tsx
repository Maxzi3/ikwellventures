"use client";

import { useState,useEffect } from "react";
import { Wrench, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";

const WHATSAPP_NUMBER = "2348012345678"; // Replace with your number

function getWhatsAppLink(productName: string, partNumber?: string) {
  const text = partNumber
    ? `Hi, I'm interested in buying *${productName}* (Part No: ${partNumber}). Please provide more details.`
    : `Hi, I'm interested in buying *${productName}*. Please provide more details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

type Category = {
  _id: string;
  name: string;
  slug: string;
};

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

const ALL_CATEGORY = { id: "all", name: "All Products" };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    ALL_CATEGORY,
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: "12",
          page: page.toString(),
        });
        if (selectedCategory !== "all")
          params.set("category", selectedCategory);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);

        // Update categories
        const seen = new Map();
        for (const p of data.products || []) {
          if (p.category && !seen.has(p.category._id)) {
            seen.set(p.category._id, {
              id: p.category._id,
              name: p.category.name,
            });
          }
        }
        setCategories([ALL_CATEGORY, ...Array.from(seen.values())]);
      } catch (err) {
        setError("Could not load products. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, searchQuery, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Our Products
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Browse our selection of genuine Volvo spare parts
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="gap-2 sm:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row">
              {/* Categories */}
              <aside
                className={`lg:w-64 lg:shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
              >
                <div className="rounded-lg border bg-card p-4">
                  <h2 className="font-semibold">Categories</h2>
                  <nav className="mt-4 space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setPage(1);
                        }}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm ${selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Products Grid + Pagination */}
              <div className="flex-1">
                <p className="mb-6 text-sm text-muted-foreground">
                  {loading
                    ? "Loading..."
                    : `Showing ${products.length} of ${total} products`}
                </p>

                {error ? (
                  <div className="text-center py-16">
                    <p className="text-destructive">{error}</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setPage(1)}
                    >
                      Retry
                    </Button>
                  </div>
                ) : loading ? (
             
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card
                        key={i}
                        className="overflow-hidden border-border bg-card animate-pulse"
                      >
                        <div className="aspect-square bg-muted" />
                        <CardContent className="p-4 space-y-2">
                          <div className="h-3 w-1/3 rounded bg-muted" />
                          <div className="h-4 w-2/3 rounded bg-muted" />
                          <div className="h-3 w-full rounded bg-muted" />
                        </CardContent>
                        <CardFooter className="border-t border-border p-4">
                          <div className="h-8 w-full rounded bg-muted" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16">No products found</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {products.map((product) => (
                        <Card
                          key={product._id}
                          className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
                        >
                          <div className="aspect-square overflow-hidden bg-muted">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={400}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-secondary">
                                <Wrench className="h-16 w-16 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-primary">
                              {product.category?.name ?? "Uncategorized"}
                            </p>
                            <h3 className="mt-1 font-semibold text-foreground">
                              {product.name}
                            </h3>
                            {product.partNumber && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Part No: {product.partNumber}
                              </p>
                            )}
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                          </CardContent>
                          <CardFooter className="flex items-center justify-between border-t border-border p-4">
                            <span
                              className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-destructive"}`}
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            <Button
                              size="sm"
                              asChild
                              disabled={!product.inStock}
                            >
                              <a
                                href={getWhatsAppLink(
                                  product.name,
                                  product.partNumber,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Buy Now
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-10 flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-4 text-sm">
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
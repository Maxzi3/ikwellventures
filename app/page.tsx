import Link from "next/link";
import { ArrowRight, Shield, Truck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Image from "next/image";


const featuredProducts = [
  {
    id: 1,
    name: "Volvo Engine Oil Filter",
    price: 24.99,
    category: "Engine Parts",
    image: "/products/oil-filter.jpg",
  },
  {
    id: 2,
    name: "Front Brake Pads Set",
    price: 89.99,
    category: "Brake System",
    image: "/products/brake-pads.jpg",
  },
  {
    id: 3,
    name: "Suspension Control Arm",
    price: 145.0,
    category: "Suspension",
    image: "/products/control-arm.jpg",
  },
  {
    id: 4,
    name: "Air Filter Element",
    price: 35.5,
    category: "Engine Parts",
    image: "/products/air-filter.jpg",
  },
];

const features = [
  {
    icon: Shield,
    title: "Genuine Parts",
    description:
      "All our parts are sourced from trusted suppliers ensuring quality and compatibility.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Quick and reliable shipping to get your parts to you when you need them.",
  },
  {
    icon: Wrench,
    title: "Expert Support",
    description:
      "Our team of automotive experts is here to help you find the right parts.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary py-24 sm:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                <span className="block">Quality Volvo</span>
                <span className="block text-primary-foreground/80">
                  Spare Parts
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80">
                Your trusted source for genuine Volvo spare parts. We provide
                reliable automotive components to keep your vehicle running at
                its best.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="gap-2">
                    View Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <Image
            src="/hero.png"
            alt="Volvo Car"
            width={600}
            height={400}
            className="absolute right-0 top-1/2 h-auto w-full max-w-md -translate-y-1/2 opacity-5 sm:opacity-100"
          />
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Featured Products
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Quality parts for your Volvo vehicle
                </p>
              </div>
              <Link href="/products" className="hidden sm:block">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <Wrench className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      {product.category}
                    </p>
                    <h3 className="mt-1 font-semibold text-foreground">
                      {product.name}
                    </h3>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t border-border p-4">
                    <span className="text-lg font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/products">
                <Button variant="ghost" className="gap-2">
                  View All Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-6 py-16 sm:px-12 sm:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                  Need help finding the right part?
                </h2>
                <p className="mt-4 text-lg text-primary-foreground/80">
                  Contact our team of experts and we will help you find exactly
                  what you need for your Volvo.
                </p>
                <div className="mt-8">
                  <Link href="/contact">
                    <Button size="lg" variant="secondary" className="gap-2">
                      Get in Touch
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

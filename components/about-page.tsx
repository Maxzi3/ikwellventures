import AboutCeoSection from "@/components/about-ceo-section";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CheckCircle, Users, Target, Award } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "Every part we supply meets strict quality standards to ensure reliability and performance.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "We prioritize your satisfaction with expert support and personalized service.",
  },
  {
    icon: Target,
    title: "Precision Fit",
    description:
      "Our parts are designed for perfect compatibility with your Volvo vehicle.",
  },
  {
    icon: Award,
    title: "Industry Expertise",
    description:
      "Years of experience in the automotive parts industry serving Volvo owners.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                About IYKE WELL Ventures
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80">
                Your trusted partner for genuine Volvo spare parts and
                automotive excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Our Commitment to Excellence
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    At IYKE WELL Ventures, we specialize in providing genuine Volvo
                    spare parts to vehicle owners who demand the best for their
                    cars. Our commitment to quality and reliability has made us
                    a trusted name in the automotive parts industry.
                  </p>
                  <p className="leading-relaxed">
                    We understand that your Volvo is more than just a vehicle -
                    it is a symbol of Scandinavian engineering excellence. That
                    is why we source only authentic parts that meet the highest
                    standards of quality and performance.
                  </p>
                  <p className="leading-relaxed">
                    Our team of automotive experts is dedicated to helping you
                    find the right parts for your specific model, ensuring
                    perfect compatibility and optimal performance for your
                    vehicle.
                  </p>
                </div>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Image
                      src="/ik-well-shop.jpeg"
                      alt="About Us"
                      width={400}
                      height={400}
                      loading="eager"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Why Choose Us
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our values guide everything we do
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-xl bg-card p-6 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AboutCeoSection />

        {/* Stats */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">500+</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Products Available
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">1000+</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Happy Customers
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">10+</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Years Experience
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">24/7</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Customer Support
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

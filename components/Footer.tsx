import Link from "next/link";
import Logo from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Your trusted source for genuine Volvo spare parts. We provide
              quality automotive components with reliability you can count on.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/products?category=engine"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Engine Parts
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=brake"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Brake System
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=suspension"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Suspension
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} IKW Ventures. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

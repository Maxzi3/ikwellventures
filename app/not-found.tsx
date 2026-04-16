
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";


export default function NotFound() {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>

      <h2 className="text-3xl font-semibold text-foreground mb-6">
        Oops! Why are you here?
      </h2>

      <p className="text-foreground max-w-md mb-10">
        We are sorry for the inconvenience. It looks like you’re trying to
        access a page that either has been deleted or never existed.
      </p>

      <Button asChild size="lg" className="gap-2">
        <Link href='/'>
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}

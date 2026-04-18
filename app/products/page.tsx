import ProductsPage from "@/components/product-page";
import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Volvo Spare Parts Catalogue | IKW Ventures",
  description: "Browse our full range of genuine Volvo parts...",
};

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      }
    >
      <ProductsPage />
    </Suspense>
  );
};;

export default page;

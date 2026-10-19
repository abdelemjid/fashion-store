import FrontendLayout from "@/components/layouts/FrontendLayout";
import FilterOptions from "@/components/shop/FilterOptions";
import ShopOptions from "@/components/shop/ShopOptions";
import ShopProducts from "@/components/shop/ShopProducts";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { Category, ProductType } from "@/generated/prisma/enums";
import { Suspense } from "react";

interface SearchParams {
  categories?: Category[];
  productTypes?: ProductType[];
  sort?: "low-high" | "high-low" | "newest" | "oldest";
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function Shop({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <FrontendLayout>
      <div className="flex flex-col sm:flex-row gap-5 my-10">
        {/* Filters */}
        <FilterOptions />

        {/* Page Content */}
        <div className="flex-1">
          {/* Content Sort */}
          <ShopOptions />

          {/* Products */}
          <Suspense fallback={<ProductCardSkeleton number={8} shop />}>
            <ShopProducts searchParams={params} key="shop-products" />
          </Suspense>
        </div>
      </div>
    </FrontendLayout>
  );
}

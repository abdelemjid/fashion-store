import SectionHeader from "../ui/SectionHeader";
import ProductCard from "../products/ProductCard";
import { getBestSellerProducts } from "@/server-actions/products";
import { Suspense } from "react";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

export const dynamic = "force-dynamic";

export default function BestSellers() {
  return (
    <section>
      {/* Section Header */}
      <SectionHeader
        title="Best Sellers"
        subtitle="Discover out most-loved pieces, carefully selected by thousands of happy customers. Timeless styles designed to elevate your wardrobe."
      />

      {/* Best Seller Products */}
      <Suspense fallback={<ProductCardSkeleton number={5} />}>
        <BestSellersContent />
      </Suspense>
    </section>
  );
}

async function BestSellersContent() {
  const products = await getBestSellerProducts();

  return (
    <div className="my-10">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            product={{
              id: product.id,
              name: product.name,
              image: product.images[0].imageUrl,
              price: product.price,
            }}
            key={product.id}
          />
        ))}
      </div>
    </div>
  );
}

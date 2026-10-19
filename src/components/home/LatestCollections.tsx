import SectionHeader from "../ui/SectionHeader";
import ProductCard from "../products/ProductCard";
import { Suspense } from "react";
import { getLatestProducts } from "@/server-actions/products";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

export const dynamic = "force-dynamic";

export default function LatestCollections() {
  return (
    <section>
      {/* Section Header */}
      <SectionHeader
        title="Latest Collections"
        subtitle="New arrivals added weekly."
      />

      {/* Collections */}
      <Suspense fallback={<ProductCardSkeleton number={5} />}>
        <LatestCollectionsContent />
      </Suspense>
    </section>
  );
}

async function LatestCollectionsContent() {
  const products = await getLatestProducts();

  return (
    <div className="my-10">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            product={{
              id: product.id,
              image: product.images[0].imageUrl,
              name: product.name,
              price: product.price,
            }}
            key={product.id}
          />
        ))}
      </div>
    </div>
  );
}

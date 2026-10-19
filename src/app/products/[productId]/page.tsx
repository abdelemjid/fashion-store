import FrontendLayout from "@/components/layouts/FrontendLayout";
import ProductPageComponent from "@/components/products/ProductPageComponent";
import ProductPageSkeleton from "@/components/skeletons/ProductPageSkeleton";
import { getProduct } from "@/server-actions/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function page({ params }: Props) {
  const { productId } = await params;

  return (
    <FrontendLayout>
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductPageContent productId={productId} />
      </Suspense>
    </FrontendLayout>
  );
}

async function ProductPageContent({ productId }: { productId: string }) {
  const product = await getProduct(productId);

  if (!product) notFound();

  return <ProductPageComponent product={product} />;
}

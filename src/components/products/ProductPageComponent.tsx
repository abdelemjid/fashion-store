"use client";

import Image from "next/image";
import { useState } from "react";
import BreadCrumb from "../ui/BreadCrumb";
import Button from "../ui/Button";
import { IoBagAddOutline } from "react-icons/io5";
import { getProduct } from "@/server-actions/products";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";

interface Props {
  product: Awaited<ReturnType<typeof getProduct>>;
}

export default function ProductPageComponent({ product }: Props) {
  const { addToCart } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(
    product?.images[0].imageUrl ?? "",
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[0].size ?? "",
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] ?? null,
  );
  const isOutOfStock = (product?.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    if ((product?.stock ?? 0) <= 0) {
      return toast.error("This product is out of stock!");
    }
    if (!product || !selectedColor || !selectedImage || !selectedSize) {
      return toast.error("Please select the size and the color of product!");
    }

    const cartKey = `${product.id}-${selectedSize}-${selectedColor.id}`;

    addToCart({
      cartKey,
      productId: product.id,
      name: product.name,
      image: product.images[0].imageUrl ?? "",
      price: product.price,
      size: selectedSize,
      color: selectedColor.name,
      quantity: 1,
    });

    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="py-12">
      {/* Bread Crumb */}
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product?.name ?? "" },
        ]}
      />

      {/* Product Preview */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery Images */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          {/* Vertical Images */}
          <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-visible">
            {product?.images.map((image) => (
              <button
                key={image.id}
                className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${selectedImage === image.imageUrl ? "border-primary" : "border-border"}`}
                onClick={() => setSelectedImage(image.imageUrl)}
              >
                <Image
                  src={image.imageUrl}
                  alt="product"
                  width={90}
                  height={110}
                  className="h-24 w-24 object-cover md:h-28 md:w-24"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative h-87.5 w-full overflow-hidden rounded-2xl bg-surface sm:h-125">
            <Image
              src={selectedImage || ""}
              alt="Product Image"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          {/* Name */}
          <h2 className="text-3xl font-bold sm:text-4xl">{product?.name}</h2>
          {/* Price */}
          <p className="mt-6 text-2xl font-bold sm:text-3xl">
            ${product?.price.toFixed(2)}
          </p>
          {/* Stock Status */}
          <p
            className={`mt-2 font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}
          >
            {isOutOfStock
              ? "Out Of Stock"
              : `In Stock (${product?.stock}) available`}
          </p>
          {/* Description */}
          <p className="mt-6 leading-8 text-muted-foreground">
            {product?.description}
          </p>
          {/* Sizes */}
          <div className="mt-8">
            <p className="mb-3 font-semibold">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {product?.sizes.map((size) => (
                <button
                  key={size.id}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border font-medium transition ${selectedSize === size.size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
          {/* Colors */}
          <div className="mt-8">
            <p className="mb-3 font-semibold">Select Colors</p>

            <div className="flex gap-3">
              {product?.colors.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${selectedColor?.id === color.id ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"}`}
                >
                  <span
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: color.value }}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Selected Values */}
          <div className="mt-6 rounded-xl bg-surface p-4">
            {/* Selected Size */}
            <p className="text-sm space-x-2">
              <span className="font-semibold">Selected size:</span>
              <span className="font-bold">{selectedSize}</span>
            </p>
            {/* Selected Color */}
            <p className="text-sm space-x-2">
              <span className="font-semibold">Selected Color:</span>
              <span className="font-bold">{selectedColor?.name}</span>
            </p>
          </div>
          {/* Add To Cart Button */}
          <div className="mt-8">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              leftIcon={<IoBagAddOutline size={20} />}
              className="w-full sm:w-fit"
              paddingX="px-20"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

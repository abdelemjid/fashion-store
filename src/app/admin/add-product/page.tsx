"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Category, ProductType, Size } from "@/generated/prisma/enums";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";

const availableSizes: Size[] = [Size.XS, Size.S, Size.L, Size.XL, Size.XXL];
const categories: Category[] = [
  Category.MEN,
  Category.WOMEN,
  Category.CHILDREN,
];
const productTypes: ProductType[] = [
  ProductType.HOODIES,
  ProductType.JACKETS,
  ProductType.JEANS,
  ProductType.SHIRTS,
  ProductType.SHORTS,
  ProductType.TROUSERS,
  ProductType.T_SHIRTS,
  ProductType.SHOES,
];
const availableColors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#6B7280" },
  { name: "Navy", value: "#1E3A8A" },
  { name: "Blue", value: "#2563EB" },
  { name: "Brown", value: "#8B5E3C" },
  { name: "Green", value: "#15803D" },
  { name: "Red", value: "#DC2626" },
];

interface FormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  productType: ProductType;
}

export default function AddProduct() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "MEN",
      productType: "SHIRTS",
    },
  });
  const [images, setImages] = useState<File[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [bestSeller, setBestSeller] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImages((prev) => [...prev, ...files].slice(0, 4));
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color: string) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const onCreationSubmit: SubmitHandler<FormValues> = async (data) => {
    if (images.length === 0)
      return toast.error("Please upload at least one image.");
    if (sizes.length === 0)
      return toast.error("Please select at least one size.");
    if (colors.length === 0)
      return toast.error("Please select at least one color.");

    const selectedColors = availableColors.filter((color) =>
      colors.includes(color.name),
    );
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("category", data.category);
    formData.append("productType", data.productType);
    formData.append("bestSeller", String(bestSeller));

    sizes.forEach((size) => {
      formData.append("sizes", size);
    });
    selectedColors.forEach((color) => {
      formData.append("colors", JSON.stringify(color));
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) return toast.error(result?.message);

      reset();
      toast.success(result?.message);
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while posting your product!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onCreationSubmit)}
      className="mx-auto max-w-5xl space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold">Add Product</h2>
        <p className="mt-2 text-muted-foreground">
          Create new product for your store.
        </p>
      </div>

      {/* Images */}
      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="mb-5 text-lg font-semibold">Product Images</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="" key={index}>
              {images[index] ? (
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border">
                  <Image
                    fill
                    src={URL.createObjectURL(images[index])}
                    alt="selected-image"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow transition hover:bg-destructive hover:text-white"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-border transition hover:border-primary hover:bg-surface"
                >
                  <LuPlus size={30} className="text-muted-foreground" />

                  <span className="mt-3 text-sm text-muted-foreground">
                    Upload Image
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>

        <input
          type="file"
          hidden
          multiple
          ref={inputRef}
          accept="image/*"
          onChange={handleImageChange}
        />
      </section>

      {/* Product Information */}
      <section className="space-y-5 rounded-2xl border border-border bg-background p-6">
        {/* Section Title */}
        <h2 className="text-lg font-semibold">Product Information</h2>
        {/* Name */}
        <Input
          {...register("name")}
          label="Product Name"
          placeholder="Classic Black Hoodie"
        />
        {/* Description */}
        <Input
          {...register("description")}
          variant="textarea"
          label="Product Description"
          placeholder="Write a detailed description..."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {/* Price */}
          <Input {...register("price")} label="Price" placeholder="$79.99" />
          {/* Stock */}
          <Input
            {...register("stock")}
            label="Stock Quantity"
            placeholder="50"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Category Select */}
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select
              {...register("category")}
              className="h-12 w-full rounded-lg border border-border bg-background px-4 outline-none transition focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Product Type Select */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Type
            </label>
            <select
              {...register("productType")}
              className="h-12 w-full rounded-lg border border-border bg-background px-4 outline-none transition focus:border-primary"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Product Sizes */}
      <section className="rounded-2xl border border-border bg-background p-6">
        {/* Section Title */}
        <h2 className="text-lg font-semibold mb-5">Available Sizes</h2>
        {/* Sizes */}
        <div className="flex flex-wrap gap-3">
          {availableSizes.map((size) => {
            const selected = sizes.includes(size);

            return (
              <button
                type="button"
                key={`${size}_button`}
                onClick={() => toggleSize(size)}
                className={`h-11 w-16 rounded-lg border font-medium cursor-pointer transition ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary hover:bg-primary/5"}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Colors */}
      <section className="rounded-2xl border border-border bg-background p-6">
        {/* Section Title */}
        <h2 className="text-lg font-semibold mb-5">Available Colors</h2>
        {/* Colors */}
        <div className="flex flex-wrap gap-4">
          {availableColors.map((color) => {
            const selected = colors.includes(color.name);

            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}
              >
                <span
                  className="h-6 w-6 rounded-full border border-border"
                  style={{
                    backgroundColor: color.value,
                  }}
                />

                <span className="font-medium">{color.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Options */}
      <section className="rounded-2xl border border-border bg-background p-6">
        {/* Section Title */}
        <h2 className="text-lg font-semibold mb-5">Product Options</h2>

        {/*  */}
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={bestSeller}
              className="h-5 w-5 accent-primary"
              onChange={(e) => setBestSeller(e.target.checked)}
            />

            <span>Mark as Best Seller</span>
          </label>
        </div>
      </section>

      {/* Save Product Button */}
      <div className="flex justify-end">
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}

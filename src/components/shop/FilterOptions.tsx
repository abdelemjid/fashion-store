"use client";

import { Category, ProductType } from "@/generated/prisma/enums";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";

interface ProductTypeFilter {
  label: string;
  value: ProductType;
}

interface CategoryTypeFilter {
  label: string;
  value: Category;
}

const productTypes: ProductTypeFilter[] = [
  { label: "T-Shirts", value: ProductType.T_SHIRTS },
  { label: "Shirts", value: ProductType.SHIRTS },
  { label: "Hoodies", value: ProductType.HOODIES },
  { label: "Jackets", value: ProductType.JACKETS },
  { label: "Jeans", value: ProductType.JEANS },
  { label: "Trousers", value: ProductType.TROUSERS },
  { label: "Shorts", value: ProductType.SHORTS },
  { label: "Shoes", value: ProductType.SHOES },
];

const categories: CategoryTypeFilter[] = [
  { label: "Men", value: Category.MEN },
  { label: "Women", value: Category.WOMEN },
  { label: "Children", value: Category.CHILDREN },
];

export default function FilterOptions() {
  const [filterVisible, setFilterVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategories =
    searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const selectedProductTypes =
    searchParams.get("productType")?.split(",").filter(Boolean) ?? [];

  const toggleFilter = (key: "category" | "productType", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const values = params.get(key)?.split(",").filter(Boolean) ?? [];
    const updatedValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];

    if (updatedValues.length === 0) params.delete(key);
    else params.set(key, updatedValues.join(","));

    router.replace(`/shop?${params.toString()}`);
  };

  return (
    <aside className="w-full sm:w-60">
      <button
        onClick={() => setFilterVisible((prev) => !prev)}
        className="flex items-center gap-2 mb-4 text-xl font-semibold sm:cursor-default"
      >
        FILTERS
        <RiArrowRightDoubleFill
          className={`transition-transform duration-300 sm:hidden ${filterVisible ? "rotate-90" : ""}`}
        />
      </button>

      {/* Filters */}
      <div
        className={`space-y-6 sm:block ${filterVisible ? "block" : "hidden"}`}
      >
        {/* Categories */}
        <div className="rounded-xl border border-border p-5">
          <h3 className="mb-4 text-sm font-semibold tracking-wide">
            CATEGORIES
          </h3>

          <div className="space-y-3 text-sm text-muted-foreground">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center gap-3">
                <input
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => toggleFilter("category", category.value)}
                  type="checkbox"
                />
                <span>{category.value}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Products Types */}
        <div className="rounded-xl border border-border p-5">
          <h3 className="mb-4 text-sm font-semibold tracking-wide">TYPE</h3>

          <div className="space-y-3 text-sm text-muted-foreground">
            {productTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-3">
                <input
                  checked={selectedProductTypes.includes(type.value)}
                  onChange={() => toggleFilter("productType", type.value)}
                  type="checkbox"
                />
                <span>{type.value}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

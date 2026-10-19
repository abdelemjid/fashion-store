"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ShopOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);
    router.replace(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
      <h2 className="text-primary font-semibold">Shop</h2>

      <select
        value={sort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="border border-border text-sm p-3"
      >
        <option value="low-high">Sort By: Price (Low to High)</option>
        <option value="high-low">Sort By: Price (High to Low)</option>
        <option value="newest">Sort By: Newest</option>
        <option value="oldest">Sort By: Oldest</option>
      </select>
    </div>
  );
}

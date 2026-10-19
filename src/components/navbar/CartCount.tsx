import { useCartStore } from "@/store/cart.store";

export default function CartCount() {
  const { totalItems } = useCartStore();

  if (totalItems() === 0) return null;

  return (
    <span
      className={`absolute -right-1 -top-1 ${totalItems() >= 100 ? "w-fit h-4 px-1 rounded-md" : "w-5 h-5 rounded-full"} flex items-center justify-center bg-destructive text-[11px] font-semibold text-white`}
    >
      {totalItems()}
    </span>
  );
}

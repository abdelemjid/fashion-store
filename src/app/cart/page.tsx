"use client";

import FrontendLayout from "@/components/layouts/FrontendLayout";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { IoBagHandleOutline } from "react-icons/io5";

export default function Cart() {
  const router = useRouter();

  const {
    totalItems,
    subtotal,
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const shipping = 0;
  const tax = subtotal() * 0.08;
  const total = subtotal() + shipping + tax;

  if (totalItems() === 0) {
    return (
      <FrontendLayout>
        <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          {/* Icon */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
            <IoBagHandleOutline size={48} className="text-muted-foreground" />
          </div>
          {/* Title */}
          <h1 className="mt-8 text-3xl font-bold">Your cart is empty</h1>
          {/* Subtitle */}
          <p className="mt-3 max-w-md text-muted-foreground">
            You haven&apos;t added any products to your cart yet. Browse our
            latest collections and start shopping.
          </p>
          {/* Link */}
          <Link href={"/shop"} className="mt-8">
            <Button>Continue Shopping</Button>
          </Link>
        </section>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <section className="mx-auto max-w-6xl py-12">
        {/* Header */}
        <div className="">
          <BreadCrumb
            items={[{ label: "Home", href: "/" }, { label: "Cart" }]}
          />

          <p className="mt-2 text-muted-foreground">
            {totalItems()} {totalItems() > 1 ? "Items" : "Item"} in your cart
          </p>
        </div>

        {/*  */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_2fr]">
          {/* Left */}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.cartKey}
                className="flex flex-col gap-5 rounded-2xl border border-border p-5 transition hover:shadow-sm sm:flex-row"
              >
                {/* Product Image */}
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={150}
                    height={180}
                    className="w-full object-cover sm:w-36"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="">
                    {/* Item name */}
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    {/* Item size and color */}
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      {/* Size */}
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold">
                        Size:{" "}
                        <span className="font-normal text-sm">{item.size}</span>
                      </span>
                      {/* Color */}
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold">
                        Color:{" "}
                        <span className="font-normal text-sm">
                          {item.color}
                        </span>
                      </span>
                    </div>
                    {/*  */}
                    <p className="mt-5 text-2xl font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Quantity */}
                    <div className="flew items-center rounded-lg border border-border">
                      {/* Minus Button */}
                      <button
                        onClick={() => decreaseQuantity(item.cartKey)}
                        className="p-3 transition hover:bg-surface"
                      >
                        <FiMinus />
                      </button>

                      {/* Quantity Display */}
                      <span className="min-w-12 text-center font-semibold">
                        {item.quantity}
                      </span>

                      {/* Plus Button */}
                      <button
                        onClick={() => increaseQuantity(item.cartKey)}
                        className="p-3 transition hover:bg-surface"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartKey)}
                      className="flex items-center gap-2 text-destructive transition hover:opacity-80"
                    >
                      <FiTrash2 />
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="rounded-2xl border border-border p-6 h-fit">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            {/* Summary */}
            <div className="mt-8 space-y-4">
              {/* Total Items */}
              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems() - 1}</span>
              </div>
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal().toFixed(2)}</span>
              </div>
              {/* Shipping */}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>free</span>
              </div>
              {/* Tax */}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between border-t border-border py-4 text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              fullWidth
              className="mt-8"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </Button>

            {/* Shop Link */}
            <Link
              href="/shop"
              className="mt-5 block text-center text-sm font-medium text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </FrontendLayout>
  );
}

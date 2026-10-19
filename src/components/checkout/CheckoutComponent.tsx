"use client";

import FrontendLayout from "@/components/layouts/FrontendLayout";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Input from "@/components/ui/Input";
import { useState } from "react";
import { FaMoneyBillWave, FaStripe } from "react-icons/fa";
import z from "zod";
import Button from "../ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProfile } from "@/server-actions/user/user";
import { useCartStore } from "@/store/cart.store";
import {
  createStripeCheckoutSession,
  placeOrder,
} from "@/server-actions/order/order.user";
import { PaymentMethod } from "@/generated/prisma/enums";
import toast from "react-hot-toast";

interface Props {
  user: Awaited<ReturnType<typeof getProfile>>;
}

const schema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long."),
  lastName: z.string().min(2, "Last name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  state: z.string().min(2, "State is required."),
  city: z.string().min(2, "City is required."),
  address: z.string().min(5, "Street address is required."),
  country: z.string().min(2, "Country is required!"),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutComponent({ user }: Props) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const address = user?.addresses[0];
  const { cartItems, clearCart, subtotal } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: address?.firstName ?? "",
      lastName: address?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      state: address?.state ?? "",
      city: address?.city ?? "",
      address: address?.street ?? "",
      country: address?.country ?? "",
    },
  });

  const shipping = 0;
  const tax = subtotal() * 0.08;
  const total = subtotal() + shipping + tax;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Cash on Delivery
    if (paymentMethod === "cod") {
      const result = await placeOrder({
        paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          street: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
        },
        cartItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      });

      if (!result.success) return toast.error(result.message as string);

      clearCart();
      toast.success("Order placed successfully.");
      router.push(`/account/orders/${result.orderNumber}`);
      return;
    }

    // Stripe Payment
    const result = await createStripeCheckoutSession({
      shippingAddress: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        street: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      },
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
    });

    if (!result.success) return toast.error(result.message as string);
    if (!result.url) return toast.error("Unable to start Stripe checkout!");

    router.push(result.url);
  };

  return (
    <FrontendLayout>
      <section className="mx-auto max-w-7xl py-12">
        <div className="mb-10">
          {/* Path */}
          <BreadCrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />

          {/* Subheading */}
          <p className="mt-2 text-muted-foreground">
            Complete your order securely.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-10 lg:grid-cols-[2fr_2fr]"
        >
          {/* Left */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-2xl">Shipping Address</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* First name */}
                <Input
                  label="First Name"
                  placeholder="John"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
                {/* Last name */}
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
                {/* Email address */}
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@gmail.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
                {/* Phone number */}
                <Input
                  label="Phone Number"
                  placeholder="+212 600000000"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
                {/* Country */}
                <Input
                  label="Country"
                  placeholder="USA"
                  {...register("country")}
                  error={errors.country?.message}
                />
                {/* State */}
                <Input
                  label="State"
                  placeholder="California"
                  {...register("state")}
                  error={errors.state?.message}
                />
                {/* City */}
                <Input
                  label="City"
                  placeholder="Burbank"
                  {...register("city")}
                  error={errors.city?.message}
                />
              </div>
              {/* Street */}
              <div>
                <Input
                  label="Street"
                  placeholder="No 11 ..."
                  variant="textarea"
                  {...register("address")}
                  error={errors.address?.message}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>

              <div className="mt-6 space-y-4">
                {/* Cash on Delivery Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex w-full items-center rounded-xl border p-5 text-left transition ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${paymentMethod === "cod" ? "border-primary" : "border-border"}`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>

                    <FaMoneyBillWave size={24} className="text-green-600" />

                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when your order arrives.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Stripe Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex w-full items-center rounded-xl border p-5 text-left transition ${paymentMethod === "stripe" ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${paymentMethod === "stripe" ? "border-primary" : "border-border"}`}
                    >
                      {paymentMethod === "stripe" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>

                    <FaStripe size={30} className="text-indigo-600" />

                    <div>
                      <p className="font-semibold">Pay with Stripe</p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard and more.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-2xl border border-border p-6 h-fit">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            {/* Selected Products */}
            <div className="mt-6 space-y-5">
              {cartItems.map((item) => (
                <div key={item.cartKey} className="flex gap-4">
                  {/* Product Image */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={70}
                    height={85}
                    className="rounded-lg"
                  />

                  <div className="flex flex-1 justify-between">
                    {/* Name & Quantity */}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Product Price */}
                    <div className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 space-y-4">
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
              disabled={isSubmitting}
              onClick={() => router.push("/checkout")}
            >
              {isSubmitting
                ? "Processing..."
                : paymentMethod === "cod"
                  ? "Place Order"
                  : "Continue to Stripe"}
            </Button>

            {/* Shop Link */}
            <Link
              href="/shop"
              className="mt-5 block text-center text-sm font-medium text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </form>
      </section>
    </FrontendLayout>
  );
}

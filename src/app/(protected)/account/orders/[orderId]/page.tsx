import FrontendLayout from "@/components/layouts/FrontendLayout";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import { getOrder } from "@/server-actions/order/order.user";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaMoneyBillWave } from "react-icons/fa";
import { FiArrowLeft, FiMapPin, FiPackage } from "react-icons/fi";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function page({ params }: Props) {
  const { orderId } = await params;

  const order = await getOrder(orderId);

  if (!order) notFound();

  return (
    <FrontendLayout>
      <section className="mx-auto max-w-7xl py-12">
        {/* Path */}
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Orders", href: "/account/orders" },
            { label: order.orderNumber },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-border p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/account/orders">
              <Button
                variant="outline"
                className="mb-5"
                leftIcon={<FiArrowLeft />}
              >
                Back to Orders
              </Button>
            </Link>

            <h2 className="text-3xl font-bold">{order.orderNumber}</h2>

            <p className="mt-2 text-muted-foreground">
              Placed on {order.createdAt.toLocaleDateString()}
            </p>
          </div>

          {/* Status */}
          <OrderStatusBadge status={order.status} />
          {/* <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
            Pending
          </span> */}
        </div>

        {/* Payment Info */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Order Side */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3">
                <FiPackage className="text-primary" />

                <h2 className="text-xl font-semibold">Ordered Items</h2>
              </div>

              <div className="mt-8 space-y-6">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-xl border border-border p-5 sm:flex-row"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={130}
                      height={160}
                      className="rounded-xl object-cover"
                    />

                    <div className="flex flex-1 justify-between">
                      <div>
                        {/* Item name */}
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                          {/* Item size */}
                          <span className="rounded-full bg-surface px-3 py-1">
                            Size: {item.size}
                          </span>
                          {/* Item color */}
                          <span className="rounded-full bg-surface px-3 py-1">
                            Color: {item.color}
                          </span>
                          {/* Item quantity */}
                          <span className="rounded-full bg-surface px-3 py-1">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Items price */}
                      <p className="text-xl font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Summary Side */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            {/* Summary */}
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="mt-8 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{order.subtotal.toFixed(2)}</span>
                </div>
                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>free</span>
                </div>
                {/* Tax */}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{order.tax.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between border-t border-border py-4 text-xl font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-border p-6">
              {/* Heading */}
              <div className="flex items-center gap-3">
                <FiMapPin className="text-primary" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              {/* Address */}
              <div className="mt-5 space-y-2 text-muted-foreground">
                {/* Fullname */}
                <p className="font-medium text-foreground">
                  {order.address.firstName} {order.address.lastName}
                </p>
                {/* Phone */}
                <p>{order.address.phone}</p>
                {/* Street */}
                <p>{order.address.street}</p>
                {/* State and City */}
                <p>
                  {order.address.city}, {order.address.state}
                </p>
                {/* Country */}
                <p>{order.address.country}</p>
              </div>
            </div>

            {/*  */}
            <div className="rounded-2xl border border-border p-6">
              {/* Heading */}
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-primary" />
                <h2 className="text-xl font-semibold">Payment</h2>
              </div>

              {/*  */}
              <div className="mt-5 space-y-4">
                {/* Payment Method */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="font-semibold">{order.paymentMethod}</p>
                </div>
                {/* Payment Status */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Payment Status
                  </p>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FrontendLayout>
  );
}

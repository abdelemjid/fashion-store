import OrderStatusCard from "@/components/order/OrderStatusCard";
import { getOrder } from "@/server-actions/order/order.admin";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderByID({ params }: Props) {
  const { orderId } = await params;
  const order = await getOrder(Number(orderId));

  if (!order) notFound();

  return (
    <section>
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold">Orders #{order.orderNumber}</h2>
        <p className="mt-2 text-muted-foreground">
          Placed on{" "}
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
          }).format(order.createdAt)}
        </p>
      </div>

      {/* Grid Display */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Left Side */}
        <div className="space-y-8">
          {/* Customer */}
          <div className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold">Customer Information</h2>

            {/* Information */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Fullname */}
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="mt-1 font-medium">{order.customer.name}</p>
              </div>
              {/* Email */}
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="mt-1 font-medium">{order.customer.email}</p>
              </div>
              {/* Phone */}
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="mt-1 font-medium">{order.customer.phone}</p>
              </div>
              {/* Address */}
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="mt-1 font-medium">
                  {order.address.street}
                  <br />
                  {order.address.city}, {order.address.state}
                  <br />
                  {order.address.country}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-border bg-background p-6">
            <div className="border-b border-border">
              <h2 className="text-lg font-semibold">Order Items</h2>
            </div>

            <div className="divided-y divided-border">
              {order.items.map((product) => (
                <div key={product.id} className="flex items-center gap-5 p-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={90}
                    className="rounded-lg object-cover"
                  />

                  {/* Name, Size and Quantity */}
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Size: {product.size}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Quantity: {product.quantity}
                    </p>
                  </div>

                  {/* Total Price */}
                  <div className="font-semibold">
                    ${(product.price * product.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-8">
          {/* Status */}
          <OrderStatusCard orderId={order.id} status={order.status} />

          {/* Summary */}
          <div className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              {/* Shipping */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${order.shipping}</span>
              </div>
              {/* Tax */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax}</span>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold">Payment</h2>

            {/* Method */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-muted-foreground">Method</span>
              <span>{order.paymentMethod}</span>
            </div>
            {/* Status */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span>{order.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import FrontendLayout from "@/components/layouts/FrontendLayout";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import { getOrders } from "@/server-actions/order/order.user";
import Image from "next/image";
import Link from "next/link";
import { FiEye } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function page() {
  const orders = await getOrders();

  return (
    <FrontendLayout>
      <section className="mx-auto max-w-6xl py-12">
        {/* Path */}
        <BreadCrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Orders" },
          ]}
        />

        {/* Title */}
        <p className="text-muted-foreground">
          View and track you recent purchases.
        </p>

        {/* Orders */}
        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-6 rounded-2xl border border-border p-5 transition hover:shadow-sm md:flex-row md:items-center"
            >
              {/* Product Image */}
              <Image
                src={order.image}
                alt={order.orderNumber}
                width={110}
                height={130}
                className="rounded-xl object-cover"
              />

              {/* Order Details */}
              <div className="flex-1">
                {/* Order id and status */}
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">
                    Order {order.orderNumber}
                  </h2>

                  {/* Order Status Badge */}
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Order Details */}
                <div className="mt-5 grid grid-cols-2 gap-5 text-sm md:grid-cols-3">
                  {/* Total Items */}
                  <div>
                    <p className="text-muted-foreground">Total Items</p>
                    <p className="mt-1 font-semibold">{order.totalItems}</p>
                  </div>
                  {/* Total Price */}
                  <div>
                    <p className="text-muted-foreground">Total Price</p>
                    <p className="mt-1 font-semibold">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  {/* Order Date */}
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="mt-1 font-semibold">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Order */}
              <Link href={`/account/orders/${order.orderNumber}`}>
                <Button className="group rounded-lg p-4 transition bg-surface cursor-pointer">
                  <FiEye className="text-black/20 group-hover:text-white transition" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </FrontendLayout>
  );
}

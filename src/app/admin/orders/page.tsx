import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import { getAllOrders } from "@/server-actions/order/order.admin";
import Link from "next/link";
import { FiEye } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function page() {
  const orders = await getAllOrders();

  return (
    <section>
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold">Orders</h2>
        <p className="mt-2 text-muted-foreground">
          View and manage customer orders.
        </p>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Table Head */}
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50"
                >
                  {/* ID and Date */}
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-muted-foreground text-xs">
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  {/* Customer */}
                  <td className="px-6 py-3">{order.customer}</td>
                  {/* Items */}
                  <td className="px-6 py-3">{order.totalItems}</td>
                  {/* Total */}
                  <td className="px-6 py-3">${order.total.toFixed(2)}</td>
                  {/* Payment */}
                  <td className="px-6 py-3">
                    <span
                      className={`
                        rounded-full px-3 py-1 text-xs font-medium 
                        ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                            : order.paymentStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  {/* Date */}
                  <td className="px-6 py-3">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  {/* Action */}
                  <td className="px-6 py-3">
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className="rounded-lg p-4 cursor-pointer transition hover:bg-surface">
                        <FiEye />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

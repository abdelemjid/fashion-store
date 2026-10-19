"use client";

import { OrderStatus } from "@/generated/prisma/enums";
import Button from "../ui/Button";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/server-actions/order/order.admin";
import toast from "react-hot-toast";

interface Props {
  orderId: number;
  status: OrderStatus;
}

const orderStatuses: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CANCELED,
  OrderStatus.DELIVERED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
];

export default function OrderStatusCard({ orderId, status }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(status);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async () => {
    startTransition(async () => {
      const result = await updateOrderStatus({
        orderId,
        status: selectedStatus,
      });

      if (!result?.success) {
        toast.error(result?.message ?? "Error updating the order status!");
        return;
      }

      toast.success("Order's status updated.");
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h2 className="text-lg font-semibold">Order Status</h2>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">Status</label>

        {/* Order Status Selector */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          className="h-12 w-full rounded-lg border border-border bg-background px-4 outline-none focus:border-primary"
        >
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Button of Update Order */}
        <Button
          onClick={handleUpdate}
          disabled={isPending}
          className="mt-6 w-full"
        >
          {isPending ? "Updating..." : "Update Order"}
        </Button>
      </div>
    </div>
  );
}

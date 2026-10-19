import { OrderStatus } from "@/generated/prisma/enums";

interface Props {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: Props) {
  const styles = {
    DELIVERED:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    PROCESSING:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    PENDING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
    CANCELED: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    SHIPPED:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  } as const satisfies Record<OrderStatus, string>;

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

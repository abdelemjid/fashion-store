"use server";

import { prisma } from "@/database/db";
import { requireAdmin } from "../auth/require-admin";
import { UpdateOrderStatusInput } from "./order.inputs";

/**
 * Function that fetches all orders for admin.
 *
 * @returns List of customer orders
 */
export async function getAllOrders() {
  try {
    await requireAdmin();

    const orders = await prisma.order.findMany({
      orderBy: { createAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.user.name ?? "Unknown Customer",
      totalItems: order._count.items,
      total: Number(order.total),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      createdAt: order.createAt,
    }));
  } catch (error) {
    console.error("Error occurred while fetching the admin orders:", error);
    return [];
  }
}

/**
 * Function that fetches an order using its ID.
 *
 * @param orderId ID of order
 * @returns A specific order using its ID
 */
export async function getOrder(orderId: number) {
  try {
    await requireAdmin();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        address: true,
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
      },
    });

    if (!order) return null;

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createAt,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      tax: Number(order.tax),
      total: Number(order.total),
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
      },
      address: {
        firstName: order.address.firstName,
        lastName: order.address.lastName,
        street: order.address.street,
        city: order.address.firstName,
        state: order.address.state,
        country: order.address.country,
        phone: order.address.phone,
      },
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        image: item.product.images[0].imageUrl ?? "",
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: Number(item.price),
      })),
    };
  } catch (error) {
    console.error(
      "Error occurred while fetching a single order using its ID:",
      error,
    );
    return null;
  }
}

/**
 * Function that updates the status of a specific order using its ID.
 *
 * @param orderId The ID of order
 * @param status The new status of order
 *
 * @returns Operation status { success: boolean, message: string }
 */
export async function updateOrderStatus({
  orderId,
  status,
}: UpdateOrderStatusInput) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found!",
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return { success: true, message: "Order's status updated successfully." };
  } catch (error) {
    console.error(
      "Error occurred while updating a specific order's status:",
      error,
    );
  }
}

"use server";

import { prisma } from "@/database/db";
import { requireAdmin } from "../auth/require-admin";

/**
 * Function that fetches total of users, products and orders
 *
 * @returns Dashboard stats { totalUsers, totalProducts, totalOrders }
 */
export async function getDashboardStats() {
  try {
    await requireAdmin();

    const [totalUsers, totalProducts, totalOrders] = await prisma.$transaction([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);

    return { totalUsers, totalProducts, totalOrders };
  } catch (error) {
    console.error("Error occurred while fetching the dashboard stats:", error);
    return { totalUsers: 0, totalProducts: 0, totalOrders: 0 };
  }
}

"use server";

import { prisma } from "@/database/db";
import { requireAdmin } from "../auth/require-admin";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { Category, ProductType } from "@/generated/prisma/enums";

/**
 * Function that fetches products from prisma
 * @path /api/products
 *
 * @returns List of products
 */
export async function getProducts() {
  try {
    await requireAdmin();

    const products = await prisma.product.findMany({
      include: {
        images: {
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Function that deletes a product using its ID
 */
export async function deleteProduct(productId: string) {
  try {
    await requireAdmin();

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found!",
      };
    }

    // delete the product images
    await Promise.all(
      product.images.map((image) =>
        cloudinary.uploader.destroy(image.publicId),
      ),
    );

    // delete the product
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      message: "Failed to delete product!",
    };
  }
}

/**
 * Function that fetch the latest products limited in 10
 *
 * @returns List of products, empty list if an error occurred
 */
export async function getLatestProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 10,
      include: {
        images: {
          take: 1,
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  } catch (error) {
    console.error("Failed to fetch latest products:", error);
    return [];
  }
}

/**
 * Function that fetches the best seller products
 *
 * @return List of products or empty list if en error occurred
 */
export async function getBestSellerProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { bestSeller: true },
      take: 10,
      include: {
        images: {
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  } catch (error) {
    console.error("Failed to fetch best seller products:", error);
    return [];
  }
}

interface GetProductParams {
  categories?: Category[];
  productTypes?: ProductType[];
  sort?: "low-high" | "high-low" | "newest" | "oldest";
}

/**
 * Function that fetches shop products.
 * categories - string list of categories
 * productType - string list of product types
 *
 * @returns List of products, empty list if an error occurred
 */
export async function getShopProducts({
  categories = [],
  productTypes = [],
  sort = "newest",
}: GetProductParams) {
  try {
    const products = await prisma.product.findMany({
      where: {
        ...(categories.length > 0 && {
          category: {
            in: categories,
          },
        }),
        ...(productTypes.length > 0 && {
          productType: {
            in: productTypes,
          },
        }),
      },
      include: {
        images: {
          take: 1,
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy:
        sort === "low-high"
          ? { price: "asc" }
          : sort === "high-low"
            ? { price: "desc" }
            : sort === "oldest"
              ? { createdAt: "asc" }
              : { createdAt: "desc" },
    });

    return products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  } catch (error) {
    console.error("Failed to fetch the shop products:", error);
    return [];
  }
}

/**
 * Function that fetches a product using its unique ID
 *
 * @param productId each product has a unique ID
 * @returns the specific product by its ID
 */
export async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
        sizes: {
          orderBy: { createdAt: "asc" },
        },
        colors: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      price: Number(product.price),
    };
  } catch (error) {
    console.error("Failed to fetch the product:", error);
    return null;
  }
}

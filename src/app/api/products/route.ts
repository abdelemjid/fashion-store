import { prisma } from "@/database/db";
import { Category, ProductType, Size } from "@/generated/prisma/enums";
import { requireAdmin } from "@/server-actions/auth/require-admin";
import { uploadImages } from "@/services/uploadImages";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as Category;
    const productType = formData.get("productType") as ProductType;
    const bestSeller = formData.get("bestSeller") === "true";
    const sizes = formData.getAll("sizes") as Size[];
    const images = formData.getAll("images") as File[];
    const colors = formData.getAll("colors").map(
      (color) =>
        JSON.parse(color as string) as {
          name: string;
          value: string;
        },
    );

    // upload images
    const imageUrls = await uploadImages(images);

    // save product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        productType,
        stock,
        bestSeller,
        images: {
          create: imageUrls.map((image) => ({
            imageUrl: image.imageUrl,
            publicId: image.publicId,
          })),
        },
        sizes: {
          create: sizes.map((size) => ({ size })),
        },
        colors: {
          create: colors.map((color) => ({
            name: color.name,
            value: color.value,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully.",
      productId: product.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong!",
      },
      { status: 500 },
    );
  }
}

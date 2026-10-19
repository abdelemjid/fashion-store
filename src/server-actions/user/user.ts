"use server";

import { prisma } from "@/database/db";
import { getCurrentUser } from "../auth/getCurrentClient";
import { EditProfileValues } from "@/components/user/EditProfileForm";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        addresses: {
          where: {
            isDefault: true,
          },
          take: 1,
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
}

export async function updateProfile(data: EditProfileValues) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return { success: false, message: "Unauthorized!" };

    await prisma.$transaction(async (tx) => {
      // update user name and phone
      await tx.user.update({
        where: { id: currentUser.id },
        data: {
          name: data.name,
          phone: data.phone,
        },
      });

      // get user default address
      const defaultAddress = await tx.address.findFirst({
        where: {
          id: currentUser.id,
          isDefault: true,
        },
      });

      if (defaultAddress) {
        await tx.address.update({
          where: { id: defaultAddress.id },
          data: {
            firstName: data.firstname,
            lastName: data.lastname,
            phone: data.phone,
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode,
          },
        });
      } else {
        await tx.address.create({
          data: {
            firstName: data.firstname,
            lastName: data.lastname,
            phone: data.phone,
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode,
            isDefault: true,
            userId: currentUser.id,
          },
        });
      }
    });

    // revalidate page caches
    revalidatePath("/account");
    revalidatePath("/account/edit");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update profile.", error);

    return {
      success: false,
      message: "Failed to update profile!",
    };
  }
}

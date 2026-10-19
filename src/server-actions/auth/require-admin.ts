import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentClient";
import { prisma } from "@/database/db";

export async function requireAdmin() {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/signin");

  //   fetch the user's role
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") redirect("/account");
}

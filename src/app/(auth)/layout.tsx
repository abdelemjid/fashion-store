import { getCurrentUser } from "@/server-actions/auth/getCurrentClient";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: Readonly<Props>) {
  const currentUser = await getCurrentUser();

  if (currentUser) redirect("/account");

  return <>{children}</>;
}

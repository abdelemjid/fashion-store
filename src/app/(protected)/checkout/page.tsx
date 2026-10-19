import CheckoutComponent from "@/components/checkout/CheckoutComponent";
import { getProfile } from "@/server-actions/user/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function page() {
  const user = await getProfile();

  if (!user) redirect("/signin");

  return <CheckoutComponent user={user} />;
}

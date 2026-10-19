import AdminLayout from "@/components/layouts/AdminLayout";
import { requireAdmin } from "@/server-actions/auth/require-admin";

interface Props {
  children: React.ReactNode;
}

export default async function layout({ children }: Props) {
  // check if the user role is admin, if not redirect to http://localhost:3000/account
  await requireAdmin();

  return <AdminLayout>{children}</AdminLayout>;
}

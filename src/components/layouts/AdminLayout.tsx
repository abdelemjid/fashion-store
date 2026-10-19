import AdminSidebar from "../admin/AdminSidebar";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto bg-surface">
        <div className="mx-auto max-w-7xl mt-15 lg:mt-0 p-3 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

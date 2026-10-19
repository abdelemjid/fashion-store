import { getDashboardStats } from "@/server-actions/dashboard/admin.dashboard";
import { FiPackage, FiShoppingBag, FiUser } from "react-icons/fi";

export default async function Admin() {
  const { totalUsers, totalProducts, totalOrders } = await getDashboardStats();
  const stats = [
    {
      title: "Total User",
      value: totalUsers,
      icon: FiUser,
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: FiPackage,
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: FiShoppingBag,
    },
  ];

  return (
    <section>
      <div>
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here&apos;s an overview of your store.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-border bg-background p-6 transition hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <h3 className="mt-3 text-4xl font-semibold">{stat.value}</h3>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

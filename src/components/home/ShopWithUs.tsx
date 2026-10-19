import { FiHeadphones, FiRefreshCcw, FiRefreshCw } from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";

const features = [
  {
    icon: FiRefreshCw,
    title: "Easy Exchange",
    description: "Exchange your items quickly and hassle-free",
  },
  {
    icon: FiRefreshCcw,
    title: "7-Day Returns",
    description: "Not satisfied? Return your order within 7 days.",
  },
  {
    icon: FiHeadphones,
    title: "Best Support",
    description: "Our support team is available whenever you need help.",
  },
];

export default function ShopWithUs() {
  return (
    <section className="py-12">
      {/* Section Header */}
      <SectionHeader
        title="Why Shop With Us"
        subtitle="We're committed premium products and exceptional customer service."
      />

      {/* Section */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 py-6">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon size={30} className="text-primary" />
              </div>
              {/* Title */}
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

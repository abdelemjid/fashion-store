import { FiPackage } from "react-icons/fi";

interface Props {
  title: string;
  subtitle: string;
}

export default function EmptyState({ title, subtitle }: Props) {
  return (
    <div className="min-h-80 flex flex-col items-center justify-center rounded-2xl border border-border bg-background px-6 py-16 text-center">
      <div className="h-20 w-20 flex items-center justify-center rounded-full bg-surface">
        <FiPackage size={40} className="text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-md text-muted-foreground">{subtitle}</p>
    </div>
  );
}

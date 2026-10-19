import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface Item {
  label: string;
  href?: string;
}

interface Props {
  items: Item[];
}

export default function BreadCrumb({ items }: Props) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div className="flex items-center gap-2" key={item.label}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-muted-foreground transition hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <FiChevronRight size={14} className="text-muted-foreground" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

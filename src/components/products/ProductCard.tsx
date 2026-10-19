import Image from "next/image";
import Link from "next/link";

interface Props {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-4/5 overflow-hidden bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="mt-4 text-lg font-bold text-foreground">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

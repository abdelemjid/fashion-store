import FrontendLayout from "@/components/layouts/FrontendLayout";
import Image from "next/image";

export default function page() {
  return (
    <FrontendLayout>
      <div className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left Content */}
          <div>
            {/* Title */}
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              About Us
            </span>
            {/* Subtitle */}
            <h2 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
              Timeless Fashion for Every Occasion
            </h2>
            {/* Paragraphs */}
            {[
              "At Fashion, we believe great style should be effortless. Our collections are thoughtfully designed with premium fabrics and modern \
              trends to help you look and feel you best every day.",
              "Whether you'are shopping for everyday essentials or statement pieces, we're committed to delivering quality, comfort, and exceptional \
              customer service.",
            ].map((p, i) => (
              <p
                key={`paragraph-${i}`}
                className="mt-4 leading-8 text-muted-foreground"
              >
                {p}
              </p>
            ))}
            {/*  */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              {/* Happy clients */}
              <div>
                <h3 className="text-3xl font-bold text-primary">20k+</h3>
                <p className="mt-1 text-muted-foreground">Happy Clients</p>
              </div>
              {/* Premium products */}
              <div>
                <h3 className="text-3xl font-bold text-primary">500+</h3>
                <p className="mt-1 text-muted-foreground">Premium Products</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/images/about.png"
              alt="About Fashion Image"
              width={700}
              height={800}
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}

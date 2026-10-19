export default function ProductPageSkeleton() {
  return (
    <section className="animate-pulse py-12">
      {/* Breadcrumb */}
      <div className="h-4 w-64 rounded bg-surface" />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Images */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          {/* Gallery */}
          <div className="flex gap-3 md:flex-col">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 w-20 rounded-xl bg-surface md:h-28 md:w-24"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="h-87.5 w-full rounded-2xl bg-surface sm:h-125" />
        </div>

        {/* Details */}
        <div>
          {/* Title */}
          <div className="h-10 w-3/4 rounded bg-surface" />
          {/* Rating */}
          <div className="mt-5 h-5 w-40 rounded bg-surface" />
          {/* Price */}
          <div className="mt-6 h-5 w-40 rounded bg-surface" />

          {/* Description */}
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-surface" />
            <div className="h-4 w-11/12 rounded bg-surface" />
            <div className="h-4 w-9/12 rounded bg-surface" />
          </div>

          {/* Sizes */}
          <div className="mt-8">
            <div className="mb-3 h-4 w-24 rounded bg-surface" />

            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-11 w-11 rounded-lg bg-surface" />
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mt-8">
            <div className="mb-3 h-4 w-28 rounded bg-surface" />

            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-11 w-11 rounded-full bg-surface"
                />
              ))}
            </div>
          </div>

          {/* Selected */}
          <div className="mt-6 rounded-xl bg-surface p-4">
            <div className="h-4 w-44 rounded bg-background" />
            <div className="mt-3 h-4 w-48 rounded bg-background" />
          </div>

          {/* Buttons */}
          <div className="mt-8 h-12 flex-1 rounded-xl w-full sm:w-[50%]"></div>
        </div>
      </div>
    </section>
  );
}

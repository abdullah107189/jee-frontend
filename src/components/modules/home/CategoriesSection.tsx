import Image from "next/image";
import Link from "next/link";
import { getNavCategories } from "@/services/category.service";

export default async function CategoriesSection() {
  const categories = await getNavCategories();

  /* top 5 root categories */
  const topCategories = categories.slice(0, 5);

  if (topCategories.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-3.5 sm:mb-5 lg:mb-6">
          <h2 className="section-title">
            Explore Categories
          </h2>
          <p className="section-description">
            Find the right products for your home
          </p>
        </div>

        {/* Categories Grid (Responsive: 3 cols mobile, 5 cols tablet & desktop) */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3.5 lg:gap-5">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.fullSlug}`}
              className="group block min-w-0"
            >
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card shadow-2xs transition-all duration-300 active:scale-[0.97] sm:hover:-translate-y-1 sm:hover:shadow-md">
                <div className="relative aspect-square w-full overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 639px) 33vw, (max-width: 1023px) 20vw, 250px"
                      className="object-cover transition-transform duration-500 group-active:scale-105 sm:group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                      {category.name}
                    </div>
                  )}

                  {/* Gradient shadow overlay for readable white text */}
                  <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex h-[30%] items-end justify-center px-1.5 pb-1.5 sm:px-3 sm:pb-3">
                    <h3 className="w-full truncate text-center text-[11px] xs:text-xs sm:text-sm lg:text-base font-extrabold text-white drop-shadow-sm transition-transform duration-300 sm:group-hover:-translate-y-0.5">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getNavCategories } from "@/services/category.service";

export default async function CategoriesSection() {
  const categories = await getNavCategories();

  /* top 5 root category */
  const topCategories = categories.slice(0, 5);

  if (topCategories.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg font-black tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            Explore Categories
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-sm">
            Find the right products for your home
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5 sm:gap-4 lg:gap-5">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.fullSlug}`}
              className="group block min-w-0"
            >
              <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 active:scale-[0.97] sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:shadow-lg">
                <div className="relative aspect-square w-full overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 639px) 33vw, (max-width: 1023px) 25vw, 300px"
                      className="object-cover transition-transform duration-500 group-active:scale-105 sm:group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                      {category.name}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-[28%] bg-linear-to-t from-black/75 via-black/35 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex h-[24%] items-end justify-center px-2 pb-2 sm:px-3 sm:pb-3">
                    <h3 className="w-full truncate text-center text-xs font-extrabold text-white drop-shadow-sm transition-transform duration-300 sm:text-sm lg:text-base sm:group-hover:-translate-y-0.5">
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
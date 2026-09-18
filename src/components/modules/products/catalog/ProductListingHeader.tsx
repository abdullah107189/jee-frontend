interface ProductListingHeaderProps {
  title?: string;
  description?: string;
}

export function ProductListingHeader({
  title = "All Products",
  description = "Browse our premium collection of fans, electronics, and home appliances with guaranteed warranty.",
}: ProductListingHeaderProps) {
  return (
    <header className="mt-5">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
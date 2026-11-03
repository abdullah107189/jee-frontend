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
      <h1 className="page-header-title">
        {title}
      </h1>
      <p className="page-header-desc max-w-2xl">
        {description}
      </p>
    </header>
  );
}
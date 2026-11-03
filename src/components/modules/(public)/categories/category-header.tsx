interface CategoryHeaderProps {
  name: string;
  description: string | null;
  productCount: number;
}

export function CategoryHeader({
  name,
  description,
  productCount,
}: CategoryHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="page-header-title">{name}</h1>
      {description && (
        <p className="page-header-desc mt-1">{description}</p>
      )}
      <p className="typo-caption text-muted-foreground mt-2">
        {productCount} {productCount === 1 ? "product" : "products"}
      </p>
    </div>
  );
}
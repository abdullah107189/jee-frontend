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
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        {productCount} {productCount === 1 ? "product" : "products"}
      </p>
    </div>
  );
}
export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-5 h-5 w-48 animate-pulse rounded bg-muted" />
      <div className="mb-6 h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    </main>
  );
}
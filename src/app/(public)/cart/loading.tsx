export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-xl border bg-muted/40" />
      </div>
    </div>
  );
}

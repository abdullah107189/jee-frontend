/**
 * Root loading.tsx — shown while the App Router streams a suspended page.
 * Serves as the global fallback for every route that awaits server data
 * unless a more specific segment (e.g. /login, /cart) provides its own.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
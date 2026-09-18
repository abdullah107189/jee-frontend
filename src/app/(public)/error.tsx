"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

/**
 * Root error boundary (app/error.tsx).
 * Renders whenever an uncaught error occurs while rendering any route.
 * Must be a Client Component and export the props below (Next.js 16 App Router).
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <TriangleAlert className="h-7 w-7 text-destructive" />
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
        An unexpected error occurred while rendering this page. Please try
        again, and contact support if the problem persists.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>

      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground/70">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
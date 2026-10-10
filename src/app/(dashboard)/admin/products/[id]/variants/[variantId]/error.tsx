"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-slate-900">Failed to load variant details</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md">{error.message || "An unexpected error occurred."}</p>
            <Button onClick={reset} className="mt-6 rounded-xl">
                Try again
            </Button>
        </div>
    );
}

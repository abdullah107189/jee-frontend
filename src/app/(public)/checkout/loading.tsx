import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="mb-6 h-8 w-40" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>

                <div className="lg:col-span-1">
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </div>
    );
}
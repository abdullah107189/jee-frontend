export default function Loading() {
    return (
        <div className="space-y-6 sm:space-y-8 animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-64 rounded bg-slate-200" />
                    <div className="h-4 w-32 rounded bg-slate-200" />
                </div>
                <div className="h-11 w-32 rounded-xl bg-slate-200" />
            </div>
            <div className="h-40 rounded-2xl bg-slate-200/60" />
            <div className="h-32 rounded-2xl bg-slate-200/60" />
            <div className="h-64 rounded-2xl bg-slate-200/60" />
        </div>
    );
}

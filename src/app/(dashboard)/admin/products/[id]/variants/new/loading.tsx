export default function Loading() {
    return (
        <div className="space-y-6 sm:space-y-8 animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="space-y-2">
                <div className="h-8 w-64 rounded bg-slate-200" />
                <div className="h-4 w-48 rounded bg-slate-200" />
            </div>
            <div className="h-48 rounded-2xl bg-slate-200/60" />
            <div className="h-48 rounded-2xl bg-slate-200/60" />
            <div className="h-48 rounded-2xl bg-slate-200/60" />
        </div>
    );
}

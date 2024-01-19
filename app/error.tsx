"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="p-20 flex flex-col items-center justify-center gap-5">
            <p>Something went wrong.</p>
            <button onClick={reset} className="bg-slate-900 text-white px-3 py-2 rounded">Reload page</button>
        </main>
    );
}
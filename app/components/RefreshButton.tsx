"use client";

import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRefresh() {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetch("/api/cache-clear", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Cache clear failed");
      }

      router.refresh();
    } catch {
      setError("Could not refresh now. Try again in a moment.");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 transition hover:border-sky-400/70 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing" : "Refresh Data"}
      </button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

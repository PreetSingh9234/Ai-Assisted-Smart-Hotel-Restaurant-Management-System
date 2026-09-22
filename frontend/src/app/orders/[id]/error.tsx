"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-12 bg-nora-danger-lt/30 rounded-card border border-nora-danger/20">
      <AlertTriangle className="text-nora-danger w-12 h-12 mb-4" />
      <h2 className="text-xl font-bold text-nora-text mb-2">Something went wrong!</h2>
      <p className="text-nora-secondary mb-6 text-sm">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-nora-text text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

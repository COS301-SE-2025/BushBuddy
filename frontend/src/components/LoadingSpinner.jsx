import React from "react";
import { useLoading } from "./LoadingContext";

export default function GlobalSpinner() {
  const { loadingCount } = useLoading();

  if (loadingCount === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

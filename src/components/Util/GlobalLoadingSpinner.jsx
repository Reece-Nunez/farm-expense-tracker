import React from "react";
import { createPortal } from "react-dom";
import { useLoading } from "../../context/LoadingContext";

export default function GlobalLoadingSpinner() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>,
    document.body
  );
}
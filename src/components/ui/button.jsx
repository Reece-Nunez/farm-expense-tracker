import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-lg bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-lg bg-green-800 text-white py-3 px-6 hover:bg-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

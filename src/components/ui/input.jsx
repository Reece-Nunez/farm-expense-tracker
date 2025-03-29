import React from "react";

export const Input = React.forwardRef(function InputWithRef(
  { className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-900 ${className}`}
      {...props}
    />
  );
});

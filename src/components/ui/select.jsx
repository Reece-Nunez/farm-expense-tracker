import React from "react";

export const Select = React.forwardRef(function SelectWithRef(
  { children, className = "", ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

import React from "react";

export const Select = React.forwardRef(function SelectWithRef(
  { children, className = "", ...props },
  ref
) {
  return (
    <select
      ref={ref} // attach the forwarded ref here
      className={`border px-3 py-2 rounded ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

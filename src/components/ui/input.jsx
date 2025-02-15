import React from "react";

export const Input = React.forwardRef(function InputWithRef(
  { className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref} // attach the forwarded ref here
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      {...props}
    />
  );
});

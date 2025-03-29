import React from "react";

export const Textarea = React.forwardRef(function TextareaWithRef(
  { className = "", ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-900 ${className}`}
      {...props}
    />
  );
});

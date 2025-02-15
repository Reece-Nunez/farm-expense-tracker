export function Select({ children, className = "", ...props }) {
    return (
      <select
        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
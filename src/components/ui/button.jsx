export function Button({ children, className = "", ...props }) {
    return (
      <button
        className={`rounded-2xl bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-green-600 hover:bg-green-700 active:bg-green-800
      text-white border border-transparent
      focus:ring-green-500 focus:ring-offset-2
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-white hover:bg-gray-50 active:bg-gray-100
      text-gray-900 border border-gray-300
      focus:ring-green-500 focus:ring-offset-2
      shadow-sm hover:shadow-md
    `,
    success: `
      bg-green-600 hover:bg-green-700 active:bg-green-800
      text-white border border-transparent
      focus:ring-green-500 focus:ring-offset-2
      shadow-sm hover:shadow-md
    `,
    warning: `
      bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
      text-white border border-transparent
      focus:ring-yellow-500 focus:ring-offset-2
      shadow-sm hover:shadow-md
    `,
    danger: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white border border-transparent
      focus:ring-red-500 focus:ring-offset-2
      shadow-sm hover:shadow-md
    `,
    outline: `
      bg-transparent hover:bg-green-50 active:bg-green-100
      text-green-600 border border-green-600 hover:border-green-700
      focus:ring-green-500 focus:ring-offset-2
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 active:bg-gray-200
      text-gray-600 border border-transparent
      focus:ring-gray-500 focus:ring-offset-2
    `,
    link: `
      bg-transparent hover:bg-transparent
      text-green-600 hover:text-green-700 underline-offset-4 hover:underline
      border-none shadow-none p-0 h-auto
      focus:ring-green-500 focus:ring-offset-2
    `
  };

  const sizes = {
    xs: `text-xs px-2 py-1 h-6`,
    sm: `text-sm px-3 py-1.5 h-8`,
    md: `text-sm px-4 py-2 h-10`,
    lg: `text-base px-6 py-3 h-12`,
    xl: `text-lg px-8 py-4 h-14`
  };

  const buttonClasses = cn(
    baseStyles,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className
  );

  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading ? <LoadingSpinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;

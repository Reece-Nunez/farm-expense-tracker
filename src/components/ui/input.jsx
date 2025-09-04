import React from "react";
import { cn } from "../../utils/cn";

export const Input = React.forwardRef(function InputWithRef({
  className = "",
  size = "md",
  variant = "default",
  error = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  label = null,
  helperText = null,
  errorText = null,
  ...props
}, ref) {
  const sizes = {
    sm: "px-3 py-2 text-sm h-9",
    md: "px-4 py-3 text-sm h-10",
    lg: "px-4 py-3 text-base h-12",
  };

  const variants = {
    default: `
      border border-gray-300 dark:border-gray-600
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-500 dark:placeholder:text-gray-400
      focus:ring-2 focus:ring-green-500 focus:border-green-500
      dark:focus:ring-green-400 dark:focus:border-green-400
    `,
    filled: `
      border-0 bg-gray-100 dark:bg-gray-700
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-500 dark:placeholder:text-gray-400
      focus:ring-2 focus:ring-green-500 focus:bg-white
      dark:focus:ring-green-400 dark:focus:bg-gray-800
    `,
    outlined: `
      border-2 border-gray-300 dark:border-gray-600
      bg-transparent
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-500 dark:placeholder:text-gray-400
      focus:ring-0 focus:border-green-500
      dark:focus:border-green-400
    `,
  };

  const baseStyles = `
    w-full rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:bg-gray-50 dark:disabled:bg-gray-700
  `;

  const errorStyles = error ? `
    border-red-500 dark:border-red-400
    focus:ring-red-500 focus:border-red-500
    dark:focus:ring-red-400 dark:focus:border-red-400
  ` : '';

  const inputClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    errorStyles,
    leftIcon && "pl-10",
    rightIcon && "pr-10",
    className
  );

  const InputField = () => (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {rightIcon}
        </div>
      )}
    </div>
  );

  if (!label && !helperText && !errorText) {
    return <InputField />;
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <InputField />
      {(helperText || errorText) && (
        <p className={cn(
          "text-sm",
          error || errorText ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
        )}>
          {error || errorText ? errorText : helperText}
        </p>
      )}
    </div>
  );
});

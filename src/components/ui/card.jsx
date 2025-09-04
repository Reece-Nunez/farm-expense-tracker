import React from "react";
import { cn } from "../../utils/cn";

export function Card({ 
  children, 
  className = "", 
  variant = "default",
  padding = "default",
  hover = false,
  ...props 
}) {
  const variants = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700",
    outlined: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600",
    ghost: "bg-transparent border-none shadow-none",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const baseStyles = `
    rounded-xl transition-all duration-200 ease-in-out
    ${hover ? "hover:shadow-md hover:scale-[1.02] cursor-pointer" : ""}
  `;

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className = "", 
  size = "default",
  ...props 
}) {
  const sizes = {
    sm: "text-lg font-semibold mb-2",
    default: "text-xl font-bold mb-4",
    lg: "text-2xl font-bold mb-4",
    xl: "text-3xl font-bold mb-6",
  };

  return (
    <div className={cn(
      "text-gray-900 dark:text-gray-100",
      sizes[size],
      className
    )} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={cn("text-gray-600 dark:text-gray-300", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className = "", 
  justify = "end",
  ...props 
}) {
  const justifications = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  return (
    <div className={cn(
      "flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700",
      justifications[justify],
      className
    )} {...props}>
      {children}
    </div>
  );
}

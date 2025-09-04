import { clsx } from 'clsx';

/**
 * Utility function for conditionally joining class names
 * A simple alternative to clsx/classnames that works with Tailwind CSS
 */
export function cn(...inputs) {
  return clsx(inputs);
}

export default cn;
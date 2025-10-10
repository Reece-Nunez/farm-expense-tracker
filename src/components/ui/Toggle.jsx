import React from 'react';
import { cn } from '../../utils/cn';

const Toggle = React.forwardRef(({
  checked = false,
  onChange = () => {},
  disabled = false,
  size = 'md',
  label = null,
  className = '',
  ...props
}, ref) => {
  const sizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3 translate-x-0 checked:translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5 translate-x-0 checked:translate-x-5',
    },
    lg: {
      track: 'w-14 h-8',
      thumb: 'w-6 h-6 translate-x-0 checked:translate-x-6',
    },
  };

  const trackClasses = cn(
    'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
    'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizes[size].track,
    checked 
      ? 'bg-green-600 dark:bg-green-500' 
      : 'bg-gray-200 dark:bg-gray-700',
    className
  );

  const thumbClasses = cn(
    'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
    sizes[size].thumb,
    checked ? 'translate-x-5' : 'translate-x-0'
  );

  const ToggleSwitch = () => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={trackClasses}
      onClick={() => onChange(!checked)}
      {...props}
    >
      <span className={thumbClasses} />
    </button>
  );

  if (!label) {
    return <ToggleSwitch />;
  }

  return (
    <div className="flex items-center space-x-3">
      <ToggleSwitch />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    </div>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;
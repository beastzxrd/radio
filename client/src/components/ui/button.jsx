import React from 'react';

const buttonVariants = {
  default: 'bg-green-500 text-black hover:bg-green-600',
  ghost: 'bg-transparent hover:bg-zinc-800',
  outline: 'border border-zinc-700 hover:bg-zinc-800',
};

const buttonSizes = {
  default: 'px-4 py-2',
  sm: 'px-3 py-1.5 text-sm',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2',
};

export const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

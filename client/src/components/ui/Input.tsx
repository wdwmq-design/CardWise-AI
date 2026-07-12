import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, icon, error, hint, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center group">
          {icon && (
            <div className="absolute left-3.5 text-surface-500 group-focus-within:text-accent pointer-events-none transition-colors duration-200">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-surface-900/60 hover:bg-surface-900/80 border text-surface-100 rounded-xl py-2.5 px-3.5
              focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 
              focus:bg-surface-900/90
              transition-all duration-200 text-sm placeholder:text-surface-600 font-medium
              ${icon ? 'pl-10' : ''}
              ${error
                ? 'border-danger/60 focus:ring-danger/30 focus:border-danger/60'
                : 'border-surface-800/80 hover:border-surface-700/60'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-danger font-medium flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-danger inline-block" />
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="text-xs text-surface-500 font-medium">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

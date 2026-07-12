import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, icon, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97] cursor-pointer tracking-[-0.01em] select-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-accent to-accent-light text-slate-950 hover:shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:brightness-110 border border-accent-light/20 font-bold',
      secondary:
        'bg-surface-800/80 hover:bg-surface-700/80 text-surface-100 border border-surface-700/60 hover:border-surface-600/60 backdrop-blur-sm',
      ghost:
        'bg-transparent hover:bg-surface-800/60 text-surface-300 hover:text-surface-100 border border-transparent',
      danger:
        'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/25 hover:border-danger/40',
      outline:
        'bg-transparent border border-surface-700/60 hover:border-accent/40 text-surface-200 hover:text-accent hover:bg-accent/5',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon && <span className="inline-flex shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

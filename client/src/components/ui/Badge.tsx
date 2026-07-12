import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' | 'indigo';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  size = 'md',
  dot = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full tracking-wide';

  const variants = {
    success:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger:   'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    info:     'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    neutral:  'bg-surface-800/80 text-surface-300 border border-surface-700/50',
    accent:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    indigo:   'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger:  'bg-rose-400',
    info:    'bg-blue-400',
    neutral: 'bg-surface-400',
    accent:  'bg-emerald-400',
    indigo:  'bg-indigo-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`} />
      )}
      {children}
    </span>
  );
};

export default Badge;

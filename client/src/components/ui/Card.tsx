import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'elevated' | 'ghost' | 'accent';
}

export const Card: React.FC<CardProps> = ({
  className = '',
  children,
  hover = false,
  glow = false,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'glass-card',
    elevated: 'glass-card shadow-lg',
    ghost: 'bg-transparent border border-surface-800/40',
    accent: 'bg-gradient-to-br from-accent/5 to-accent/0 border border-accent/20',
  };

  return (
    <div
      className={`
        ${variants[variant]}
        rounded-2xl p-5 text-surface-100 relative overflow-hidden transition-all duration-300
        ${hover ? 'hover:-translate-y-1 hover:shadow-lg hover:border-surface-700/30 cursor-pointer' : ''}
        ${glow ? 'glow-border shadow-[0_0_30px_rgba(16,185,129,0.12)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

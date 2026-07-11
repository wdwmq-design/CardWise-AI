import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = '',
  children,
  hover = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`
        glass rounded-2xl p-5 border border-surface-700/30 text-surface-100 shadow-md relative overflow-hidden transition-all duration-300
        ${hover ? 'hover:-translate-y-1 hover:shadow-lg hover:border-surface-600/40 hover:bg-slate-900/80 cursor-pointer' : ''}
        ${glow ? 'before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-accent/40 before:to-accent-light/10 before:rounded-2xl before:-z-10 bg-slate-900/90' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect'
}) => {
  const baseStyles =
    'animate-shimmer bg-linear-to-r from-surface-850 via-surface-800/80 to-surface-850 bg-[length:200%_100%] relative overflow-hidden';

  const variants = {
    text:   'h-4 w-3/4 rounded-lg',
    circle: 'rounded-full',
    rect:   'rounded-xl',
    card:   'rounded-2xl h-32 w-full',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite]" />
    </div>
  );
};

export default Skeleton;

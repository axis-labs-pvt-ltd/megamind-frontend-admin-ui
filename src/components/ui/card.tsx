import { cn } from '@/lib/utils';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'bg-[var(--bg-card)] backdrop-blur-sm rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[var(--border-primary)] transition-colors';
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        paddingClasses[padding],
        hover && 'hover:shadow-md transition-shadow duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

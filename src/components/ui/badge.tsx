import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  variant = 'primary',
  size = 'sm',
  children,
  className,
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/20',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)]',
    success: 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20',
    warning: 'bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/20',
    danger: 'bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/20',
    outline: 'bg-transparent border border-[var(--border-primary)] text-[var(--text-secondary)]',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span 
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        onClick && 'cursor-pointer hover:bg-opacity-80 active:scale-95 transform',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  );
});
Badge.displayName = "Badge";

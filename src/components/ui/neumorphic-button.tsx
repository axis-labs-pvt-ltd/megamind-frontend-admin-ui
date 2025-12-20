import { cn } from '@/lib/utils';
import React from 'react';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary';
}

export const NeumorphicButton = React.forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          'px-4 py-3 rounded-lg',
          'bg-[var(--bg-card)] text-[var(--text-primary)] font-medium',
          'border border-[var(--border-primary)]',
          // Default: Outset shadow like checkbox unchecked reversed
          'shadow-[0_4px_6px_-1px_rgba(59,130,246,0.3),_0_2px_4px_-2px_rgba(59,130,246,0.3)]',
          // Hover: Inset shadow like checkbox unchecked
          'hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.7)]',
          'hover:border-[var(--border-hover)]',
          // Active: Stronger inset shadow
          'active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),_inset_-3px_-3px_6px_rgba(255,255,255,0.8)]',
          'active:scale-[0.98]',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-transparent',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeumorphicButton.displayName = 'NeumorphicButton';

import { cn } from '@/lib/utils';
import React from 'react';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary';
}

export const NeumorphicButton = React.forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ children, variant = 'default', className, style, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const getShadow = () => {
      if (isActive) {
        // Active: Strong inset shadow
        return 'inset 8px 8px 16px rgba(0,0,0,0.8), inset -8px -8px 16px rgba(255,255,255,0.05)';
      }
      if (isHovered) {
        // Hover: Medium inset shadow
        return 'inset 6px 6px 12px rgba(0,0,0,0.6), inset -6px -6px 12px rgba(255,255,255,0.03)';
      }
      // Default: Extremely subtle downward-only shadow that won't cover labels
      return '0 1px 2px rgba(0,0,0,0.04)';
    };

    return (
      <button
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsActive(false);
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        className={cn(
          'relative',
          'px-4 py-3 rounded-lg',
          'bg-[var(--bg-card)] text-[var(--text-primary)] font-medium',
          'border',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent',
          className
        )}
        style={{
          ...style,
          boxShadow: getShadow(),
          transform: isActive ? 'scale(0.96)' : 'scale(1)',
          borderColor: isHovered ? '#60a5fa' : 'var(--border-primary)',
          transition: 'all 0.3s ease-out',
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeumorphicButton.displayName = 'NeumorphicButton';

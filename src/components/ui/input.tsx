import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder = " ", // Default to space to ensure :placeholder-shown CSS works for Neumorphic empty state detection
  value,
  onChange,
  disabled = false,
  error,
  icon: Icon,
  iconPosition = 'left',
  className, // Wrapper className
  label,
  required = false,
  onKeyPress,
  onKeyDown,
  ...props
}, ref) => {
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          {label}
          {required && <span className="text-[var(--accent-red)] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--icon-secondary)]" />
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'placeholder:text-[var(--text-muted)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && iconPosition === 'left' && 'pl-10',
            Icon && iconPosition === 'right' && 'pr-10',
            error && 'border-[var(--accent-red)] focus:ring-[var(--accent-red)]'
          )}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--icon-secondary)]" />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-[var(--accent-red)]">{error}</p>
      )}
    </div>
  );
});
Input.displayName = "Input";

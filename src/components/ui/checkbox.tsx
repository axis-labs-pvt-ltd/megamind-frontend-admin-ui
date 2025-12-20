import { cn } from '@/lib/utils';
import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, onChange, label, disabled = false, className }, ref) => {
    const inputId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('inline-flex items-center gap-3', className)}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        {/* Single label containing both checkbox and text - no tooltip */}
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-center gap-3 group',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* Checkbox icon */}
          <div
            className={cn(
              'w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0',
              'transition-all duration-300',
              checked
                ? 'bg-[var(--accent-blue)] shadow-[0_4px_6px_-1px_rgba(59,130,246,0.3),_0_2px_4px_-2px_rgba(59,130,246,0.3)]'
                : 'bg-[var(--bg-primary)] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.7)]',
              !disabled && 'group-hover:scale-105 group-hover:shadow-sm'
            )}
          >
            <svg
              className={cn(
                'w-3.5 h-3.5 text-white transition-all duration-200',
                checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* Text inside the same label */}
          {label && (
            <span
              className={cn(
                'text-sm font-medium select-none',
                'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]',
                'transition-colors duration-200'
              )}
            >
              {label}
            </span>
          )}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

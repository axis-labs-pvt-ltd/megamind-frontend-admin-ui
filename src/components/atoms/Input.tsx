import { type LucideIcon } from 'lucide-react';
import React, { KeyboardEvent } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  label?: string;
  required?: boolean;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  label,
  required = false,
  onKeyPress,
  onKeyDown,
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  const iconClasses = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${iconClasses}`}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
        />
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'sm',
  children,
  className = '',
  onClick,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors duration-200';
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-opacity-80 active:scale-95 transform' : '';
  
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
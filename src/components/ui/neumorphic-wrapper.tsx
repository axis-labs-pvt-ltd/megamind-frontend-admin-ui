'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface NeumorphicWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  variant?: 'primary' | 'secondary'; // Primary = Outset (Default), Secondary = Inset
  hoverEffect?: boolean;
  as?: React.ElementType;
}

export function NeumorphicWrapper({
  children,
  className,
  active = false,
  variant = 'primary',
  hoverEffect = true,
  as: Component = 'div',
  onClick,
  ...props
}: NeumorphicWrapperProps) {
  // Base styles that apply when NOT in neumorphic mode (can be overridden by className)
  const baseStyles = "transition-all duration-300 rounded-xl border border-transparent";
  
  // Neumorphic logic
  const neumorphicStyles = cn(
    "bg-[var(--bg-primary)] border-none text-[var(--text-primary)]",
    // Active state (Selected) -> Always Popped (Outset) + Scale
    active && "shadow-[var(--shadow-surface)] scale-[1.02] text-[var(--accent-blue)] font-semibold",
    
    // Inactive state depends on variant
    !active && variant === 'secondary' && "shadow-[var(--shadow-inset)] text-[var(--text-secondary)]", // Inset (Pressed)
    !active && variant === 'primary' && "shadow-[var(--shadow-surface)]", // Outset (Standard Card)

    // Hover Effects (only if inactive)
    !active && hoverEffect && "hover:shadow-[var(--shadow-surface)] hover:scale-[1.01] hover:text-[var(--accent-blue)] cursor-pointer"
  );

  return (
    <Component
      onClick={onClick}
      className={cn(baseStyles, neumorphicStyles, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

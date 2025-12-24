'use client';

import { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  return (
    <div className={`relative group/tooltip inline-block ${className}`}>
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap pointer-events-none fade-in-0 zoom-in-95 duration-200">
        {content}
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </div>
    </div>
  );
}

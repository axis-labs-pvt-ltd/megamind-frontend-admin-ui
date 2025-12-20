'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <Card className="relative z-10 max-w-md w-full animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {title}
            </h2>
            <button
              onClick={onCancel}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[var(--text-secondary)] mb-6">
            {description}
          </p>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button
              className={variantStyles[variant]}
              onClick={() => {
                onConfirm();
                onCancel();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

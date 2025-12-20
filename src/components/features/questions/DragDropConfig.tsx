// @ts-nocheck - TypeScript cannot properly infer complex discriminated unions. Types validated by Zod at runtime.
// Client Component - Drag & Drop configuration for question options

'use client';

import { Button } from '@/components/ui/button';
import { DraggableList } from '@/components/ui/draggable-list';
import type { QuestionFormData } from '@/lib/validations/question';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface DragDropConfigProps {
  control: UseFormReturn<QuestionFormData>['control'];
  errors: UseFormReturn<QuestionFormData>['formState']['errors'];
  optionFields: UseFieldArrayReturn['fields'];
  appendOption: UseFieldArrayReturn['append'];
  removeOption: UseFieldArrayReturn['remove'];
  setValue: UseFormReturn<QuestionFormData>['setValue'];
}

export function DragDropConfig({
  control,
  errors,
  optionFields,
  appendOption,
  removeOption,
  setValue
}: DragDropConfigProps) {
  const [items, setItems] = React.useState<{ id: string; content: string }[]>([]);

  // Sync items with optionFields
  React.useEffect(() => {
    const currentOptions = optionFields.map((field, index) => {
      const value = control._defaultValues.options?.[index] || control._formValues.options?.[index] || '';
      return {
        id: field.id,
        content: typeof value === 'string' ? value : '',
      };
    });
    setItems(currentOptions);
  }, [optionFields.length]);

  const handleReorder = (newItems: { id: string; content: string }[]) => {
    setItems(newItems);
    
    // Update all option fields to reflect new order
    const newOptions = newItems.map(item => item.content);
    newOptions.forEach((content, index) => {
      setValue(`options.${index}` as const, content);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Items to Order <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendOption('')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <DraggableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item, index) => (
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {index + 1}
              </span>
              <Controller
                name={`options.${index}` as const}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Item ${index + 1}`}
                    onChange={(e) => {
                      field.onChange(e);
                      // Update items state
                      const newItems = [...items];
                      newItems[index] = { ...newItems[index], content: e.target.value };
                      setItems(newItems);
                    }}
                  />
                )}
              />
              {optionFields.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        />

        {errors.options && (
          <p className="text-red-500 text-sm mt-1">{errors.options.message}</p>
        )}
      </div>
    </div>
  );
}

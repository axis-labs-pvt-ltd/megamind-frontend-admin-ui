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
    // We need to be careful not to create infinite loops by checking if values actually changed
    // But for now, we map the form values to local state for the generic DraggableList
    // We assume options are QuestionOption objects { id, text, ... }
    const currentOptions = optionFields.map((field, index) => {
      // Access the actual value from the form
      // @ts-ignore - accessing internal form state for initial sync
      const value = control._formValues.options?.[index] || control._defaultValues.options?.[index];
      
      return {
        id: field.id, 
        // If value is an object (new format), use .text. If it's string (legacy), use it directly.
        content: typeof value === 'object' && value ? value.text : (typeof value === 'string' ? value : ''),
        originalId: value?.id // Keep track of the real option ID
      };
    });
    setItems(currentOptions);
  }, [optionFields, control._formValues.options]); 
  // Note: dependency on optionFields is tricky in RHF, usually checking length is safer or deep comparison

  const handleReorder = (newItems: { id: string; content: string; originalId?: string }[]) => {
    setItems(newItems);
    
    // update form value with reordered objects
    // We need to reconstruct the QuestionOption object
    const newOptions = newItems.map(item => ({
       id: item.originalId || crypto.randomUUID(),
       text: item.content
    }));
    
    // We must update the entire options array field
    setValue('options', newOptions as any);
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
            onClick={() => appendOption({ id: crypto.randomUUID(), text: '' })}
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
                name={`options.${index}.text` as const}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Item ${index + 1}`}
                    onChange={(e) => {
                      field.onChange(e);
                      // Update local item state to reflect typing immediately
                      setItems(prev => prev.map((it, idx) => idx === index ? { ...it, content: e.target.value } : it));
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

        {errors && (errors as any).options && (
          <p className="text-red-500 text-sm mt-1">{((errors as any).options as any).message || "Invalid options"}</p>
        )}
      </div>
    </div>
  );
}

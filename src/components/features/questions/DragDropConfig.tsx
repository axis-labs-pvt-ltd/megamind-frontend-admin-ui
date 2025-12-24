// Client Component - Drag & Drop configuration for question options
'use client';

import { Button } from '@/components/ui/button';
import { DraggableList } from '@/components/ui/draggable-list';
import type { QuestionFormData } from '@/lib/validations/question';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import type { Control, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface DragDropConfigProps {
  control: UseFormReturn<QuestionFormData>['control'];
  errors: UseFormReturn<QuestionFormData>['formState']['errors'];
  optionFields: UseFieldArrayReturn['fields'];
  appendOption: UseFieldArrayReturn['append'];
  removeOption: UseFieldArrayReturn['remove'];
  setValue: UseFormReturn<QuestionFormData>['setValue'];
}

interface DragDropItemProps {
  index: number;
  control: Control<QuestionFormData>;
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (value: string) => void;
}

const DragDropItem = ({ index, control, canRemove, onRemove, onUpdate }: DragDropItemProps) => {
  return (
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
              onUpdate(e.target.value);
            }}
          />
        )}
      />
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Helper types for the form data values which might be mixed legacy strings or new objects
type FormOptionValue = string | { text: string; id?: string } | null | undefined;

const createDraggableItemsFromForm = (
  optionFields: { id: string }[],
  formValuesOptions: FormOptionValue[] | undefined,
  defaultValuesOptions: FormOptionValue[] | undefined
) => {
  return optionFields.map((field, index) => {
    // Access the actual value from the form
    const value = formValuesOptions?.[index] || defaultValuesOptions?.[index];
    
    let content = '';
    let originalId: string | undefined = undefined;

    if (typeof value === 'object' && value !== null) {
      // It's a QuestionOption object
      content = value.text;
      originalId = value.id;
    } else if (typeof value === 'string') {
      // It's a legacy string string
      content = value;
    }

    return {
      id: field.id, 
      content,
      originalId
    };
  });
};

const createFormOptionsFromItems = (items: { id: string; content: string; originalId?: string }[]) => {
  return items.map(item => ({
    id: item.originalId || crypto.randomUUID(),
    text: item.content
  }));
};

export function DragDropConfig({
  control,
  errors,
  optionFields,
  appendOption,
  removeOption,
  setValue
}: DragDropConfigProps) {
  const [items, setItems] = React.useState<{ id: string; content: string; originalId?: string }[]>([]);

  // Sync items with optionFields
  React.useEffect(() => {
    // @ts-ignore - accessing internal form state for initial sync
    const formOptions = control._formValues.options as FormOptionValue[] | undefined;
    // @ts-ignore - accessing internal form state for initial sync
    const defaultOptions = control._defaultValues.options as FormOptionValue[] | undefined;
    
    // We already know optionFields has id, so we can cast if needed or just pass it
    const currentOptions = createDraggableItemsFromForm(optionFields, formOptions, defaultOptions);
    setItems(currentOptions);
  }, [optionFields, control._formValues.options]); 
  // Note: dependency on optionFields is tricky in RHF, usually checking length is safer or deep comparison

  const handleReorder = (newItems: { id: string; content: string; originalId?: string }[]) => {
    setItems(newItems);
    
    // update form value with reordered objects
    const newOptions = createFormOptionsFromItems(newItems);
    
    // We must update the entire options array field
    // @ts-ignore - RHF types can be strict about exact matches but our structure is correct
    setValue('options', newOptions);
  };

  const handleItemUpdate = (index: number, value: string) => {
    setItems(prev => prev.map((it, idx) => idx === index ? { ...it, content: value } : it));
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
            <DragDropItem
              index={index}
              control={control}
              canRemove={optionFields.length > 2}
              onRemove={() => removeOption(index)}
              onUpdate={(value) => handleItemUpdate(index, value)}
            />
          )}
        />

        {'options' in errors && errors.options && 'message' in errors.options && (
          <p className="text-red-500 text-sm mt-1">{errors.options.message as string}</p>
        )}
      </div>
    </div>
  );
}

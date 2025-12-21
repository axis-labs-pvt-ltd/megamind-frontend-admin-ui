// Client Component - Matching Configuration
'use client';

import { Button } from '@/components/ui/button';
import { QuestionFormData } from '@/lib/validations/question';
import { Plus, Trash2 } from 'lucide-react';
import { Control, Controller, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';

interface MatchingConfigProps {
  control: Control<QuestionFormData>;
  errors: FieldErrors<QuestionFormData>;
  pairFields: Record<'id', string>[];
  appendPair: UseFieldArrayAppend<any, "matchingPairs">;
  removePair: UseFieldArrayRemove;
}

export function MatchingConfig({
  control,
  errors,
  pairFields,
  appendPair,
  removePair
}: MatchingConfigProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Matching Pairs <span className="text-red-500">*</span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendPair({ left: '', right: '' })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pair
        </Button>
      </div>
      <div className="space-y-3">
        {pairFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr,auto,1fr,auto] gap-2 items-center">
            <Controller
              name={`matchingPairs.${index}.left` as const}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Left item"
                />
              )}
            />
            <span className="text-[var(--text-secondary)]">→</span>
            <Controller
              name={`matchingPairs.${index}.right` as const}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Right item"
                />
              )}
            />
            {pairFields.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePair(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {(errors as any).matchingPairs && (
        <p className="text-red-500 text-sm mt-1">{(errors as any).matchingPairs.message}</p>
      )}
    </div>
  );
}

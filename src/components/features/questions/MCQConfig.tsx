// Client Component - MCQ Configuration
'use client';

import { Button } from '@/components/ui/button';
import { QuestionFormData } from '@/lib/validations/question';
import { Plus, Trash2 } from 'lucide-react';
import { Control, Controller, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';

interface MCQConfigProps {
  control: Control<QuestionFormData>;
  errors: FieldErrors<QuestionFormData>;
  optionFields: Record<'id', string>[];
  appendOption: UseFieldArrayAppend<any, "options">;
  removeOption: UseFieldArrayRemove;
  watch: UseFormWatch<QuestionFormData>;
}

export function MCQConfig({
  control,
  errors,
  optionFields,
  appendOption,
  removeOption,
  watch
}: MCQConfigProps) {
  const options = watch('options') as string[] || [];
  
  return (
    <div className="space-y-4">
      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Options <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendOption('')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
        <div className="space-y-2">
          {optionFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <span className="text-sm font-medium text-[var(--text-muted)] w-6">
                {String.fromCharCode(65 + index)}
              </span>
              <Controller
                name={`options.${index}` as const}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="flex-1 px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                )}
              />  
              {optionFields.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {(errors as any).options && (
          <p className="text-red-500 text-sm mt-1">{(errors as any).options.message}</p>
        )}
      </div>

      {/* Correct Answer */}
      <Controller
        name="correctAnswer"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Correct Answer <span className="text-red-500">*</span>
            </label>
            <select
              {...field}
              value={field.value as string}
              className="w-full px-4 py-3 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select correct answer</option>
              {options.filter(opt => opt.trim()).map((option, index) => (
                <option key={index} value={option}>
                  {String.fromCharCode(65 + index)} - {option}
                </option>
              ))}
            </select>
            {errors.correctAnswer && (
              <p className="text-red-500 text-sm mt-1">{errors.correctAnswer.message as string}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

// Client Component - Multi-Select Configuration
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { QuestionFormData } from '@/lib/validations/question';
import { QuestionOption } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { Control, Controller, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface MultiSelectConfigProps {
  control: Control<QuestionFormData>;
  errors: FieldErrors<QuestionFormData>;
  optionFields: Record<'id', string>[];
  appendOption: UseFieldArrayAppend<any, "options">;
  removeOption: UseFieldArrayRemove;
  watch: UseFormWatch<QuestionFormData>;
  setValue: UseFormSetValue<QuestionFormData>;
}

// Sub-component for Option List
function MultiSelectOptionList({
  control,
  fields,
  onAdd,
  onRemove,
  error
}: {
  control: Control<QuestionFormData>;
  fields: Record<'id', string>[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Options <span className="text-red-500">*</span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <span className="text-sm font-medium text-[var(--text-muted)] w-6">
              {String.fromCharCode(65 + index)}
            </span>
            <Controller
              name={`options.${index}.text` as const}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="flex-1 px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
              )}
            />
            {fields.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

// Sub-component for Correct Answer Selection
function MultiSelectCorrectAnswerSelector({
  options,
  correctAnswers,
  onToggle,
  error
}: {
  options: QuestionOption[];
  correctAnswers: string[];
  onToggle: (id: string) => void;
  error?: string;
}) {
  const validOptions = options.filter(opt => opt.text && opt.text.trim());

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
        Correct Answers (select all that apply) <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2 p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)]">
        {validOptions.map((option, index) => (
          <Checkbox
            key={option.id}
            label={`${String.fromCharCode(65 + index)} - ${option.text}`}
            checked={correctAnswers.includes(option.id)}
            onChange={() => onToggle(option.id)}
          />
        ))}
        {validOptions.length === 0 && (
          <p className="text-sm text-[var(--text-secondary)] italic">Add options above to select correct answers</p>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

export function MultiSelectConfig({
  control,
  errors,
  optionFields,
  appendOption,
  removeOption,
  watch,
  setValue
}: MultiSelectConfigProps) {
  const options = (watch('options') as QuestionOption[]) || [];
  const correctAnswers = (watch('correctAnswer') as string[]) || [];

  const toggleCorrectAnswer = (optionId: string) => {
    if (correctAnswers.includes(optionId)) {
      setValue('correctAnswer', correctAnswers.filter(a => a !== optionId) as never);
    } else {
      setValue('correctAnswer', [...correctAnswers, optionId] as never);
    }
  };

  return (
    <div className="space-y-4">
      {/* Options */}
      <MultiSelectOptionList
        control={control}
        fields={optionFields}
        onAdd={() => appendOption({ id: crypto.randomUUID(), text: '' })}
        onRemove={removeOption}
        error={'options' in errors && errors.options && 'message' in errors.options ? errors.options.message as string : undefined}
      />

      {/* Correct Answers (Multiple) */}
      <MultiSelectCorrectAnswerSelector
        options={options}
        correctAnswers={correctAnswers}
        onToggle={toggleCorrectAnswer}
        error={errors.correctAnswer?.message as string}
      />
    </div>
  );
}


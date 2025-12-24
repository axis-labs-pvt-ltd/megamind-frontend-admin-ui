// Client Component - Binary (Yes/No, True/False) Configuration
'use client';

import { QuestionFormData } from '@/lib/validations/question';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface BinaryConfigProps {
  type: 'yes-no' | 'true-false';
  control: Control<QuestionFormData>;
  errors: FieldErrors<QuestionFormData>;
}

export function BinaryConfig({
  type,
  control,
  errors
}: BinaryConfigProps) {
  const options = type === 'yes-no' ? ['Yes', 'No'] : ['True', 'False'];

  return (
    <Controller
      name="correctAnswer"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            Correct Answer <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => field.onChange(option)}
                className={`flex-1 p-4 rounded-lg border-2 font-medium transition-all ${
                  field.value === option
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]'
                    : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {errors.correctAnswer && (
            <p className="text-red-500 text-sm mt-1">{errors.correctAnswer.message as string}</p>
          )}
        </div>
      )}
    />
  );
}

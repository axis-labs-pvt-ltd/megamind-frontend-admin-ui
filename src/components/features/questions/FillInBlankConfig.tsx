// Client Component - Fill In Blank Configuration
'use client';

import { QuestionFormData } from '@/lib/validations/question';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface FillInBlankConfigProps {
  control: Control<QuestionFormData>;
  errors: FieldErrors<QuestionFormData>;
}

export function FillInBlankConfig({
  control,
  errors
}: FillInBlankConfigProps) {
  return (
    <div className="space-y-4">
      <Controller
        name="correctAnswer"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Correct Answer <span className="text-red-500">*</span>
            </label>
            <input
              {...field}
              value={field.value as string}
              className="w-full px-4 py-3 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the correct answer"
            />
            {errors.correctAnswer && (
              <p className="text-red-500 text-sm mt-1">{errors.correctAnswer.message as string}</p>
            )}
          </div>
        )}
      />

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Alternative Acceptable Answers (Optional)
        </label>
        <p className="text-xs text-[var(--text-secondary)] mb-2">
          Enter comma-separated alternative answers that should also be accepted as correct
        </p>
        <Controller
          name="acceptableAnswers"
          control={control}
          render={({ field }) => (
            <input
              value={(field.value as string[] || []).join(', ')}
              onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full px-4 py-3 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., answer1, answer2, answer3"
            />
          )}
        />
      </div>
    </div>
  );
}

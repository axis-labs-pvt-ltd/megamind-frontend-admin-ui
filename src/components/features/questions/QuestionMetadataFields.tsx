import { useSubjects } from '@/hooks/queries/useSubjects';
import { Input } from '@/components/ui/input';
import { QuestionFormData } from '@/lib/validations/question';
import { Video } from 'lucide-react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface QuestionMetadataFieldsProps {
  control: Control<QuestionFormData>;
  errors: FieldErrors<QuestionFormData>;
}

export function QuestionMetadataFields({ control, errors }: QuestionMetadataFieldsProps) {
  const { data: subjects = [] } = useSubjects();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="moduleId"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Module <span className="text-red-500">*</span>
              </label>
              <select
                {...field}
                className="w-full px-4 py-3 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Module</option>
                {subjects.flatMap(subject =>
                  subject.modules.map(module => (
                    <option key={module.id} value={module.id}>
                      {subject.name} - {module.name}
                    </option>
                  ))
                )}
              </select>
              {errors.moduleId && (
                <p className="text-red-500 text-sm mt-1">{errors.moduleId.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                {...field}
                className="w-full px-4 py-3 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}
        />
      </div>

      <Controller
        name="solutionVideoUrl"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Solution Video URL (Optional)"
            placeholder="https://example.com/video"
            icon={Video}
            error={errors.solutionVideoUrl?.message}
          />
        )}
      />
    </div>
  );
}

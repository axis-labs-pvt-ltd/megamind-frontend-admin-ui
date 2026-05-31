import { useSubjects } from '@/hooks/queries/useSubjects';
import { Input } from '@/components/ui/input';
import { QuestionFormData } from '@/lib/validations/question';
import { FileText, Video } from 'lucide-react';
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

      {/* Solution — video URL + written explanation */}
      <div className="space-y-3 p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-4 w-4 text-[var(--text-secondary)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Solution (Optional)</span>
        </div>

        <Controller
          name="solutionVideoUrl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Video URL"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              icon={Video}
              error={(errors as any).solutionVideoUrl?.message}
            />
          )}
        />

        <Controller
          name={'solutionText' as any}
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Written explanation
              </label>
              <textarea
                {...field}
                rows={4}
                placeholder="Explain the correct answer step by step…"
                className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-sm"
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}

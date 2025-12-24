import { questionTypeConfig } from '@/lib/validations/question';
import { QuestionType } from '@/types';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeChange: (type: QuestionType) => void;
  error?: string;
}

export function QuestionTypeSelector({
  selectedType,
  onTypeChange,
  error,
}: QuestionTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
        Question Type
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(questionTypeConfig) as QuestionType[]).map((type) => {
          const typeConfig = questionTypeConfig[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === type
                  ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 shadow-sm'
                  : 'border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:shadow-sm'
              }`}
            >
              <div className="text-2xl mb-2">{typeConfig.icon}</div>
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                {typeConfig.label}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {typeConfig.description}
              </p>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

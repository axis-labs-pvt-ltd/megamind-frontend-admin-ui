import { QuestionFormData } from '@/lib/validations/question';
import { Question, QuestionOption, QuestionType } from '@/types';
import { UseFormSetValue } from 'react-hook-form';

/**
 * Prepares the initial form data based on the question being edited.
 */
/**
 * Helper to extract type-specific data from the question.
 */
const getTypeSpecificData = (editingQuestion: Question): Partial<QuestionFormData> => {
  const defaults: Partial<QuestionFormData> = {
    correctAnswer: editingQuestion.correctAnswer
  };

  // Use type guards to safely access type-specific properties
  const typesWithOptions: QuestionType[] = ['mcq', 'multi-select', 'drag-drop'];
  if (typesWithOptions.includes(editingQuestion.type)) {
    return { ...defaults, options: editingQuestion.options || [] };
  }
  
  if (editingQuestion.type === 'matching') {
    return { ...defaults, matchingPairs: editingQuestion.matchingPairs || [] };
  }
  
  if (editingQuestion.type === 'fill-in-blank') {
    return { ...defaults, acceptableAnswers: editingQuestion.acceptableAnswers };
  }

  return defaults;
};

/**
 * Prepares the initial form data based on the question being edited.
 */
export const getInitialFormData = (editingQuestion: Question | null): Partial<QuestionFormData> | null => {
  if (!editingQuestion) return null;

  const baseData: Partial<QuestionFormData> = {
    type: editingQuestion.type,
    text: editingQuestion.text,
    difficulty: editingQuestion.difficulty,
    moduleId: editingQuestion.moduleId,
    categoryIds: editingQuestion.categories.map(c => c.id),
    tagIds: editingQuestion.tags.map(t => t.id),
    solutionVideoUrl: editingQuestion.solutionVideoUrl || '',
  };

  return {
    ...baseData,
    ...getTypeSpecificData(editingQuestion),
  } as Partial<QuestionFormData>;
};

/**
 * Resets type-specific fields when the question type changes.
 */
export const resetFormFieldsForType = (
  type: QuestionType, 
  setValue: UseFormSetValue<QuestionFormData>
) => {
  // Helper to create empty option objects
  const createEmptyOptions = (): QuestionOption[] => [
    { id: crypto.randomUUID(), text: '' },
    { id: crypto.randomUUID(), text: '' },
    { id: crypto.randomUUID(), text: '' },
    { id: crypto.randomUUID(), text: '' }
  ];

  const resetHandlers: Record<string, () => void> = {
    'mcq': () => {
      setValue('options', createEmptyOptions());
      setValue('correctAnswer', '');
    },
    'multi-select': () => {
      setValue('options', createEmptyOptions());
      setValue('correctAnswer', []);
    },
    'drag-drop': () => {
      setValue('options', createEmptyOptions());
      setValue('correctAnswer', []);
    },
    'matching': () => {
      setValue('matchingPairs', [{ left: '', right: '' }, { left: '', right: '' }]);
      setValue('correctAnswer', []);
    },
    'fill-in-blank': () => {
      setValue('correctAnswer', '');
      setValue('acceptableAnswers', []);
    }
  };

  const handler = resetHandlers[type];
  if (handler) {
    handler();
  } else {
    setValue('correctAnswer', '');
  }
};

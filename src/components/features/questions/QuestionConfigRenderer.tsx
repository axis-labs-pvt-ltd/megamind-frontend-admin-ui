import { QuestionFormData } from '@/lib/validations/question';
import { QuestionType } from '@/types';
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { BinaryConfig } from './BinaryConfig';
import { DragDropConfig } from './DragDropConfig';
import { FillInBlankConfig } from './FillInBlankConfig';
import { MatchingConfig } from './MatchingConfig';
import { MCQConfig } from './MCQConfig';
import { MultiSelectConfig } from './MultiSelectConfig';

interface QuestionConfigRendererProps {
  type: QuestionType;
  control: Control<QuestionFormData>;
  errors: FieldErrors<QuestionFormData>;
  optionFields: any[]; // Typed loosely to avoid deeply nested complexities for now
  appendOption: any;
  removeOption: any;
  pairFields: any[];
  appendPair: any;
  removePair: any;
  watch: UseFormWatch<QuestionFormData>;
  setValue: UseFormSetValue<QuestionFormData>;
}

export function QuestionConfigRenderer({
  type,
  control,
  errors,
  optionFields,
  appendOption,
  removeOption,
  pairFields,
  appendPair,
  removePair,
  watch,
  setValue
}: QuestionConfigRendererProps) {
  switch (type) {
    case 'mcq':
      return (
        <MCQConfig
          control={control}
          errors={errors}
          optionFields={optionFields}
          appendOption={appendOption}
          removeOption={removeOption}
          watch={watch}
        />
      );
    
    case 'multi-select':
      return (
        <MultiSelectConfig
          control={control}
          errors={errors}
          optionFields={optionFields}
          appendOption={appendOption}
          removeOption={removeOption}
          watch={watch}
          setValue={setValue}
        />
      );
    
    case 'yes-no':
    case 'true-false':
      return (
        <BinaryConfig
          type={type}
          control={control}
          errors={errors}
        />
      );
    
    case 'fill-in-blank':
      return (
        <FillInBlankConfig
          control={control}
          errors={errors}
        />
      );
    
    case 'drag-drop':
      return (
        <DragDropConfig
          control={control}
          errors={errors}
          optionFields={optionFields}
          appendOption={appendOption}
          removeOption={removeOption}
          setValue={setValue}
        />
      );
    
    case 'matching':
      return (
        <MatchingConfig
          control={control}
          errors={errors}
          pairFields={pairFields}
          appendPair={appendPair}
          removePair={removePair}
        />
      );
    
    default:
      return null;
  }
}

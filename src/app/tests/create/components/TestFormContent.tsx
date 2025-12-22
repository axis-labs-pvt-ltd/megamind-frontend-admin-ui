import { TestBasicInfo } from '@/components/features/tests/TestBasicInfo';
import { TestCoverImage } from '@/components/features/tests/TestCoverImage';
import { TestDynamicRules } from '@/components/features/tests/TestDynamicRules';
import { TestQuestionsSelection } from '@/components/features/tests/TestQuestionsSelection';
import { TestTags } from '@/components/features/tests/TestTags';
import { TestTypeSelection } from '@/components/features/tests/TestTypeSelection';
import { CreateTestValues } from '@/lib/validations/test';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface TestFormContentProps {
  register: UseFormRegister<CreateTestValues>;
  control: Control<CreateTestValues>;
  setValue: UseFormSetValue<CreateTestValues>;
  watch: UseFormWatch<CreateTestValues>;
  errors: FieldErrors<CreateTestValues>;
}

export function TestFormContent({ register, control, setValue, watch, errors }: TestFormContentProps) {
  const testType = watch('type');
  const selectedQuestions = watch('questions') || [];
  const tags = watch('tags') || [];
  const coverImage = watch('coverImage');
  const title = watch('title');
  const description = watch('description');

  return (
    <>
      <TestTypeSelection testType={testType} setValue={setValue} errors={errors} />
      
      <TestBasicInfo register={register} errors={errors} />
      
      <div className="space-y-6">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6 space-y-6">
          <TestCoverImage 
            register={register} 
            setValue={setValue} 
            errors={errors} 
            coverImage={coverImage || ''} 
            title={title || ''} 
            description={description || ''} 
          />
          <TestTags tags={tags} setValue={setValue} />
        </div>
      </div>
      
      {testType === 'static' && (
        <TestQuestionsSelection 
          selectedQuestions={selectedQuestions} 
          setValue={setValue} 
          errors={errors} 
        />
      )}
      
      {testType === 'dynamic' && (
        <TestDynamicRules 
          control={control} 
          register={register} 
          errors={errors} 
        />
      )}
    </>
  );
}

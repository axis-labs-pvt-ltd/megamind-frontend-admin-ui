// Client Component - Create Test Form (composed)
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TestBasicInfo } from './TestBasicInfo';
import { TestCoverImage } from './TestCoverImage';
import { TestDynamicRules } from './TestDynamicRules';
import { TestQuestionsSelection } from './TestQuestionsSelection';
import { TestTags } from './TestTags';
import { TestTypeSelection } from './TestTypeSelection';
import { useCreateTestForm } from './useCreateTestForm';

export function CreateTestForm() {
  const router = useRouter();
  const { form, isLoading, onSubmit, watchedValues } = useCreateTestForm();

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  const {
    testType,
    selectedQuestions,
    tags,
    coverImage,
    title,
    description,
  } = watchedValues;

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* 1. Test Type */}
      <TestTypeSelection testType={testType} setValue={setValue} errors={errors} />

      {/* 2. Basic Info */}
      <TestBasicInfo register={register} errors={errors} />

      {/* 3. Media & Metadata (Cover & Tags) */}
      <Card className="p-6 space-y-6">
        <TestCoverImage 
          register={register} 
          setValue={setValue} 
          errors={errors} 
          coverImage={coverImage || ''} 
          title={title || ''} 
          description={description || ''} 
        />
        <TestTags tags={tags} setValue={setValue} />
      </Card>

      {/* 4. Question Selection (Static) */}
      {testType === 'static' && (
        <TestQuestionsSelection selectedQuestions={selectedQuestions} setValue={setValue} errors={errors} />
      )}

      {/* 5. Dynamic Rules (Dynamic) */}
      {testType === 'dynamic' && (
        <TestDynamicRules control={control} register={register} errors={errors} />
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-[var(--border-primary)]">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/tests')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[var(--accent-blue)] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
               Creating...
            </>
          ) : (
            <>
               <Save className="h-4 w-4 mr-2" />
               Create Test
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// @ts-nocheck - TypeScript cannot properly infer complex discriminated unions with react-hook-form. Types are validated by Zod at runtime.
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuestionFormData, questionFormSchema, questionTypeConfig } from '@/lib/validations/question';
import { Question, QuestionType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { QuestionConfigRenderer } from './QuestionConfigRenderer';
import { getInitialFormData, resetFormFieldsForType } from './QuestionFormHelpers';
import { QuestionMetadataFields } from './QuestionMetadataFields';
import { QuestionTextEditor } from './QuestionTextEditor';
import { QuestionTypeSelector } from './QuestionTypeSelector';


interface QuestionFormProps {
  editingQuestion: Question | null;
  onSubmit: (formData: QuestionFormData) => void;
  onCancel: () => void;
}



export function QuestionForm({ editingQuestion, onSubmit, onCancel }: QuestionFormProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('mcq');

  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<QuestionFormData>({
    // @ts-expect-error - TypeScript cannot infer discriminated union types with react-hook-form, validated by Zod at runtime
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      type: 'mcq',
      text: '',
      imageUrl: undefined,
      difficulty: 'medium',
      moduleId: '',
      categoryIds: [],
      tagIds: [],
      solutionVideoUrl: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    },
  });

  const watchedType = watch('type');

  // Update selected type when form type changes
  useEffect(() => {
    if (watchedType !== selectedType) {
      setSelectedType(watchedType);
    }
  }, [watchedType, selectedType]);

  // Options field array for MCQ, Multi-Select, Drag-Drop
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: 'options' as never, // Type assertion needed due to discriminated union
  });

  // Matching pairs field array
  const { fields: pairFields, append: appendPair, remove: removePair } = useFieldArray({
    control,
    name: 'matchingPairs' as never,
  });

  // Load editing question data
  useEffect(() => {
    const formData = getInitialFormData(editingQuestion);
    if (formData) {
      reset(formData as QuestionFormData);
      if (editingQuestion) {
          setSelectedType(editingQuestion.type);
      }
    }
  }, [editingQuestion, reset]);

  const handleTypeChange = (type: QuestionType) => {
    setSelectedType(type);
    setValue('type', type);
    resetFormFieldsForType(type, setValue);
  };

  const config = questionTypeConfig[selectedType];

  return (
    <Card className="p-6 border-2 border-[var(--border-primary)] bg-[var(--bg-card)]">
      {/* @ts-expect-error - TypeScript cannot infer discriminated union handler types */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {editingQuestion ? 'Edit Question' : 'Create New Question'}
          </h3>
          <Button type="button" variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Question Type Selector */}
        <QuestionTypeSelector
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          error={errors.type?.message}
        />

        {/* Question Text + Image + Formula toolbar */}
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <Controller
              name={'imageUrl' as any}
              control={control}
              render={({ field: imgField }) => (
                <QuestionTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  imageUrl={imgField.value}
                  onImageChange={imgField.onChange}
                  error={errors.text?.message}
                />
              )}
            />
          )}
        />

        {/* Type-Specific Answer Configuration */}
        <QuestionConfigRenderer
          type={selectedType}
          control={control}
          errors={errors}
          optionFields={optionFields}
          appendOption={appendOption}
          removeOption={removeOption}
          pairFields={pairFields}
          appendPair={appendPair}
          removePair={removePair}
          watch={watch}
          setValue={setValue}
        />

        {/* Module & Difficulty & Video */}
        <QuestionMetadataFields control={control} errors={errors} />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {editingQuestion ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

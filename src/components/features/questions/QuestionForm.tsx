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

  const { control, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema) as any,
    defaultValues: {
      type: 'mcq',
      text: '',
      imageUrl: undefined,
      difficulty: 'medium',
      moduleId: '',
      categoryIds: [],
      tagIds: [],
      solutionVideoUrl: '',
      options: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
      ],
      correctAnswer: '',
    },
  });

  const watchedType = watch('type');

  useEffect(() => {
    if (watchedType !== selectedType) setSelectedType(watchedType as QuestionType);
  }, [watchedType, selectedType]);

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: 'options' as any,
  });

  const { fields: pairFields, append: appendPair, remove: removePair } = useFieldArray({
    control,
    name: 'matchingPairs' as any,
  });

  useEffect(() => {
    const formData = getInitialFormData(editingQuestion);
    if (formData) {
      reset(formData as QuestionFormData);
      if (editingQuestion) setSelectedType(editingQuestion.type);
    }
  }, [editingQuestion, reset]);

  const handleTypeChange = (type: QuestionType) => {
    setSelectedType(type);
    setValue('type', type as any);
    resetFormFieldsForType(type, setValue as any);
  };

  const handleFormSubmit = (data: QuestionFormData) => {
    // Strip empty options so partial option lists work (e.g. 2 out of 4 filled)
    const cleaned: QuestionFormData = {
      ...data,
      options: data.options?.filter(o => o.text.trim()),
      solutionVideoUrl: data.solutionVideoUrl?.trim() || undefined,
    };
    onSubmit(cleaned);
  };

  const onInvalid = (errs: unknown) => {
    console.error('[QuestionForm] validation errors:', errs);
  };

  return (
    <Card className="p-6 border-2 border-[var(--border-primary)] bg-[var(--bg-card)]">
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-6">
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
          error={(errors as any).type?.message}
        />

        {/* Question Text + Image */}
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
          control={control as any}
          errors={errors as any}
          optionFields={optionFields}
          appendOption={appendOption}
          removeOption={removeOption}
          pairFields={pairFields}
          appendPair={appendPair}
          removePair={removePair}
          watch={watch as any}
          setValue={setValue as any}
        />

        {/* Module & Difficulty & Video */}
        <QuestionMetadataFields control={control as any} errors={errors as any} />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {editingQuestion ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

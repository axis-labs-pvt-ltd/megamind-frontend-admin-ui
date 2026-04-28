// components/features/tests/useCreateTestForm.ts
import { createTest } from '@/services/api/tests';
import { CreateTestValues, createTestSchema } from '@/lib/validations/test';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function useCreateTestForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTestValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      type: 'static',
      title: '',
      description: '',
      timeLimit: 60,
      passingScore: 70,
      estimatedDuration: 45,
      coverImage: '',
      tags: [],
      questions: [],
      dynamicRules: [{ moduleId: '', questionCount: 5, difficulty: 'medium' }],
    },
  });

  const { watch, handleSubmit } = form;

  const onSubmit = async (data: CreateTestValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await createTest(data);
      router.push('/admin/tests');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create test');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit: handleSubmit(onSubmit),
    watchedValues: {
      testType: watch('type'),
      selectedQuestions: watch('questions') || [],
      tags: watch('tags') || [],
      coverImage: watch('coverImage'),
      title: watch('title'),
      description: watch('description'),
    },
  };
}
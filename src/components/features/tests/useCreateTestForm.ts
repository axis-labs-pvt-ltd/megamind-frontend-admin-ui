import { CreateTestValues, createTestSchema } from '@/lib/validations/test';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function useCreateTestForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const testType = watch('type');
  const selectedQuestions = watch('questions') || [];
  const tags = watch('tags') || [];
  const coverImage = watch('coverImage');
  const title = watch('title');
  const description = watch('description');

  const onSubmit = async (data: CreateTestValues) => {
    setIsLoading(true);
    try {
      console.log('Creating Test:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/admin/tests');
    } catch (error) {
      console.error('Failed to create test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: handleSubmit(onSubmit),
    watchedValues: {
      testType,
      selectedQuestions,
      tags,
      coverImage,
      title,
      description,
    },
  };
}

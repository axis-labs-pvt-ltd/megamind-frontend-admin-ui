import { CreateTestValues, createTestSchema } from '@/lib/validations/test';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const DEFAULT_FORM_VALUES: CreateTestValues = {
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
};

export function useTestForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTestValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = async (data: CreateTestValues) => {
    setIsLoading(true);
    try {
      // await testService.createTest(data); // Simulate API call
      console.log('Creating Test:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/tests');
    } catch (error) {
      console.error('Failed to create test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
}

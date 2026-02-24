import { createTest } from '@/services/api/tests';
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
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTestValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // ✅ Raw async handler — NOT wrapped with handleSubmit
  const onSubmit = async (data: CreateTestValues) => {
    console.log('=== SUBMITTING ===', data);
    setIsLoading(true);
    setError(null);
    try {
      await createTest(data);
      router.push('/tests');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create test');
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, error, onSubmit };
}
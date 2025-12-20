// Client Component - Step 1: Test Type Selection
'use client';

import { Card } from '@/components/ui/card';
import { CreateTestValues } from '@/lib/validations/test';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

interface TestTypeSelectionProps {
  testType: 'static' | 'dynamic';
  setValue: UseFormSetValue<CreateTestValues>;
  errors: FieldErrors<CreateTestValues>;
}

export function TestTypeSelection({ testType, setValue, errors }: TestTypeSelectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Test Type</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div
          className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            testType === 'static' 
              ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10' 
              : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
          }`}
          onClick={() => setValue('type', 'static')}
        >
          <h4 className="font-medium text-[var(--text-primary)]">Static Test</h4>
          <p className="text-sm text-[var(--text-secondary)]">Fixed set of questions</p>
        </div>
        <div
          className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            testType === 'dynamic' 
              ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10' 
              : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
          }`}
          onClick={() => setValue('type', 'dynamic')}
        >
          <h4 className="font-medium text-[var(--text-primary)]">Dynamic Test</h4>
          <p className="text-sm text-[var(--text-secondary)]">Rule-based question selection</p>
        </div>
      </div>
      {errors.type && <p className="text-sm text-[var(--accent-red)] mt-2">{errors.type.message}</p>}
    </Card>
  );
}

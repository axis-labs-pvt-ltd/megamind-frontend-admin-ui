// Client Component - Step 2: Basic Info
'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreateTestValues } from '@/lib/validations/test';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface TestBasicInfoProps {
  register: UseFormRegister<CreateTestValues>;
  errors: FieldErrors<CreateTestValues>;
}

export function TestBasicInfo({ register, errors }: TestBasicInfoProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Test Details</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Test Title</label>
            <Input
              {...register('title')}
              placeholder="Enter test title"
              error={errors.title?.message}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Time Limit (mins)</label>
            <Input
              type="number"
              {...register('timeLimit', { valueAsNumber: true })}
              placeholder="60"
              error={errors.timeLimit?.message}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Passing Score (%)</label>
            <Input
              type="number"
              {...register('passingScore', { valueAsNumber: true })}
              placeholder="70"
              error={errors.passingScore?.message}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Est. Duration (mins)</label>
            <Input
              type="number"
              {...register('estimatedDuration', { valueAsNumber: true })}
              placeholder="45"
              error={errors.estimatedDuration?.message}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent"
            rows={3}
            placeholder="Enter test description"
          />
        </div>
      </div>
    </Card>
  );
}

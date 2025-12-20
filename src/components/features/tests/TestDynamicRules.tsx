// Client Component - Dynamic Rules
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockSubjects } from '@/lib/mock-data';
import { CreateTestValues } from '@/lib/validations/test';
import { Plus, Trash2 } from 'lucide-react';
import { Control, FieldErrors, useFieldArray, UseFormRegister } from 'react-hook-form';

interface TestDynamicRulesProps {
  control: Control<CreateTestValues>;
  register: UseFormRegister<CreateTestValues>;
  errors: FieldErrors<CreateTestValues>;
}

export function TestDynamicRules({ control, register, errors }: TestDynamicRulesProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dynamicRules",
  });

  return (
    <Card className="p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Dynamic Rules</h3>
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ moduleId: '', questionCount: 5, difficulty: 'medium' })}
        >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
        </Button>
        </div>
        <div className="space-y-4">
        {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg bg-[var(--bg-secondary)] animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-[var(--text-primary)]">Rule {index + 1}</h4>
                <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                disabled={fields.length === 1} 
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                    Module
                </label>
                <select
                    className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                    {...register(`dynamicRules.${index}.moduleId`)}
                >
                    <option value="">Select Module</option>
                    {mockSubjects.flatMap(subject => 
                    subject.modules.map(module => (
                        <option key={module.id} value={module.id}>
                        {subject.name} - {module.name}
                        </option>
                    ))
                    )}
                </select>
                {errors.dynamicRules?.[index]?.moduleId && (
                    <p className="text-xs text-[var(--accent-red)]">{errors.dynamicRules[index]?.moduleId?.message}</p>
                )}
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                    Count
                </label>
                <input
                    type="number"
                    className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                    {...register(`dynamicRules.${index}.questionCount`, { valueAsNumber: true })}
                    min="1"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                    Difficulty
                </label>
                <select
                    className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                    {...register(`dynamicRules.${index}.difficulty`)}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                </div>
            </div>
            </div>
        ))}
        </div>
    </Card>
  );
}

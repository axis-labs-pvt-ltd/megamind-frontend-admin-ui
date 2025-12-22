'use client';

import { TestFormActions } from './components/TestFormActions';
import { TestFormContent } from './components/TestFormContent';
import { useTestForm } from './hooks/useTestForm';

export default function CreateTestPage() {
  const { form, isLoading, onSubmit } = useTestForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create New Test</h2>
        <p className="text-[var(--text-secondary)]">Build a comprehensive test for your students</p>
      </div>

      <TestFormContent 
        register={form.register}
        control={form.control}
        setValue={form.setValue}
        watch={form.watch}
        errors={form.formState.errors}
      />

      <TestFormActions isLoading={isLoading} />
    </form>
  );
}

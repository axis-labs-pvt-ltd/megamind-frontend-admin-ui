'use client';

import { TestFormActions } from './components/TestFormActions';
import { TestFormContent } from './components/TestFormContent';
import { useTestForm } from './hooks/useTestForm';

export default function CreateTestPage() {
  const { form, isLoading, error, onSubmit } = useTestForm();

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit,
        (validationErrors) => console.log('=== VALIDATION ERRORS ===', validationErrors)
      )}
      className="max-w-4xl mx-auto space-y-6 animate-slide-up"
    >
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create New Test</h2>
        <p className="text-[var(--text-secondary)]">Build a comprehensive test for your students</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

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
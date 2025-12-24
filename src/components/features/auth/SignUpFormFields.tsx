// Client Component - SignUp Form Fields
'use client';

import { RoleSelector } from '@/components/features/auth/RoleSelector';
import { Input } from '@/components/ui/input';
import { SignUpValues } from '@/lib/validations/auth';
import { Key, Mail } from 'lucide-react';
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form';

interface SignUpFormFieldsProps {
  control: Control<SignUpValues>;
  errors: FieldErrors<SignUpValues>;
  watch: UseFormWatch<SignUpValues>;
}

export function SignUpFormFields({ control, errors, watch }: SignUpFormFieldsProps) {
  const selectedRole = watch('role');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)] block text-center mb-2">I am a...</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RoleSelector 
              selectedRole={field.value} 
              onSelect={field.onChange} 
            />
          )}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Full Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="John Doe"
              error={errors.name?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              placeholder="john@example.com"
              icon={Mail}
              error={errors.email?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              placeholder="Create a strong password"
              error={errors.password?.message}
            />
          )}
        />
        <p className="text-xs text-[var(--text-muted)]">
          Must be at least 8 characters with 1 uppercase, 1 number, and 1 special char.
        </p>
      </div>

      {selectedRole === 'instructor' && (
        <div className="flex flex-col space-y-3 animate-fade-in">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Instructor Access Code</label>
          <Controller
            name="accessCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your institution code"
                icon={Key}
                error={errors.accessCode?.message}
              />
            )}
          />
          <p className="text-xs text-[var(--accent-blue)]">
            Required for instructor verification.
          </p>
        </div>
      )}
    </div>
  );
}

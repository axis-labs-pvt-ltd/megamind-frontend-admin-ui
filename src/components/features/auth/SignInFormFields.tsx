// Client Component - Sign In Form Fields
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SignInValues } from '@/lib/validations/auth';
import { KeyIcon, Mail } from 'lucide-react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface SignInFormFieldsProps {
  control: Control<SignInValues>;
  errors: FieldErrors<SignInValues>;
}

export function SignInFormFields({ control, errors }: SignInFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              placeholder="instructor@megamind.com"
              icon={Mail}
              error={errors.email?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
          <a href="#" className="text-sm font-medium text-[var(--accent-blue)] hover:text-blue-600 transition-colors">
            Forgot password?
          </a>
        </div>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              placeholder="••••••••"
              icon={KeyIcon}
              error={errors.password?.message}
            />
          )}
        />
      </div>

      <Controller
        name="remember"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Checkbox
            checked={value}
            onChange={(checked) => onChange(checked)}
            label="Remember me"
          />
        )}
      />
    </div>
  );
}

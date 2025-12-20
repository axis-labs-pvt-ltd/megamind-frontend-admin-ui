// Client Component - Profile Form Fields
'use client';

import { Input } from '@/components/ui/input';
import { ProfileValues } from '@/lib/validations/user';
import { Mail, User } from 'lucide-react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface ProfileFormFieldsProps {
  control: Control<ProfileValues>;
  errors: FieldErrors<ProfileValues>;
}

export function ProfileFormFields({ control, errors }: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">First Name</label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="John"
                icon={User}
                error={errors.firstName?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Last Name</label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Doe"
                error={errors.lastName?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
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

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Bio</label>
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-[var(--text-muted)] min-h-[120px]"
              placeholder="Tell us about yourself..."
            />
          )}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-[var(--accent-red)]">{errors.bio.message}</p>
        )}
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { profileSchema, ProfileValues } from '@/lib/validations/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Save, User } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ProfileFormProps {
  initialData: ProfileValues;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileValues) => {
    setIsLoading(true);
    try {
      // await userService.updateProfile(data); // Simulate API call
      console.log('Updating Profile:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      reset(data); // Reset dirty state with new data
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
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
        <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={!isDirty || isLoading}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty || isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

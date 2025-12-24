'use client';

import { ProfileFormFields } from '@/components/features/settings/ProfileFormFields';
import { Button } from '@/components/ui/button';
import { profileSchema, ProfileValues } from '@/lib/validations/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
      <ProfileFormFields control={control} errors={errors} />

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

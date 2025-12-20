'use client';

import { RoleSelector } from '@/components/features/auth/RoleSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SignUpValues, signUpSchema } from '@/lib/validations/auth';
import { authService } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Key, Loader2, Mail, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'student',
      name: '',
      email: '',
      password: '',
      accessCode: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-xl border-t-4 border-t-[var(--accent-blue)] animate-slide-up">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Create Account
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Join MegaMind today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="space-y-2">
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

        <div className="space-y-2">
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
          <div className="space-y-2 animate-fade-in">
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

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}

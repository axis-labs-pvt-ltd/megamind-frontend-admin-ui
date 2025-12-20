'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SignInValues, signInSchema } from '@/lib/validations/auth';
import { authService } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, KeyIcon, Loader2, LogIn, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const rememberMe = watch('remember');

  const onSubmit = async (data: SignInValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-xl border-t-4 border-t-[var(--accent-blue)] animate-slide-up">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Welcome Back
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Sign in to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}

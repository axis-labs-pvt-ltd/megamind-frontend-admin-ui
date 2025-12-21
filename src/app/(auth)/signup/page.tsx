'use client';

import { SignUpForm } from '@/components/features/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mb-4">
          <span className="text-2xl font-bold text-white">M</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">MegaMind</h2>
        <p className="text-[var(--text-secondary)]">The ultimate platform for modern education</p>
      </div>

      <SignUpForm />

      <p className="text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link href="/signin" className="font-semibold text-[var(--accent-blue)] hover:text-blue-600 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}

// app/auth/signup/page.tsx
import { SignUpForm } from '@/components/features/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            MegaMind
          </h1>
          <p className="text-gray-500 mt-1">Smart Learning Platform</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
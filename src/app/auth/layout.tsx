'use client';

import { AuthProvider } from '@/contexts/authcontext';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { useEffect, useState } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
   
      <div
        className={cn(
          'min-h-screen flex items-center justify-center p-4 transition-colors duration-300',
          theme === 'neumorphic'
            ? 'bg-[#e0e5ec]'
            : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800'
        )}
        data-theme={theme}
      >
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    
  );
}
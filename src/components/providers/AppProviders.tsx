'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

import { AdminShell } from '@/components/layout/AdminShell';
import { AppProviders } from '@/components/providers/AppProviders';
import { AuthProvider } from '@/contexts/authcontext';
import type { Metadata } from 'next';
import { Mulish, Nunito } from 'next/font/google';
import './globals.css';
import './landing-palette.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'MegaMind Admin',
  description: 'Learning Management System Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${mulish.variable}`} style={{ fontFamily: 'var(--font-body, Mulish, system-ui, sans-serif)' }}>
        <AuthProvider>
          <AppProviders>
            <AdminShell>
              {children}
            </AdminShell>
          </AppProviders>
        </AuthProvider>
      </body>
    </html>
  );
}

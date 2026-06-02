import { AdminShell } from '@/components/layout/AdminShell';
import { AppProviders } from '@/components/providers/AppProviders';
import { AuthProvider } from '@/contexts/authcontext';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import './landing-palette.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

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
    <html lang="en" data-palette="forest">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
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
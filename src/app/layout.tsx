import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AppProviders } from '@/components/providers/AppProviders';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <AppProviders>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex">
           <Sidebar />
           <div className="flex-1 flex flex-col min-w-0">
             <Header />
             <main className="flex-1 p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
               <div className="max-w-[1600px] mx-auto w-full">
                  {children}
               </div>
             </main>
           </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}

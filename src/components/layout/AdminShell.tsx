// Client Component - Conditionally renders admin chrome based on route
'use client';

import { usePathname } from 'next/navigation';
import { AdminGuard } from './AdminGuard';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const PUBLIC_PATHS = ['/', '/auth', '/tests/take-test', '/marketplace', '/my-tests', '/student', '/flashcards'];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some(p =>
    pathname === p || (p !== '/' && pathname.startsWith(p))
  );

  if (isPublic) return <>{children}</>;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[var(--bg-primary)] flex">
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
    </AdminGuard>
  );
}

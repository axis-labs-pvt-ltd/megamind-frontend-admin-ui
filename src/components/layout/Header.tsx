'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ProfileDropdown } from './ProfileDropdown';

export function Header() {
  const pathname = usePathname();
  const currentPage = pathname === '/' ? 'dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ') || 'dashboard';

  const pageDescriptions: Record<string, string> = {
    dashboard:  "Welcome back! Here's your learning overview",
    tests:      'Discover and take available tests',
    subjects:   'Organize your curriculum with subjects and modules',
    questions:  'Build and manage your question collection',
    create:     'Build engaging tests for students',
    analytics:  'Track your performance and progress',
    settings:   'Manage your account preferences',
  };

  const description = pageDescriptions[currentPage] || '';

  return (
    <header className="bg-[var(--bg-header)] backdrop-blur-xl border-b border-[var(--border-primary)] sticky top-0 z-40 flex-shrink-0"
      style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center justify-between h-16 pl-16 pr-6 lg:pl-6 lg:pr-8">
        <div className="flex items-center gap-4 animate-slide-right">
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] capitalize"
              style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, letterSpacing: '-0.01em' }}>
              {currentPage}
            </h1>
            {description && (
              <p className="hidden sm:block text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Input type="search" placeholder="Search..." icon={Search} className="w-56" />
          </div>
          <Button variant="ghost" size="sm" style={{ padding: 8 }}
            className="relative hover:bg-[var(--bg-hover)] rounded-xl transition-colors">
            <Bell className="h-4 w-4 text-[var(--icon-primary)]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent-orange)] rounded-full" />
          </Button>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

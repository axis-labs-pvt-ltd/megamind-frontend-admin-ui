'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ProfileDropdown } from './ProfileDropdown';

export function Header() {
  const pathname = usePathname();
  // Simple extraction of the current page name from the path
  const currentPage = pathname === '/' ? 'dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ') || 'dashboard';

  return (
    <header className="bg-[var(--bg-header)] backdrop-blur-xl shadow-sm border-b-2 border-[var(--border-primary)] sticky top-0 z-40 flex-shrink-0 transition-shadow duration-300 hover:shadow-md">
      <div className="flex items-center justify-between h-20 pl-16 pr-6 lg:pl-8 lg:pr-8">
        <div className="flex items-center space-x-6">
          <div className="animate-slide-right">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] capitalize">
              {currentPage}
            </h1>
            <p className="hidden sm:block text-sm text-[var(--text-secondary)] mt-0.5">
              {currentPage === 'dashboard' && 'Welcome back! Here\'s your learning overview'}
              {currentPage === 'tests' && 'Discover and take available tests'}
              {currentPage === 'subjects' && 'Organize your curriculum with subjects and modules'}
              {currentPage === 'questions' && 'Build and manage your question collection'}
              {currentPage === 'create' && 'Build engaging tests for students'}
              {currentPage === 'analytics' && 'Track your performance and progress'}
              {currentPage === 'settings' && 'Manage your account preferences'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block transition-all duration-300 focus-within:scale-105">
            <Input
              type="search"
              placeholder="Search tests, questions..."
              icon={Search}
              className="w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
               style={{ padding: 8 }}
              className="relative hover:bg-[var(--bg-hover)] transition-transform hover:scale-110 active:scale-95"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent-red)] rounded-full animate-bounce"></span>
            </Button>
            
            {/* User Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}

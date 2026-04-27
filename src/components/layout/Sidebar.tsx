'use client';

import { useAuth } from '@/contexts/authcontext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GraduationCap, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { navigation, NavRole } from './sidebar/config';
import { SidebarNavItem } from './sidebar/SidebarNavItem';

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();

  const role = (profile?.role ?? 'teacher') as NavRole;
  const visibleNav = navigation.filter(item => item.roles.includes(role));

  const handleNavigation = (page: string) => {
    router.push(page);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {!isSidebarOpen && (
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 z-50 lg:hidden bg-[var(--bg-card)] shadow-lg border-[var(--border-primary)] p-2 h-auto"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5 text-[var(--text-primary)]" />
        </Button>
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 bg-[var(--bg-sidebar)] backdrop-blur-xl shadow-2xl border-r border-[var(--border-primary)]",
        "transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "flex flex-col group/sidebar",
        "lg:sticky lg:top-0 lg:h-screen lg:shadow-none lg:border-r-2",
        isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-72"
      )}>

        {/* Header */}
        <div className={cn(
          "flex items-center h-20 border-b border-[var(--border-primary)] flex-shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300",
          "px-6 lg:px-0 lg:justify-center lg:group-hover/sidebar:px-6 lg:group-hover/sidebar:justify-start"
        )}>
          <div className="flex items-center space-x-3 min-w-max">
            <div className="relative transform transition-transform duration-300 group-hover/brand:scale-110">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className={cn(
              "transition-all duration-300 -translate-x-5 lg:w-0",
              isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 lg:group-hover/sidebar:w-auto"
            )}>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">Megamind</span>
              <p className="text-xs text-[var(--text-secondary)] font-medium tracking-wide block capitalize">{role} panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            style={{ padding: 8 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden ml-auto hover:bg-[var(--bg-hover)]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="space-y-2">
            {visibleNav.map((item) => (
              <SidebarNavItem
                key={item.name}
                item={item}
                isActive={pathname === item.page}
                isSidebarOpen={isSidebarOpen}
                onClick={handleNavigation}
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}

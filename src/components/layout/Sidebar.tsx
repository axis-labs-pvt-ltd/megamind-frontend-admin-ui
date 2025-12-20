'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Menu,
  PlusCircle,
  Settings,
  X
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', page: '/dashboard', icon: Home, description: 'Overview & stats' },
    { name: 'Available Tests', page: '/tests', icon: FileText, description: 'Browse tests' },
    { name: 'Subject Management', page: '/subjects', icon: BookOpen, description: 'Organize curriculum' },
    { name: 'Question Bank', page: '/questions', icon: HelpCircle, description: 'Manage questions' },
    { name: 'Create Test', page: '/tests/create', icon: PlusCircle, description: 'Build new tests' },
    { name: 'Analytics', page: '/analytics', icon: BarChart3, description: 'Performance insights' },
    { name: 'Settings', page: '/settings', icon: Settings, description: 'Account settings' },
  ];

  const handleNavigation = (page: string) => {
    router.push(page);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Trigger */}
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

      {/* Sidebar */}
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
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className={cn(
              "transition-all duration-300 -translate-x-5 lg:w-0",
              isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 lg:group-hover/sidebar:w-auto"
            )}>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">Megamind</span>
              <p className="text-xs text-[var(--text-secondary)] font-medium tracking-wide block">Learning Hub</p>
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
            {navigation.map((item) => {
              const isActive = pathname === item.page;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.page)}
                  className={cn(
                    "group w-full flex items-center rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden whitespace-nowrap",
                    "py-3.5 px-3 lg:px-0 lg:justify-center lg:group-hover/sidebar:px-3 lg:group-hover/sidebar:justify-start",
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                  )}
                  data-nav-item="true"
                  data-active={isActive}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300 flex-shrink-0",
                    isActive
                      ? 'bg-[var(--text-primary)]/10'
                      : 'bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-blue-light)] group-hover:text-[var(--accent-blue)]'
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)]'
                    )} />
                  </div>
                  <div className="overflow-hidden text-left ml-4 lg:ml-0 lg:group-hover/sidebar:ml-4 transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 -translate-x-5 group-hover/sidebar:translate-x-0 lg:w-0 lg:group-hover/sidebar:w-auto">
                    <div className="font-semibold truncate">
                      {item.name}
                    </div>
                    <div className={cn(
                      "text-xs truncate",
                      isActive ? 'text-blue-100' : 'text-[var(--text-muted)]'
                    )}>
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Tooltip for collapsed state */}
                  <div className="hidden lg:block lg:group-hover/sidebar:hidden absolute left-14 bg-[var(--bg-card)] text-[var(--text-primary)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

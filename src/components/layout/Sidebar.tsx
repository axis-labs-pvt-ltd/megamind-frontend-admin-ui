'use client';

import { useAuth } from '@/contexts/authcontext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {!isSidebarOpen && (
        <Button variant="outline" size="sm"
          className="fixed top-4 left-4 z-50 lg:hidden bg-[var(--bg-card)] shadow-[var(--shadow-md)] border-[var(--border-primary)] p-2 h-auto rounded-xl"
          onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-5 w-5 text-[var(--text-primary)]" />
        </Button>
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)]",
        "shadow-[var(--shadow-md)] transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "flex flex-col group/sidebar",
        "lg:sticky lg:top-0 lg:h-screen lg:shadow-none",
        isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-72"
      )}>

        {/* Logo header */}
        <div className={cn(
          "flex items-center h-16 border-b border-[var(--border-primary)] flex-shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300",
          "px-4 lg:px-0 lg:justify-center lg:group-hover/sidebar:px-4 lg:group-hover/sidebar:justify-start"
        )}>
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-orange)', boxShadow: 'var(--shadow-orange)' }}>
              <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 18, color: '#fff', lineHeight: 1 }}>M</span>
            </div>
            <div className={cn(
              "transition-all duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
            )}>
              <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'block' }}>megamind</span>
              <p className="text-xs text-[var(--text-muted)] font-semibold capitalize mt-0.5">{role} panel</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" style={{ padding: 8 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden ml-auto hover:bg-[var(--bg-hover)] rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="space-y-1">
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

        {/* Bottom divider + role chip */}
        <div className={cn(
          "p-3 border-t border-[var(--border-primary)] overflow-hidden whitespace-nowrap",
          isSidebarOpen ? "" : "lg:flex lg:justify-center"
        )}>
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            isSidebarOpen ? "" : "lg:opacity-0 lg:group-hover/sidebar:opacity-100"
          )}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-orange-light)' }}>
              <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 12, color: 'var(--accent-orange)' }}>
                {(profile?.full_name || 'U').slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[var(--text-primary)] truncate">{profile?.full_name || 'User'}</div>
              <div className="text-xs text-[var(--text-muted)] capitalize">{role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

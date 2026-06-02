'use client';

import { useAuth } from '@/contexts/authcontext';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { ChevronLeft, ChevronRight, LogOut, Palette, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeSelector } from './ThemeSelector';

export function ProfileDropdown() {
  const [view, setView] = useState<'main' | 'themes'>('main');
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeStore();
  const { user, profile } = useAuth();
  const themeLabel = theme.charAt(0).toUpperCase() + theme.slice(1);

  const displayName = profile?.full_name ?? user?.email ?? 'Admin';
  const roleLabel   = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Staff';
  const avatarUrl   = profile?.avatar_url ?? null;
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <ProfileTrigger
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        displayName={displayName}
        roleLabel={roleLabel}
        avatarUrl={avatarUrl}
        initials={initials}
      />

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}

      <div className={cn(
        "absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] backdrop-blur-sm rounded-xl shadow-lg border border-[var(--border-primary)] transition-all duration-200 z-50 transform origin-top-right max-h-[calc(100vh-100px)]",
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2 pointer-events-none"
      )}>
        <DropdownHeader displayName={displayName} roleLabel={roleLabel} avatarUrl={avatarUrl} initials={initials} />

        <div className="transition-all duration-300">
          {view === 'main' ? (
            <MainMenu
              themeLabel={themeLabel}
              onNavigateToThemes={() => setView('themes')}
              onClose={() => setIsOpen(false)}
            />
          ) : (
            <ThemesMenu onBack={() => setView('main')} />
          )}
        </div>
      </div>
    </div>
  );
}

function AvatarBadge({ avatarUrl, initials, size = 32 }: { avatarUrl: string | null; initials: string; size?: number }) {
  const s = `${size}px`;
  const base = `rounded-lg object-cover ring-2 ring-white shadow-sm`;
  if (avatarUrl) {
    return <img src={avatarUrl} alt="avatar" className={base} style={{ width: s, height: s }} />;
  }
  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-white shadow-sm" style={{ width: s, height: s }}>
      <span className="text-white font-bold" style={{ fontSize: size * 0.38 }}>{initials}</span>
    </div>
  );
}

function ProfileTrigger({ isOpen, onClick, displayName, roleLabel, avatarUrl, initials }: {
  isOpen: boolean; onClick: () => void;
  displayName: string; roleLabel: string;
  avatarUrl: string | null; initials: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all duration-200 hover:scale-105"
    >
      <div className="relative">
        <AvatarBadge avatarUrl={avatarUrl} initials={initials} size={32} />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--accent-green)] rounded-full border-2 border-white" />
      </div>
      <div className="hidden md:block text-left">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[120px]">{displayName}</p>
        <p className="text-xs text-[var(--text-secondary)]">{roleLabel}</p>
      </div>
    </button>
  );
}

function DropdownHeader({ displayName, roleLabel, avatarUrl, initials }: {
  displayName: string; roleLabel: string;
  avatarUrl: string | null; initials: string;
}) {
  return (
    <div className="p-4 border-b border-[var(--border-primary)]">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <AvatarBadge avatarUrl={avatarUrl} initials={initials} size={48} />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--accent-green)] rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{displayName}</p>
          <p className="text-xs text-[var(--text-secondary)]">{roleLabel}</p>
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse" />
            <span className="text-xs text-[var(--accent-green)] font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainMenu({ themeLabel, onNavigateToThemes, onClose }: {
  themeLabel: string;
  onNavigateToThemes: () => void;
  onClose: () => void;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    onClose();
    await logout();
    router.push('/auth/signin');
  };

  const btnBase = "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-[var(--bg-hover)] group/item";

  return (
    <div className="animate-slide-right">
      <div className="p-2 space-y-0.5">
        <button
          onClick={() => { router.push('/admin/settings'); onClose(); }}
          className={btnBase}
        >
          <User className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
          <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">View Profile</span>
        </button>

        <button
          onClick={() => { router.push('/admin/settings'); onClose(); }}
          className={btnBase}
        >
          <Settings className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
          <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">Settings</span>
        </button>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onNavigateToThemes(); }}
          className={cn(btnBase, "justify-between")}
        >
          <div className="flex items-center space-x-3">
            <Palette className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
            <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">Theme</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[var(--text-muted)] group-hover/item:text-[var(--accent-blue)]">{themeLabel}</span>
            <ChevronRight className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)]" />
          </div>
        </button>
      </div>

      <div className="p-2 border-t border-[var(--border-primary)]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-[var(--accent-red)] hover:bg-[var(--accent-red-light)] group/logout"
        >
          <LogOut className="h-4 w-4 group-hover/logout:scale-110 transition-transform" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function ThemesMenu({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-slide-right">
      <div className="flex items-center space-x-2 px-3 py-2 border-b border-[var(--border-primary)]">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBack(); }}
          className="p-1 hover:bg-[var(--bg-hover)] rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-[var(--text-secondary)]" />
        </button>
        <span className="text-sm font-semibold text-[var(--text-primary)]">Select Theme</span>
      </div>
      <ThemeSelector />
    </div>
  );
}

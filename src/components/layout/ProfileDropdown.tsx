'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { ChevronLeft, ChevronRight, LogOut, Palette, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { NeumorphicWrapper } from '../ui/neumorphic-wrapper';
import { ThemeSelector } from './ThemeSelector';

export function ProfileDropdown() {
  const [view, setView] = useState<'main' | 'themes'>('main');
  const { theme } = useThemeStore();
  const themeLabel = theme === 'neumorphic' ? 'Neumorphic' : theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <div className="relative group">
      <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all duration-200 hover:scale-105">
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
            alt="Profile"
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-white shadow-sm"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--accent-green)] rounded-full border-2 border-white"></div>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-[var(--text-primary)]">John Doe</p>
          <p className="text-xs text-[var(--text-secondary)]">Premium Student</p>
        </div>
      </button>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] backdrop-blur-sm rounded-xl shadow-lg border border-[var(--border-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right group-hover:translate-y-0 translate-y-2 max-h-[calc(100vh-100px)]">
        
        {/* User Info Header - Always visible */}
        <div className="p-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
                alt="Profile"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--accent-green)] rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">John Doe</p>
              <p className="text-xs text-[var(--text-secondary)]">Premium Student</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse"></div>
                <span className="text-xs text-[var(--accent-green)] font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="transition-all duration-300">
          {view === 'main' ? (
            <div className="animate-slide-right">
              <div className="p-2">
                <NeumorphicWrapper
                  as="button"
                  active={false}
                  variant="secondary"
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left mb-2 group/item"
                >
                  <User className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
                  <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">View Profile</span>
                </NeumorphicWrapper>

                <NeumorphicWrapper
                  as="button"
                  active={false}
                  variant="secondary"
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left mb-2 group/item"
                >
                  <Settings className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
                  <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">Settings</span>
                </NeumorphicWrapper>
                
                {/* Theme Switcher Entry */}
                <NeumorphicWrapper 
                  as="button"
                  active={false}
                  variant="secondary"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setView('themes');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left group/item"
                >
                  <div className="flex items-center space-x-3">
                    <Palette className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
                    <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">Theme</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[var(--text-muted)] group-hover/item:text-[var(--accent-blue)]">{themeLabel}</span>
                    <ChevronRight className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)]" />
                  </div>
                </NeumorphicWrapper>
              </div>
              
              <div className="p-2 border-t border-[var(--border-primary)]">
                <NeumorphicWrapper 
                  as="button"
                  active={false}
                  variant="secondary"
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-[var(--accent-red)] hover:bg-[var(--accent-red-light)] group/logout"
                >
                  <LogOut className="h-4 w-4 group-hover/logout:scale-110 transition-transform" />
                  <span className="text-sm">Sign Out</span>
                </NeumorphicWrapper>
              </div>
            </div>
          ) : (
            <div className="animate-slide-right">
              <div className="flex items-center space-x-2 px-3 py-2 border-b border-[var(--border-primary)]">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setView('main');
                  }}
                  className="p-1 hover:bg-[var(--bg-hover)] rounded-md transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-[var(--text-secondary)]" />
                </button>
                <span className="text-sm font-semibold text-[var(--text-primary)]">Select Theme</span>
              </div>
              <ThemeSelector />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

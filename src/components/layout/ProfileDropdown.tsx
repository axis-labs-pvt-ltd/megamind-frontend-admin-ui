'use client';

import { LogOut, Settings, User } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

export function ProfileDropdown() {
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
      <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] backdrop-blur-sm rounded-xl shadow-lg border border-[var(--border-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right group-hover:translate-y-0 translate-y-2">
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
        
        <div className="p-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-[var(--bg-hover)] rounded-lg transition-colors group/item">
            <User className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
            <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">View Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-[var(--bg-hover)] rounded-lg transition-colors group/item">
            <Settings className="h-4 w-4 text-[var(--text-secondary)] group-hover/item:text-[var(--accent-blue)] transition-colors" />
            <span className="text-sm text-[var(--text-primary)] group-hover/item:text-[var(--accent-blue)] transition-colors">Settings</span>
          </button>
        </div>
        
        {/* Theme Selector */}
        <div className="border-t border-[var(--border-primary)]">
          <ThemeSelector />
        </div>
        
        <div className="p-2 border-t border-[var(--border-primary)]">
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-[var(--accent-red-light)] rounded-lg transition-colors text-[var(--accent-red)] group/logout"
          >
            <LogOut className="h-4 w-4 group-hover/logout:scale-110 transition-transform" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

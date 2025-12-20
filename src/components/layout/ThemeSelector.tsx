'use client';

import { ThemeType, useThemeStore } from '@/store/useThemeStore';
import { Check, Palette } from 'lucide-react';

const themes: { value: ThemeType; label: string; colors: string[] }[] = [
  { value: 'light', label: 'Light', colors: ['#ffffff', '#f3f4f6', '#3b82f6'] },
  { value: 'dark', label: 'Dark', colors: ['#0f172a', '#1e293b', '#60a5fa'] },
];

export function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="px-2 py-1">
      <div className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[var(--text-muted)]">
        <Palette className="h-3.5 w-3.5" />
        <span>Theme</span>
      </div>
      <div className="space-y-1">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--bg-hover)] rounded-lg transition-colors group/theme"
          >
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {themeOption.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full border border-[var(--border-secondary)]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--text-primary)] group-hover/theme:text-[var(--accent-blue)] transition-colors">
                {themeOption.label}
              </span>
            </div>
            {theme === themeOption.value && (
              <Check className="h-4 w-4 text-[var(--accent-blue)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

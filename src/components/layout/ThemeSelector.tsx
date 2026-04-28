'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { Check } from 'lucide-react';

const themes = [
  { id: 'light' as const, label: 'Light',  color: '#ffffff', border: '#e2e8f0' },
  { id: 'dark'  as const, label: 'Dark',   color: '#0f172a', border: '#334155' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="px-2 py-1">
      <div className="p-2 space-y-1">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-md border flex-shrink-0"
                style={{ backgroundColor: t.color, borderColor: t.border }}
              />
              <span className="font-medium">{t.label}</span>
            </div>
            {theme === t.id && <Check className="h-4 w-4 text-[var(--accent-blue)]" />}
          </button>
        ))}
      </div>
    </div>
  );
}

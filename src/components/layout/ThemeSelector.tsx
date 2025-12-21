'use client';

import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { Check } from 'lucide-react';
import { NeumorphicWrapper } from '../ui/neumorphic-wrapper';

const themes = [
    { id: 'light', label: 'Light', color: '#ffffff', border: '#e2e8f0' },
    { id: 'dark', label: 'Dark', color: '#0f172a', border: '#1e293b' },
    { id: 'neumorphic', label: 'Neumorphic', color: '#e0e5ec', border: '#a3b1c6' }
  ] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="px-2 py-1">
      <div className="p-2">
        <div className="grid grid-cols-1 gap-2">
          {themes.map((t) => (
            <NeumorphicWrapper
              as="button"
              key={t.id}
              onClick={() => setTheme(t.id)}
              active={theme === t.id}
              variant="secondary" // Inactive = Inset (Pressed)
              className={cn(
                "w-full flex items-center justify-between p-3"
              )}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full border transition-shadow",
                    theme === 'neumorphic' ? "shadow-md" : "shadow-sm"
                  )}
                  style={{ 
                    backgroundColor: t.color,
                    borderColor: t.border
                  }}
                />
                <span className="font-medium">
                  {t.label}
                </span>
              </div>
              {theme === t.id && (
                <Check className="h-4 w-4 text-[var(--accent-blue)]" />
              )}
            </NeumorphicWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}

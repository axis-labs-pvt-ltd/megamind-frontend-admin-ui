'use client';

import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { Check } from 'lucide-react';

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
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                // Neumorphic Specific Logic
                theme === 'neumorphic' 
                  ? (theme === t.id 
                      ? "bg-[var(--bg-primary)] shadow-[var(--shadow-surface)] scale-[1.02] text-[var(--accent-blue)]" // Selected: Popped & Scaled
                      : "bg-[var(--bg-primary)] shadow-[var(--shadow-inset)] hover:shadow-[var(--shadow-surface)] hover:scale-[1.01] text-[var(--text-primary)]" // Unselected: Inset -> Popped on Hover
                    )
                  : (theme === t.id 
                      ? "bg-[var(--bg-secondary)] border-2 border-[var(--accent-blue)]" 
                      : "hover:bg-[var(--bg-hover)] border border-transparent"
                    )
              )}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full border transition-shadow",
                    // Add subtle shadow to color circles in neumorphic mode
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

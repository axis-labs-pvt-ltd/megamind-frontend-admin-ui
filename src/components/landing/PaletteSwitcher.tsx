'use client';

import { useEffect, useState } from 'react';

type Palette = 'coral' | 'indigo' | 'forest';

const PALETTES: { id: Palette; label: string; primary: string; bg: string }[] = [
  { id: 'coral',  label: 'Coral',  primary: '#E8541C', bg: '#FFFBF2' },
  { id: 'indigo', label: 'Indigo', primary: '#6D28D9', bg: '#F5F3FF' },
  { id: 'forest', label: 'Forest', primary: '#2D6A4F', bg: '#F5F7F4' },
];

export function PaletteSwitcher() {
  const [active, setActive] = useState<Palette>('forest');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', active);
  }, [active]);

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      {open && (
        <div style={{ background: 'var(--p-bg)', border: '2px solid var(--p-ink)', borderRadius: 18, padding: '14px 16px', boxShadow: '6px 6px 0 var(--p-ink)', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160 }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 2 }}>Palette</div>
          {PALETTES.map(p => (
            <button key={p.id} onClick={() => { setActive(p.id); setOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              border: `2px solid ${active === p.id ? 'var(--p-ink)' : 'transparent'}`,
              borderRadius: 10, background: active === p.id ? 'var(--p-bg-alt)' : 'transparent',
              cursor: 'pointer', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600,
              fontSize: 13, color: 'var(--p-ink)', width: '100%', textAlign: 'left',
            }}>
              <span style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <span style={{ width: 14, height: 14, borderRadius: 999, background: p.primary, border: '1.5px solid var(--p-ink)', display: 'inline-block' }} />
                <span style={{ width: 14, height: 14, borderRadius: 999, background: p.bg, border: '1.5px solid var(--p-ink)', display: 'inline-block' }} />
              </span>
              {p.label}
              {active === p.id && <span style={{ marginLeft: 'auto', color: 'var(--p-primary)', fontSize: 16, lineHeight: 1 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{
        width: 48, height: 48, borderRadius: 999, border: '2px solid var(--p-ink)',
        background: 'var(--p-primary)', color: 'var(--p-primary-ink)',
        cursor: 'pointer', display: 'grid', placeItems: 'center',
        boxShadow: '4px 4px 0 var(--p-ink)', fontSize: 20,
        transition: 'transform .15s',
      }} title="Switch palette">
        🎨
      </button>
    </div>
  );
}

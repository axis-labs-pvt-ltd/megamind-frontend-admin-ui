// Client Component - How it works section
'use client';

import { useT } from '@/contexts/LanguageContext';

const STEP_META = [
  { color: 'var(--p-peach)',  ink: 'var(--p-ink-peach)',  icon: '📚' },
  { color: 'var(--p-blue)',   ink: 'var(--p-ink-blue)',   icon: '✨', featured: true },
  { color: 'var(--p-mint)',   ink: 'var(--p-ink-mint)',   icon: '💡' },
  { color: 'var(--p-yellow)', ink: 'var(--p-ink-yellow)', icon: '📈' },
];

export function HowSection() {
  const t = useT();

  return (
    <section id="how" style={{ padding: '84px 0', background: 'var(--p-bg-alt)', position: 'relative' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 28, marginBottom: 56 }} className="how-head">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              {t.how.eyebrow}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 780, color: 'var(--p-ink)' }}>
              {t.how.heading}
            </h2>
          </div>
          <div style={{ maxWidth: 300, color: 'var(--p-ink-2)', fontSize: 15, lineHeight: 1.6 }}>
            {t.how.body}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="how-grid">
          {t.how.steps.map((s, i) => {
            const m = STEP_META[i];
            return (
              <div key={i} className="how-card" style={{
                padding: 24, borderRadius: 'var(--p-radius)',
                background: m.featured ? 'var(--p-primary)' : 'var(--p-bg)',
                border: `1px solid ${m.featured ? 'transparent' : 'var(--p-line)'}`,
                boxShadow: m.featured ? 'var(--p-shadow-orange)' : 'var(--p-shadow)',
                minHeight: 230, position: 'relative',
              }}>
                {m.featured && (
                  <span style={{ position: 'absolute', top: -13, left: 18, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'var(--p-ink)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    the AI bit
                  </span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                  <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 15, color: m.featured ? 'rgba(255,255,255,0.7)' : 'var(--p-muted)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: m.featured ? 'rgba(255,255,255,0.2)' : m.color, display: 'grid', placeItems: 'center', fontSize: 25 }}>{m.icon}</div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 21, fontWeight: 800, marginBottom: 8, color: m.featured ? '#fff' : 'var(--p-ink)' }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: m.featured ? 'rgba(255,255,255,0.92)' : 'var(--p-ink-2)' }}>{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .how-card { transition: transform .15s, box-shadow .15s; }
        .how-card:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-lg) !important; }
        @media (max-width: 960px) { .how-grid { grid-template-columns: repeat(2, 1fr) !important; } .how-head { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .how-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

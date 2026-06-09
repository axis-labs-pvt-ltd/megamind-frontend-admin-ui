// Client Component - Pricing plans section
'use client';

import { useT } from '@/contexts/LanguageContext';

const PRICES = ['0', '1,490', '2,990'];
const HIGHLIGHTS = [false, true, false];

export function PricingSection() {
  const t = useT();

  return (
    <section id="pricing" style={{ padding: '84px 0', background: 'var(--p-bg)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
            <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />{t.pricing.eyebrow}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.1, marginBottom: 16, color: 'var(--p-ink)' }}>
            {t.pricing.heading}
          </h2>
          <p style={{ color: 'var(--p-ink-2)', maxWidth: 560, fontSize: 16, lineHeight: 1.65, margin: '0 auto' }}>
            {t.pricing.body}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }} className="pricing-grid">
          {t.pricing.plans.map((p, i) => {
            const hi = HIGHLIGHTS[i];
            return (
              <div key={i} style={{
                padding: 28, borderRadius: 20,
                background: hi ? 'var(--p-primary)' : '#fff',
                color: hi ? '#fff' : 'var(--p-ink)',
                border: '1px solid', borderColor: hi ? 'transparent' : 'var(--p-line)',
                boxShadow: hi ? 'var(--p-shadow-orange)' : 'var(--p-shadow-sm)',
                transform: hi ? 'translateY(-8px)' : 'none',
                position: 'relative', display: 'flex', flexDirection: 'column',
              }}>
                {p.badge && (
                  <span style={{ position: 'absolute', top: -13, right: 22, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 999, background: 'var(--p-ink)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', boxShadow: 'var(--p-shadow-sm)' }}>★ {p.badge}</span>
                )}
                <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{p.name}</h3>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 42, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>Rs. {PRICES[i]}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16, opacity: 0.75 }}>{p.unit}</div>
                <p style={{ fontSize: 14, marginBottom: 20, lineHeight: 1.6, color: hi ? 'rgba(255,255,255,0.88)' : 'var(--p-ink-2)' }}>{p.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
                  {p.features.map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: hi ? 'rgba(255,255,255,0.92)' : 'var(--p-ink-2)' }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={hi ? '#fff' : 'var(--p-primary)'} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M5 12l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button style={{ padding: '14px 20px', borderRadius: 12, border: 'none', background: hi ? '#fff' : 'var(--p-primary)', color: hi ? 'var(--p-primary)' : '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: hi ? 'var(--p-shadow-sm)' : 'var(--p-shadow-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@media (max-width: 960px) { .pricing-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

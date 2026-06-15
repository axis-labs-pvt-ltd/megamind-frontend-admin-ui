// Client Component - FAQ accordion
'use client';

import { useT } from '@/contexts/LanguageContext';
import { useState } from 'react';

export function FAQSection() {
  const t = useT();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ padding: '84px 0', background: 'var(--p-bg-alt)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64 }} className="faq-grid">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />{t.faq.eyebrow}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3vw,42px)', letterSpacing: '-0.015em', lineHeight: 1.1, color: 'var(--p-ink)', marginBottom: 20 }}>
              {t.faq.heading.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
            </h2>
            <p style={{ color: 'var(--p-ink-2)', fontSize: 15, maxWidth: 340, lineHeight: 1.65, marginBottom: 24 }}>
              {t.faq.body}
            </p>
            <a href="mailto:hello@megamind.lk" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none' }}>
              {t.faq.supportCta}
            </a>
          </div>

          <div>
            {t.faq.items.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--p-line)', borderTop: i === 0 ? '1px solid var(--p-line)' : 'none' }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', padding: '20px 4px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 17, fontWeight: 700, color: 'var(--p-ink)' }}>
                  <span>{f.q}</span>
                  <span style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: open === i ? 'var(--p-primary)' : 'var(--p-bg-alt)', color: open === i ? '#fff' : 'var(--p-ink-2)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0, transition: 'transform .2s, background .2s', transform: open === i ? 'rotate(45deg)' : 'none', boxShadow: 'var(--p-shadow-sm)' }}>+</span>
                </button>
                {open === i && (
                  <div style={{ paddingBottom: 20, fontSize: 15, color: 'var(--p-ink-2)', lineHeight: 1.65, maxWidth: 620 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 860px) { .faq-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

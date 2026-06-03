// Client Component - FAQ accordion
'use client';

import { useState } from 'react';

const FAQS = [
  { q: 'Does Megamind follow the Sri Lankan syllabus?', a: 'Yes. Every module is mapped to the national O/L and A/L syllabus, including Combined Maths, Pure Physics, ICT and the standard English stream.' },
  { q: 'How does the AI actually work?', a: "Every answer you give updates your skill graph. The AI uses that to pick the next question — harder if you're on a roll, or a fresh angle on the same concept if you're stuck." },
  { q: 'Can I buy just one test instead of subscribing?', a: 'Yes — individual tests are Rs. 1,000 to Rs. 2,000 one-time. You keep the test, your answers and the AI feedback forever.' },
  { q: 'What grades are supported?', a: "O/L (Grade 6–11), A/L (Grade 12–13), and university entrance prep. We're adding primary-grade content in 2026." },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard, no phone calls, no awkwardness. Your single-test purchases stay yours forever even after you cancel.' },
];

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ padding: '84px 0', background: 'var(--p-bg-alt)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64 }} className="faq-grid">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />FAQ
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3vw,42px)', letterSpacing: '-0.015em', lineHeight: 1.1, color: 'var(--p-ink)', marginBottom: 20 }}>
              Common<br />questions.
            </h2>
            <p style={{ color: 'var(--p-ink-2)', fontSize: 15, maxWidth: 340, lineHeight: 1.65, marginBottom: 24 }}>
              Can&apos;t find what you&apos;re looking for? Message our team — we reply within an hour on weekdays.
            </p>
            <a href="mailto:hello@megamind.lk" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none' }}>
              Email support →
            </a>
          </div>

          <div>
            {FAQS.map((f, i) => (
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

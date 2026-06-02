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
    <section id="faq" style={{ padding: '110px 0', background: 'var(--p-bg-alt)', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 60 }} className="faq-grid">
          <div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />FAQ
            </span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,46px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 18, color: 'var(--p-ink)' }}>
              Common<br />questions.
            </h2>
            <p style={{ marginTop: 20, color: 'var(--p-ink-2)', fontSize: 15, maxWidth: 340 }}>
              Can&apos;t find what you&apos;re looking for? Message our team — we reply within an hour on weekdays.
            </p>
            <a href="mailto:hello@megamind.lk" style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontWeight: 600, fontFamily: 'var(--font-display,sans-serif)', fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' }}>
              Email support →
            </a>
          </div>

          <div>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: '2px solid var(--p-ink)', borderTop: i === 0 ? '2px solid var(--p-ink)' : 'none' }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', padding: '22px 4px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-display,sans-serif)', fontSize: 18, fontWeight: 600, color: 'var(--p-ink)' }}>
                  <span>{f.q}</span>
                  <span style={{ width: 34, height: 34, borderRadius: 999, border: '2px solid var(--p-ink)', background: open === i ? 'var(--p-primary)' : 'var(--p-bg)', color: open === i ? 'var(--p-primary-ink)' : 'var(--p-ink)', display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 600, flexShrink: 0, transition: 'transform .2s, background .2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {open === i && (
                  <div style={{ paddingBottom: 22, fontSize: 15, color: 'var(--p-ink-2)', lineHeight: 1.6, maxWidth: 620 }}>{f.a}</div>
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

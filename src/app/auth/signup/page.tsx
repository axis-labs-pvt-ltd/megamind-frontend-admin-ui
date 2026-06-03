// Client Component - Sign up page (Vedantu-style split layout)
'use client';

import { SignUpForm } from '@/components/features/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 1fr' }} className="auth-layout">

      {/* Form side */}
      <div style={{ background: '#fff', padding: '46px clamp(28px,5vw,76px)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 23, letterSpacing: '-0.03em', textDecoration: 'none', color: 'var(--p-ink)', marginBottom: 'clamp(34px,6vh,64px)' }}>
          <span style={{ width: 34, height: 34, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 19, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
          megamind
        </Link>

        <div style={{ margin: 'auto 0', maxWidth: 460, width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
            <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
            Free · 14-day trial
          </div>
          <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(28px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.08, margin: '0 0 12px', color: 'var(--p-ink)' }}>
            Make your <span style={{ color: 'var(--p-primary)', position: 'relative', whiteSpace: 'nowrap' }}>megamind.<span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 7, background: 'var(--p-primary)', opacity: 0.2, borderRadius: 5, zIndex: -1 }} /></span>
          </h1>
          <p style={{ color: 'var(--p-ink-2)', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            Tell us a bit about you — we&apos;ll tune your AI tutor before you finish your first quiz.
          </p>
          <SignUpForm />
        </div>
      </div>

      {/* Art side — orange gradient */}
      <div style={{ background: 'linear-gradient(155deg, var(--p-hero-a), var(--p-hero-b) 52%, var(--p-hero-c))', color: '#fff', padding: '54px clamp(34px,4vw,60px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: 999, background: 'rgba(255,255,255,0.1)', top: -90, right: -70, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: 999, background: 'rgba(255,255,255,0.1)', bottom: 40, left: -80, pointerEvents: 'none' }} />

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12.5, alignSelf: 'flex-start', position: 'relative' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff' }} />
          No credit card required
        </span>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(32px,3.5vw,52px)', lineHeight: 1.08, letterSpacing: '-0.015em', marginBottom: 32 }}>
            Learn while<br />you quiz.
          </div>
          <div style={{ display: 'grid', gap: 16, maxWidth: 380 }}>
            {[
              ['AI-personalized quizzes', 'across 5 subjects'],
              ['Theory pop-ups',          'in every question'],
              ['Buy single tests',        'from Rs. 1,000 — no subscription'],
            ].map(([h, b]) => (
              <div key={h} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: 'rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 14 }}>✓</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15 }}>{h}</div>
                  <div style={{ fontSize: 13, opacity: 0.82 }}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', opacity: 0.8, position: 'relative', zIndex: 1 }}>
          MEGAMIND · BUILT IN 🇱🇰 FOR SL STUDENTS
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-layout { grid-template-columns: 1fr !important; }
          .auth-layout > div:last-child { display: none !important; }
        }
        @media (max-width: 600px) {
          .auth-layout > div:first-child { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
}

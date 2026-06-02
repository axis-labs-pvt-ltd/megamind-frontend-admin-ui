// Client Component - Sign up page (2-column forest design, amber art side)
'use client';

import { SignUpForm } from '@/components/features/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-layout">

      {/* ── Left: form side ── */}
      <div style={{ background: 'var(--p-bg)', padding: '40px 8%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em', textDecoration: 'none', color: 'var(--p-ink)', marginBottom: 44 }}>
          <span style={{ width: 34, height: 34, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', transform: 'rotate(-8deg)', fontSize: 18 }}>M</span>
          megamind<span style={{ color: 'var(--p-primary)' }}>.</span>
        </Link>

        <div style={{ maxWidth: 460, width: '100%' }}>
          <span style={eyebrow}>Free · 14-day trial</span>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3vw,44px)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '18px 0 14px', color: 'var(--p-ink)' }}>
            Make your{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              megamind.
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%232D6A4F' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
            </span>
          </h1>
          <p style={{ color: 'var(--p-ink-2)', fontSize: 16, marginBottom: 28 }}>
            Tell us a bit about you — we&apos;ll tune your AI tutor before you finish your first quiz.
          </p>
          <SignUpForm />
        </div>
      </div>

      {/* ── Right: art side (amber) ── */}
      <div style={{ background: 'var(--p-secondary)', color: 'var(--p-ink)', borderLeft: '2px solid var(--p-ink)', padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono, monospace)', fontSize: 12, fontWeight: 600, alignSelf: 'flex-start' }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)', flexShrink: 0 }} />
          No credit card required
        </span>

        <div>
          <div style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 'clamp(36px,4vw,56px)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 30 }}>
            Learn while<br />you{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              quiz.
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%231B2E1F' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
            </span>
          </div>

          <div style={{ display: 'grid', gap: 14, maxWidth: 380 }}>
            {[
              { text: <><b>AI-personalized quizzes</b> across 5 subjects</> },
              { text: <><b>Theory pop-ups</b> in every question</> },
              { text: <><b>Buy single tests</b> from Rs. 1,000 — no subscription</> },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--p-ink)', color: 'var(--p-secondary)', display: 'grid', placeItems: 'center', flexShrink: 0, fontWeight: 700, fontSize: 13 }}>✓</div>
                <div style={{ fontSize: 15, lineHeight: 1.5 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, opacity: 0.7 }}>
          MEGAMIND · BUILT IN 🇱🇰 FOR SL STUDENTS
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-layout { grid-template-columns: 1fr !important; }
          .auth-layout > div:last-child { display: none !important; }
        }
        @media (max-width: 600px) {
          .auth-layout > div:first-child { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 12, fontWeight: 500, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--p-ink-2)',
  display: 'inline-flex', alignItems: 'center', gap: 10,
};

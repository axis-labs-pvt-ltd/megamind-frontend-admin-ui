// Client Component - Sign in page (2-column forest design)
'use client';

import { SignInForm } from '@/components/features/auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-layout">

      {/* ── Left: form side ── */}
      <div style={{ background: 'var(--p-bg)', padding: '40px 8%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em', textDecoration: 'none', color: 'var(--p-ink)', marginBottom: 56 }}>
          <span style={{ width: 34, height: 34, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', transform: 'rotate(-8deg)', fontSize: 18 }}>M</span>
          megamind<span style={{ color: 'var(--p-primary)' }}>.</span>
        </Link>

        <div style={{ maxWidth: 420, width: '100%' }}>
          <span style={eyebrow}>Welcome back</span>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,3.5vw,48px)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '18px 0 14px', color: 'var(--p-ink)' }}>
            Sign in to <br />your{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              megamind.
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%232D6A4F' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
            </span>
          </h1>
          <p style={{ color: 'var(--p-ink-2)', fontSize: 16, marginBottom: 36 }}>
            Pick up where you left off. Your AI tutor remembered everything.
          </p>
          <SignInForm />
        </div>
      </div>

      {/* ── Right: art side (forest green) ── */}
      <div style={{ background: 'var(--p-primary)', color: 'var(--p-primary-ink)', borderLeft: '2px solid var(--p-ink)', padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1.5px solid var(--p-primary-ink)', borderRadius: 999, fontFamily: 'var(--font-mono, monospace)', fontSize: 12, fontWeight: 600, alignSelf: 'flex-start', opacity: 0.9 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-secondary)', flexShrink: 0 }} />
          12,400+ students
        </span>

        <div>
          <div style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: 460 }}>
            "I went from a B to an A in chemistry. The theory pop-ups did it."
          </div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.4)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 600, fontSize: 15 }}>Thisari P.</div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, opacity: 0.8 }}>A/L · Bio stream · Kandy</div>
            </div>
          </div>
        </div>

        {/* Floating mini theory card */}
        <div style={{ alignSelf: 'flex-end', transform: 'rotate(6deg)', marginRight: -10 }}>
          <div style={{ background: 'var(--p-secondary)', border: '2px solid var(--p-ink)', borderRadius: 14, padding: 18, width: 240, color: 'var(--p-ink)', boxShadow: '4px 4px 0 var(--p-ink)' }}>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>📖 mini theory</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              The <b>Network layer</b> handles routing — IP lives here.
            </div>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, opacity: 0.7 }}>
          MEGAMIND · LEARN WHILE YOU QUIZ
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

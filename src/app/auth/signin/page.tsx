// Client Component - Sign in page
'use client';

import { SignInForm } from '@/components/features/auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 1fr' }} className="auth-layout">

      {/* Form side */}
      <div style={{ background: '#fff', padding: '46px clamp(28px,5vw,76px)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 23, letterSpacing: '-0.03em', textDecoration: 'none', color: 'var(--p-ink)', marginBottom: 'clamp(34px,6vh,64px)' }}>
          <span style={{ width: 34, height: 34, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 19, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
          megamind
        </Link>

        <div style={{ margin: 'auto 0', maxWidth: 400, width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
            <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
            Welcome back
          </div>
          <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(32px,4vw,46px)', letterSpacing: '-0.015em', lineHeight: 1.08, margin: '0 0 12px', color: 'var(--p-ink)' }}>
            Sign in to your{' '}
            <span style={{ color: 'var(--p-primary)', position: 'relative', whiteSpace: 'nowrap' }}>
              megamind.
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 7, background: 'var(--p-primary)', opacity: 0.2, borderRadius: 5, zIndex: -1 }} />
            </span>
          </h1>
          <p style={{ color: 'var(--p-ink-2)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
            Pick up where you left off — your AI tutor remembered everything.
          </p>
          <SignInForm />
        </div>
      </div>

      {/* Art / brand side */}
      <div style={{ background: 'linear-gradient(155deg, var(--p-hero-a), var(--p-hero-b) 52%, var(--p-hero-c))', color: '#fff', padding: '54px clamp(34px,4vw,60px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: 999, background: 'rgba(255,255,255,0.1)', top: -90, right: -70, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: 999, background: 'rgba(255,255,255,0.1)', bottom: 40, left: -80, pointerEvents: 'none' }} />

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12.5, alignSelf: 'flex-start', position: 'relative' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff' }} />
          12,400+ students learning daily
        </span>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,2.8vw,38px)', lineHeight: 1.18, letterSpacing: '-0.015em', maxWidth: 460 }}>
            &ldquo;I went from a B to an A in chemistry. The theory pop-ups did it.&rdquo;
          </div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 999, background: 'rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 18, border: '2px solid rgba(255,255,255,0.5)', flexShrink: 0 }}>T</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15 }}>Thisari P.</div>
              <div style={{ fontSize: 13, opacity: 0.82 }}>A/L · Bio stream · Kandy</div>
            </div>
          </div>
        </div>

        <div style={{ alignSelf: 'flex-end', transform: 'rotate(4deg)', position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.97)', color: 'var(--p-ink)', borderRadius: 16, padding: 18, width: 248, boxShadow: 'var(--p-shadow-lg)' }}>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)', marginBottom: 8 }}>📖 Mini theory</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--p-ink-2)' }}>The <b style={{ color: 'var(--p-ink)' }}>Network layer</b> handles routing — IP addresses live here.</div>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', opacity: 0.8, position: 'relative', zIndex: 1 }}>
          MEGAMIND · LEARN WHILE YOU QUIZ
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

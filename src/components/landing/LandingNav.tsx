// Client Component - Public landing page navigation
'use client';

import Link from 'next/link';

export function LandingNav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--p-bg)',
      borderBottom: '2px solid var(--p-ink)',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--p-ink)' }}>
          <span style={{
            width: 32, height: 32, background: 'var(--p-primary)',
            border: '2px solid var(--p-ink)', borderRadius: 10,
            display: 'grid', placeItems: 'center',
            color: 'var(--p-primary-ink)', fontSize: 18, fontWeight: 700,
            transform: 'rotate(-8deg)',
            fontFamily: 'var(--font-display, sans-serif)',
          }}>M</span>
          <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>
            megamind<span style={{ color: 'var(--p-primary)' }}>.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: 28, fontSize: 14, fontWeight: 500 }}>
          {[['#how', 'How it works'], ['#subjects', 'Subjects'], ['#quiz', 'Try a quiz'], ['#pricing', 'Pricing']].map(([href, label]) => (
            <a key={href} href={href} style={{ color: 'var(--p-ink)', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/auth/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999,
            background: 'var(--p-bg)', color: 'var(--p-ink)', fontWeight: 600,
            fontFamily: 'var(--font-display, sans-serif)', fontSize: 13,
            boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none',
          }}>Log in</Link>
          <Link href="/auth/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999,
            background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontWeight: 600,
            fontFamily: 'var(--font-display, sans-serif)', fontSize: 13,
            boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none',
          }}>Start free →</Link>
        </div>
      </div>
    </nav>
  );
}

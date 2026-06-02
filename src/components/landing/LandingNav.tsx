// Client Component - Public landing page navigation
'use client';

import { useAuth } from '@/contexts/authcontext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '#how',        label: 'How it works' },
  { href: '#subjects',   label: 'Subjects' },
  { href: '#quiz',       label: 'Try a quiz' },
  { href: '#pricing',    label: 'Pricing' },
  { href: '/flashcards', label: '🃏 Flashcards' },
];

export function LandingNav() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const initials = ((profile?.full_name || user?.email || '?')).slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(160%) blur(10px)',
        borderBottom: '1px solid var(--p-line)',
      }}>
        <div className="p-nav-inner" style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 28 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: 'var(--p-ink)', fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900, fontSize: 23, letterSpacing: '-0.03em' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--p-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 19, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)', flexShrink: 0 }}>M</span>
            megamind
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ gap: 26, marginLeft: 12, fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 700, fontSize: 15 }}>
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} style={{ color: 'var(--p-ink-2)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--p-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--p-ink-2)')}>
                {label}
              </a>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Right CTA */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user ? (
              <button onClick={() => router.push('/student/profile')} title="My profile"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <NavAvatar url={avatarUrl} initials={initials} />
                <span className="hidden md:block" style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-ink-2)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.full_name ?? user.email}
                </span>
              </button>
            ) : (
              <div className="hidden md:flex" style={{ gap: 10 }}>
                <Link href="/auth/signin" style={ghostBtn}>Log in</Link>
                <Link href="/auth/signup" style={primaryBtn}>Start free →</Link>
              </div>
            )}

            {/* Hamburger */}
            <button onClick={() => setOpen(o => !o)} className="md:hidden"
              style={{ width: 40, height: 40, border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: 'var(--p-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 18, color: 'var(--p-ink)', boxShadow: 'var(--p-shadow-sm)' }}>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(30,34,48,0.42)' }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(300px, 85vw)', background: 'var(--p-bg)', boxShadow: '-20px 0 60px rgba(24,28,46,0.18)', display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: 4, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 20, color: 'var(--p-ink)' }}>megamind</span>
              <button onClick={() => setOpen(false)} style={{ width: 36, height: 36, border: '1px solid var(--p-line-2)', borderRadius: 999, background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 16, boxShadow: 'var(--p-shadow-sm)' }}>✕</button>
            </div>

            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setOpen(false)}
                style={{ padding: '13px 16px', borderRadius: 12, border: '1px solid var(--p-line-2)', background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'block', marginBottom: 8, boxShadow: 'var(--p-shadow-sm)' }}>
                {label}
              </a>
            ))}

            <div style={{ borderTop: '1px solid var(--p-line)', margin: '12px 0' }} />

            {user ? (
              <button onClick={() => { router.push('/student/profile'); setOpen(false); }}
                style={{ padding: '13px 16px', borderRadius: 12, border: '1px solid var(--p-line-2)', background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 15, cursor: 'pointer', textAlign: 'left', boxShadow: 'var(--p-shadow-sm)' }}>
                👤 My profile
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/auth/signin" onClick={() => setOpen(false)} style={{ ...ghostBtn, display: 'block', textAlign: 'center', padding: '13px 16px', borderRadius: 12 }}>Log in</Link>
                <Link href="/auth/signup" onClick={() => setOpen(false)} style={{ ...primaryBtn, display: 'block', textAlign: 'center', padding: '13px 16px', borderRadius: 12 }}>Start free →</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function NavAvatar({ url, initials, size = 38, radius = 999 }: { url: string | null; initials: string; size?: number; radius?: number }) {
  const base: React.CSSProperties = { width: size, height: size, borderRadius: radius, flexShrink: 0, display: 'grid', placeItems: 'center', overflow: 'hidden', background: 'var(--p-peach)', color: 'var(--p-ink-peach)', transition: 'box-shadow .15s, transform .15s' };
  if (url) return <div style={base}><img src={url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>;
  return <div style={base}><span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: size * 0.36, lineHeight: 1 }}>{initials}</span></div>;
}

export function Avatar({ url, initials, size = 40, radius = 12 }: { url: string | null; initials: string; size?: number; radius?: number }) {
  const base: React.CSSProperties = { width: size, height: size, borderRadius: radius, flexShrink: 0, display: 'grid', placeItems: 'center', overflow: 'hidden', background: 'var(--p-peach)', color: 'var(--p-ink-peach)' };
  if (url) return <div style={base}><img src={url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>;
  return <div style={base}><span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: size * 0.35, color: 'var(--p-ink-peach)', lineHeight: 1 }}>{initials}</span></div>;
}

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', padding: '9px 18px',
  border: '1.5px solid var(--p-line-2)', borderRadius: 12,
  background: '#fff', color: 'var(--p-ink)',
  fontWeight: 700, fontFamily: 'var(--font-display, Nunito, sans-serif)', fontSize: 14,
  boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none',
};
const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', padding: '9px 18px',
  border: 'none', borderRadius: 12,
  background: 'var(--p-primary)', color: '#fff',
  fontWeight: 800, fontFamily: 'var(--font-display, Nunito, sans-serif)', fontSize: 14,
  boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none',
};

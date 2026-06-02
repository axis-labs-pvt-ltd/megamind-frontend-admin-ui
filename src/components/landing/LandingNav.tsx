// Client Component - Public landing page navigation
'use client';

import { useAuth } from '@/contexts/authcontext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '#how',      label: 'How it works' },
  { href: '#subjects', label: 'Subjects' },
  { href: '#quiz',     label: 'Try a quiz' },
  { href: '#pricing',  label: 'Pricing' },
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
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div className="p-nav-inner" style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--p-ink)' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', fontSize: 18, fontWeight: 700, transform: 'rotate(-8deg)', fontFamily: 'var(--font-display, sans-serif)', flexShrink: 0 }}>M</span>
            <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>
              megamind<span style={{ color: 'var(--p-primary)' }}>.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ gap: 28, fontSize: 14, fontWeight: 500 }}>
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} style={{ color: label.includes('Flashcard') ? 'var(--p-primary)' : 'var(--p-ink)', textDecoration: 'none', fontWeight: label.includes('Flashcard') ? 600 : 500 }}>
                {label}
              </a>
            ))}
          </div>

          {/* Right: CTA + hamburger */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user ? (
              <button onClick={() => router.push('/student/profile')} title="My profile"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar url={avatarUrl} initials={initials} size={40} radius={12} />
                <span className="hidden md:block" style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--p-ink)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.full_name ?? user.email}
                </span>
              </button>
            ) : (
              <div className="hidden md:flex" style={{ gap: 10 }}>
                <Link href="/auth/signin" style={ghostBtn}>Log in</Link>
                <Link href="/auth/signup" style={primaryBtn}>Start free →</Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button onClick={() => setOpen(o => !o)} className="md:hidden"
              style={{ width: 40, height: 40, border: '2px solid var(--p-ink)', borderRadius: 10, background: 'var(--p-bg)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--p-ink)' }}>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(26,21,20,0.5)' }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(300px, 85vw)', background: 'var(--p-bg)', borderLeft: '2px solid var(--p-ink)', display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: 4, overflowY: 'auto' }}>
            {/* Logo row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
              <button onClick={() => setOpen(false)} style={{ width: 36, height: 36, border: '2px solid var(--p-ink)', borderRadius: 10, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 18 }}>✕</button>
            </div>

            {/* Nav links */}
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setOpen(false)}
                style={{ padding: '13px 16px', borderRadius: 12, border: '2px solid var(--p-ink)', background: label.includes('Flashcard') ? 'var(--p-primary)' : 'var(--p-bg)', color: label.includes('Flashcard') ? 'var(--p-primary-ink)' : 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'block', marginBottom: 8, boxShadow: '2px 2px 0 var(--p-ink)' }}>
                {label}
              </a>
            ))}

            <div style={{ borderTop: '2px dashed var(--p-ink)', margin: '12px 0' }} />

            {user ? (
              <button onClick={() => { router.push('/student/profile'); setOpen(false); }}
                style={{ padding: '13px 16px', borderRadius: 12, border: '2px solid var(--p-ink)', background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, cursor: 'pointer', textAlign: 'left', boxShadow: '2px 2px 0 var(--p-ink)' }}>
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

export function Avatar({ url, initials, size = 40, radius = 12 }: { url: string | null; initials: string; size?: number; radius?: number }) {
  const base: React.CSSProperties = { width: size, height: size, borderRadius: radius, border: '2px solid var(--p-ink)', flexShrink: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' };
  if (url) return <div style={base}><img src={url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>;
  return <div style={{ ...base, background: 'var(--p-card-a)' }}><span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: size * 0.35, color: 'var(--p-ink)', lineHeight: 1 }}>{initials}</span></div>;
}

const ghostBtn: React.CSSProperties   = { display: 'inline-flex', alignItems: 'center', padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontWeight: 600, fontFamily: 'var(--font-display, sans-serif)', fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' };
const primaryBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontWeight: 600, fontFamily: 'var(--font-display, sans-serif)', fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' };

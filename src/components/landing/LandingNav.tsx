// Client Component - Public landing page navigation
'use client';

import { useAuth } from '@/contexts/authcontext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LandingNav() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const initials = ((profile?.full_name || user?.email || '?')).slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatar_url ?? null;

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
          <Link href="/flashcards" style={{ color: 'var(--p-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            🃏 Flashcards
          </Link>
        </div>

        {/* CTA / Avatar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <button
              onClick={() => router.push('/student/profile')}
              title="My profile"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <Avatar url={avatarUrl} initials={initials} size={40} radius={12} />
              <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--p-ink)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile?.full_name ?? user.email}
              </span>
            </button>
          ) : (
            <>
              <Link href="/auth/signin" style={ghostBtn}>Log in</Link>
              <Link href="/auth/signup" style={primaryBtn}>Start free →</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Avatar({ url, initials, size = 40, radius = 12 }: {
  url: string | null;
  initials: string;
  size?: number;
  radius?: number;
}) {
  const base: React.CSSProperties = {
    width: size, height: size, borderRadius: radius,
    border: '2px solid var(--p-ink)', flexShrink: 0,
    display: 'grid', placeItems: 'center', overflow: 'hidden',
  };

  if (url) {
    return (
      <div style={base}>
        <img src={url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }

  return (
    <div style={{ ...base, background: 'var(--p-card-a)' }}>
      <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: size * 0.35, color: 'var(--p-ink)', lineHeight: 1 }}>
        {initials}
      </span>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999,
  background: 'var(--p-bg)', color: 'var(--p-ink)', fontWeight: 600,
  fontFamily: 'var(--font-display, sans-serif)', fontSize: 13,
  boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none',
};

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999,
  background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontWeight: 600,
  fontFamily: 'var(--font-display, sans-serif)', fontSize: 13,
  boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none',
};

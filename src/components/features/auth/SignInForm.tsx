// Client Component - Sign in form with Supabase auth
'use client';

import { useAuth } from '@/contexts/authcontext';
import { authService } from '@/services/api/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SignInForm() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // Once we know the profile role, redirect to the right place.
  useEffect(() => {
    if (!justLoggedIn || !user || !profile) return;
    if (profile.role === 'student') {
      router.push('/student/profile');
    } else {
      router.push('/admin/dashboard');
    }
  }, [justLoggedIn, user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email, password });
      setJustLoggedIn(true);
    } catch (err: any) {
      setError(err.message ?? 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      setError(err.message ?? 'Google sign in failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#b91c1c', marginBottom: 20 }}>
          {error}
        </div>
      )}

      <button type="button" onClick={handleGoogle} disabled={loading} style={ghostBtn}>
        <GoogleIcon /> Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
        <span style={{ flex: 1, height: 1, background: 'var(--p-line-2)' }} />
        <span style={{ fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>OR EMAIL</span>
        <span style={{ flex: 1, height: 1, background: 'var(--p-line-2)' }} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Email address</label>
        <input type="email" placeholder="you@email.lk" value={email}
          onChange={e => setEmail(e.target.value)} required style={inputStyle} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <label style={labelStyle}>Password</label>
          <a href="#" style={{ fontSize: 12, color: 'var(--p-primary)', textDecoration: 'none', fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 700 }}>Forgot?</a>
        </div>
        <input type="password" placeholder="••••••••" value={password}
          onChange={e => setPassword(e.target.value)} required style={inputStyle} />
      </div>

      <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--p-ink-2)', margin: '16px 0 26px', cursor: 'pointer' }}>
        <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--p-primary)' }} />
        Keep me signed in on this device
      </label>

      <button type="submit" disabled={loading || justLoggedIn} style={{ ...primaryBtn, opacity: loading || justLoggedIn ? 0.75 : 1 }}>
        {loading || justLoggedIn ? 'Signing in…' : 'Sign in →'}
      </button>

      <p style={{ marginTop: 28, fontSize: 14, color: 'var(--p-ink-2)', textAlign: 'center' }}>
        New to Megamind?{' '}
        <a href="/auth/signup" style={{ color: 'var(--p-primary)', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-display, Nunito, sans-serif)' }}>
          Create an account
        </a>
      </p>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

const labelStyle: React.CSSProperties  = { fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 800, fontSize: 13, color: 'var(--p-ink)', display: 'block', marginBottom: 7 };
const inputStyle: React.CSSProperties  = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', fontFamily: 'inherit', fontSize: 15, color: 'var(--p-ink)', outline: 'none', boxSizing: 'border-box', boxShadow: 'var(--p-shadow-sm)' };
const ghostBtn: React.CSSProperties    = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 15, border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', color: 'var(--p-ink)', fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--p-shadow-sm)' };
const primaryBtn: React.CSSProperties  = { width: '100%', padding: 16, border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: 'var(--p-shadow-orange)' };

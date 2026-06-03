// Client Component - Route protection for admin panel
'use client';

import { useAuth } from '@/contexts/authcontext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.replace('/auth/signin');
        }
      });
      return;
    }

    if (!profile) return;

    if (!['admin', 'teacher'].includes(profile.role)) {
      // Logged-in students belong to the student section, not the admin panel.
      router.replace('/student/profile');
    }
  }, [user, profile, loading, router]);

  if (loading) return <AdminLoadingScreen />;
  if (!user) return <AdminLoadingScreen />; // wait — may be a stale render post-login
  if (!profile) return <AdminLoadingScreen />; // profile fetch in progress
  if (!['admin', 'teacher'].includes(profile.role)) return null;

  return <>{children}</>;
}

export function AdminOnlyGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/auth/signin'); return; }
    if (profile && profile.role !== 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile) return null;

  if (profile.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Admin access only</h2>
        <p className="text-sm text-[var(--text-secondary)]">This section is restricted to administrators.</p>
      </div>
    );
  }

  return <>{children}</>;
}

function AdminLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--accent-orange)', borderTopColor: 'transparent' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Verifying access…</p>
      </div>
    </div>
  );
}

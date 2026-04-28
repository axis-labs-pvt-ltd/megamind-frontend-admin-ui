// Client Component - Route protection for admin panel
'use client';

import { useAuth } from '@/contexts/authcontext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Guards all admin routes — requires admin or teacher role
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/signin');
      return;
    }
    if (profile && !['admin', 'teacher'].includes(profile.role)) {
      router.replace('/marketplace');
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile) return <AdminLoadingScreen />;

  if (!['admin', 'teacher'].includes(profile.role)) return null;

  return <>{children}</>;
}

// Stricter gate — use inside a page that is admin-only (subjects, settings, analytics)
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
        <div className="w-10 h-10 border-4 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-secondary)] font-medium">Verifying access…</p>
      </div>
    </div>
  );
}

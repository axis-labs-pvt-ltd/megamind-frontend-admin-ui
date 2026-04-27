'use client';

import { useAuth } from '@/contexts/authcontext';
import { Avatar } from '@/components/landing/LandingNav';
import { supabase } from '@/lib/supabase';
import { fetchMyPurchases } from '@/services/api/purchases';
import { fetchStudentAttempts } from '@/services/api/testSessions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

export default function StudentProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName]       = useState('');
  const [phone, setPhone]             = useState('');
  const [address, setAddress]         = useState('');
  const [avatarUrl, setAvatarUrl]     = useState<string | null>(null);
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');
  const [stats, setStats]             = useState({ purchased: 0, completed: 0, avgScore: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
      setAddress(profile.address ?? '');
      setAvatarUrl(profile.avatar_url ?? null);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [purchases, attempts] = await Promise.all([
        fetchMyPurchases().catch(() => []),
        fetchStudentAttempts(user.id).catch(() => []),
      ]);
      const scores = attempts.map((a: any) => a.score ?? 0);
      const avg = scores.length
        ? Math.round(scores.reduce((s: number, v: number) => s + v, 0) / scores.length)
        : 0;
      setStats({ purchased: purchases.length, completed: attempts.length, avgScore: avg });
      setStatsLoading(false);
    })();
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setSaveMsg('');

    const ext  = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (upErr) {
      setSaveMsg('Upload failed. Try again.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const bust = `${publicUrl}?t=${Date.now()}`;

    await supabase.from('profiles').update({ avatar_url: bust }).eq('id', user.id);
    setAvatarUrl(bust);
    setUploading(false);
    setSaveMsg('Photo updated!');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg('');
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim(), address: address.trim() })
      .eq('id', user.id);
    setSaving(false);
    setSaveMsg(error ? 'Failed to save. Try again.' : 'Saved successfully!');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  if (authLoading || !user) return null;

  const initials = (fullName || user.email || '?').slice(0, 2).toUpperCase();
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg)' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', fontSize: 18, fontWeight: 700, transform: 'rotate(-8deg)', fontFamily: 'var(--font-display,sans-serif)' }}>M</span>
            <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/marketplace" style={ghostBtn}>Browse tests</Link>
            <Link href="/my-tests" style={ghostBtn}>My tests</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 28px 80px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 36 }}>
          <span style={eyebrow}>Student account</span>
          <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-0.02em', color: 'var(--p-ink)', marginTop: 10 }}>
            Your profile<span style={{ color: 'var(--p-primary)' }}>.</span>
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28 }} className="profile-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Avatar card */}
            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

                {/* Avatar circle */}
                <div style={{ position: 'relative', width: 96, height: 96 }}>
                  <Avatar url={avatarUrl} initials={initials} size={96} radius={22} />
                  {/* Upload overlay */}
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    title="Change photo"
                    style={{ position: 'absolute', bottom: -8, right: -8, width: 30, height: 30, borderRadius: 999, border: '2px solid var(--p-ink)', background: 'var(--p-primary)', color: 'var(--p-primary-ink)', display: 'grid', placeItems: 'center', cursor: uploading ? 'default' : 'pointer', fontSize: 14 }}
                  >
                    {uploading ? '…' : '📷'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 17, color: 'var(--p-ink)', marginBottom: 4 }}>
                    {profile?.full_name || 'Student'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-ink-2)', marginBottom: 10, wordBreak: 'break-all' }}>{user.email}</div>
                  <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, border: '1.5px solid var(--p-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {profile?.role ?? 'student'}
                  </span>
                </div>
              </div>
              <div style={{ borderTop: '1.5px dashed var(--p-ink)', marginTop: 18, paddingTop: 14, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-ink-2)', textAlign: 'center' }}>
                Member since {joinedDate}
              </div>
            </div>

            {/* Stats */}
            <div style={card}>
              <div style={sectionLabel}>Stats</div>
              {statsLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0', fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)' }}>Loading…</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <StatRow label="Purchased tests" value={stats.purchased} color="var(--p-card-a)" />
                  <StatRow label="Tests completed"  value={stats.completed}  color="var(--p-card-d)" />
                  <StatRow label="Average score"    value={`${stats.avgScore}%`} color="var(--p-card-c)" />
                </div>
              )}
            </div>

            {/* Quick links */}
            <div style={card}>
              <div style={sectionLabel}>Quick links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/marketplace" style={quickLink}>Browse marketplace →</Link>
                <Link href="/my-tests" style={quickLink}>My purchased tests →</Link>
                <Link href="/my-tests?tab=history" style={quickLink}>Test history →</Link>
              </div>
            </div>

          </div>

          {/* Right column — edit form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={card}>
              <div style={sectionLabel}>Personal information</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                <Field label="Full name">
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Email address">
                  <input
                    value={user.email ?? ''}
                    disabled
                    style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
                  />
                  <span style={hint}>Email cannot be changed here.</span>
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Contact number">
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+94 7X XXX XXXX"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Address">
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="No. 12, Temple Road, Colombo 07"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  />
                </Field>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={saveBtnStyle(saving)}
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  {saveMsg && (
                    <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 13, fontWeight: 600, color: saveMsg.startsWith('Saved') || saveMsg.startsWith('Photo') ? 'var(--p-primary)' : '#c0392b' }}>
                      {saveMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Account actions */}
            <div style={card}>
              <div style={sectionLabel}>Account</div>
              <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-ink-2)', marginBottom: 16 }}>
                Sign out from all devices and return to the home page.
              </p>
              <SignOutButton />
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--p-ink)', background: color }}>
      <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-ink)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 16, color: 'var(--p-ink)' }}>{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 600, color: 'var(--p-ink)', letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  );
}

function SignOutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    setBusy(true);
    await logout();
    router.push('/');
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={busy}
      style={{ padding: '10px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: busy ? 'default' : 'pointer', boxShadow: '2px 2px 0 var(--p-ink)', alignSelf: 'flex-start', display: 'inline-block' }}
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}

const saveBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '11px 28px', border: '2px solid var(--p-ink)', borderRadius: 999,
  background: disabled ? 'var(--p-bg-alt)' : 'var(--p-primary)',
  color: disabled ? 'var(--p-ink-2)' : 'var(--p-primary-ink)',
  fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14,
  cursor: disabled ? 'default' : 'pointer',
  boxShadow: disabled ? 'none' : '3px 3px 0 var(--p-ink)',
  transition: 'all 0.15s',
});

const card: React.CSSProperties         = { border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', padding: '24px', boxShadow: '4px 4px 0 var(--p-ink)' };
const eyebrow: React.CSSProperties      = { fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)' };
const sectionLabel: React.CSSProperties = { fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--p-ink-2)', textTransform: 'uppercase', marginBottom: 18 };
const ghostBtn: React.CSSProperties     = { padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' };
const inputStyle: React.CSSProperties   = { width: '100%', padding: '11px 14px', border: '2px solid var(--p-ink)', borderRadius: 12, background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const quickLink: React.CSSProperties    = { display: 'block', padding: '9px 14px', border: '1.5px solid var(--p-ink)', borderRadius: 10, background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '2px 2px 0 var(--p-ink)' };
const hint: React.CSSProperties         = { fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginTop: 4 };

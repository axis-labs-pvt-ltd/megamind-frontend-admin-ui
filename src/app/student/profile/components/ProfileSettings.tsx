// Client Component
'use client';

import { useAuth } from '@/contexts/authcontext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  userId: string;
  email: string;
  initialName: string;
  initialPhone: string;
  initialAddress: string;
}

export function ProfileSettings({ userId, email, initialName, initialPhone, initialAddress }: Props) {
  const { logout } = useAuth();
  const router = useRouter();
  const [name, setName]       = useState(initialName);
  const [phone, setPhone]     = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const save = async () => {
    setSaving(true); setMsg('');
    const { error } = await supabase.from('profiles')
      .update({ full_name: name.trim(), phone: phone.trim(), address: address.trim() })
      .eq('id', userId);
    setSaving(false);
    setMsg(error ? 'Failed to save.' : 'Saved!');
    setTimeout(() => setMsg(''), 2500);
  };

  const signOut = async () => {
    setSigningOut(true);
    await logout();
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={card}>
        <div style={sectionLabel}>Personal information</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Full name">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={input} />
          </Field>
          <Field label="Email address">
            <input value={email} disabled style={{ ...input, opacity: 0.5, cursor: 'not-allowed' }} />
            <span style={hint}>Email cannot be changed here.</span>
          </Field>
          <Field label="Contact number">
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" style={input} />
          </Field>
          <Field label="Address">
            <textarea value={address} onChange={e => setAddress(e.target.value)}
              placeholder="No. 12, Temple Road, Colombo 07" rows={3}
              style={{ ...input, resize: 'vertical', lineHeight: 1.5 }} />
          </Field>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
            <button onClick={save} disabled={saving}
              style={{ padding: '11px 28px', border: '2px solid var(--p-ink)', borderRadius: 999, background: saving ? 'var(--p-bg-alt)' : 'var(--p-primary)', color: saving ? 'var(--p-ink-2)' : 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer', boxShadow: saving ? 'none' : '3px 3px 0 var(--p-ink)' }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {msg && <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 13, fontWeight: 600, color: msg === 'Saved!' ? '#2D6A4F' : '#D94A3D' }}>{msg}</span>}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionLabel}>Account</div>
        <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-ink-2)', marginBottom: 16 }}>Sign out from all devices and return to the home page.</p>
        <button onClick={signOut} disabled={signingOut}
          style={{ padding: '10px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: signingOut ? 'default' : 'pointer', boxShadow: '2px 2px 0 var(--p-ink)' }}>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, color: 'var(--p-ink-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

const card: React.CSSProperties = { border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', padding: 24, boxShadow: '4px 4px 0 var(--p-ink)' };
const sectionLabel: React.CSSProperties = { fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--p-ink-2)', textTransform: 'uppercase', marginBottom: 18 };
const input: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '2px solid var(--p-ink)', borderRadius: 12, background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const hint: React.CSSProperties = { fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginTop: 3 };

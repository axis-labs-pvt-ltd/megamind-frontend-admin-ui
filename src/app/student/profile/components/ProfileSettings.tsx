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
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />
          </Field>
          <Field label="Email address">
            <input value={email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            <span style={hint}>Email cannot be changed here.</span>
          </Field>
          <Field label="Contact number">
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" style={inputStyle} />
          </Field>
          <Field label="Address">
            <textarea value={address} onChange={e => setAddress(e.target.value)}
              placeholder="No. 12, Temple Road, Colombo 07" rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
          </Field>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
            <button onClick={save} disabled={saving}
              style={{ padding: '12px 28px', border: 'none', borderRadius: 12, background: saving ? 'var(--p-bg-alt)' : 'var(--p-primary)', color: saving ? 'var(--p-muted)' : '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, cursor: saving ? 'default' : 'pointer', boxShadow: saving ? 'none' : 'var(--p-shadow-orange)' }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {msg && <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: msg === 'Saved!' ? 'var(--p-ink-mint)' : 'var(--p-ink-pink)' }}>{msg}</span>}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionLabel}>Account</div>
        <p style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-ink-2)', marginBottom: 16, lineHeight: 1.6 }}>Sign out from all devices and return to the home page.</p>
        <button onClick={signOut} disabled={signingOut}
          style={{ padding: '10px 22px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, cursor: signingOut ? 'default' : 'pointer', boxShadow: 'var(--p-shadow-sm)' }}>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, color: 'var(--p-ink)', letterSpacing: '0.01em' }}>{label}</label>
      {children}
    </div>
  );
}

const card: React.CSSProperties      = { border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', padding: 28, boxShadow: 'var(--p-shadow-sm)' };
const sectionLabel: React.CSSProperties = { fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 };
const inputStyle: React.CSSProperties   = { width: '100%', padding: '12px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', color: 'var(--p-ink)', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box', boxShadow: 'var(--p-shadow-sm)' };
const hint: React.CSSProperties         = { fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12, color: 'var(--p-muted)', marginTop: 4 };

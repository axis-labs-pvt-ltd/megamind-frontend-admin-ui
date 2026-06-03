// Client Component
'use client';

import { Avatar } from '@/components/landing/LandingNav';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Stats { purchased: number; decks: number; completed: number; avgScore: number; }

interface Props {
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  avatarUrl: string | null;
  userId: string;
  stats: Stats;
  statsLoading: boolean;
  onAvatarChange: (url: string) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}

export function ProfileHeader({ name, email, role, joinedDate, avatarUrl, userId, stats, statsLoading, onAvatarChange, uploading, setUploading }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const initials = (name || email || '?').slice(0, 2).toUpperCase();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${userId}/avatar.${file.name.split('.').pop()}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${publicUrl}?t=${Date.now()}`;
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId);
    onAvatarChange(url);
    setUploading(false);
  };

  const STATS = [
    { val: statsLoading ? '…' : stats.purchased,          lbl: 'Tests owned' },
    { val: statsLoading ? '…' : stats.decks,              lbl: 'Flashcard decks' },
    { val: statsLoading ? '…' : stats.completed,          lbl: 'Tests done' },
    { val: statsLoading ? '…' : `${stats.avgScore}%`,     lbl: 'Avg score' },
  ];

  return (
    <div style={{ background: '#fff', border: '1px solid var(--p-line)', borderRadius: 20, boxShadow: 'var(--p-shadow)', overflow: 'hidden', marginBottom: 28 }}>
      <div style={{ padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar url={avatarUrl} initials={initials} size={88} radius={999} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} title="Change photo"
            style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 999, border: 'none', background: 'var(--p-primary)', color: '#fff', display: 'grid', placeItems: 'center', cursor: uploading ? 'default' : 'pointer', fontSize: 13, boxShadow: 'var(--p-shadow-orange)' }}>
            {uploading ? '…' : '📷'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, background: 'var(--p-primary-soft)', color: 'var(--p-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{role}</span>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, background: 'var(--p-bg-alt)', color: 'var(--p-muted)' }}>Since {joinedDate}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.015em', lineHeight: 1.1, marginBottom: 8 }}>{name || 'Student'}</div>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-muted)', wordBreak: 'break-all' }}>{email}</div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ borderTop: '1px solid var(--p-line)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="stats-strip">
        {STATS.map((s, i) => (
          <div key={s.lbl} style={{ padding: '16px 20px', textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--p-line)' : 'none' }}>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', color: 'var(--p-muted)', marginTop: 5, textTransform: 'uppercase' }}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:600px){.stats-strip{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </div>
  );
}

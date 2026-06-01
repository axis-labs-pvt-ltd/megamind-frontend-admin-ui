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
    { val: statsLoading ? '…' : stats.purchased, lbl: 'Tests owned' },
    { val: statsLoading ? '…' : stats.decks,     lbl: 'Flashcard decks' },
    { val: statsLoading ? '…' : stats.completed, lbl: 'Tests done' },
    { val: statsLoading ? '…' : `${stats.avgScore}%`, lbl: 'Avg score' },
  ];

  return (
    <div style={{ background: 'var(--p-secondary)', border: '2px solid var(--p-ink)', borderRadius: 20, boxShadow: '6px 6px 0 var(--p-ink)', overflow: 'hidden', marginBottom: 28 }}>
      <div style={{ padding: '32px 36px', display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar url={avatarUrl} initials={initials} size={88} radius={20} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} title="Change photo"
            style={{ position: 'absolute', bottom: -6, right: -6, width: 28, height: 28, borderRadius: 999, border: '2px solid var(--p-ink)', background: 'var(--p-primary)', color: 'var(--p-primary-ink)', display: 'grid', placeItems: 'center', cursor: uploading ? 'default' : 'pointer', fontSize: 13 }}>
            {uploading ? '…' : '📷'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name || 'Student'}</div>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-ink-2)', margin: '5px 0 10px', wordBreak: 'break-all' }}>{email}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 12px', borderRadius: 999, border: '1.5px solid var(--p-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, background: 'var(--p-ink)', color: 'var(--p-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{role}</span>
            <span style={{ padding: '3px 12px', borderRadius: 999, border: '1.5px solid var(--p-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-ink-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Since {joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ borderTop: '2px solid var(--p-ink)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="stats-strip">
        {STATS.map((s, i) => (
          <div key={s.lbl} style={{ padding: '16px 20px', textAlign: 'center', borderLeft: i > 0 ? '2px solid var(--p-ink)' : 'none' }}>
            <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>{s.val}</div>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-ink-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:600px){.stats-strip{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </div>
  );
}

// Client Component - Admin: manage hero slider slides
'use client';

import { useCreateHeroSlide, useDeleteHeroSlide, useHeroSlides, useToggleHeroSlideActive, useUpdateHeroSlide } from '@/hooks/queries/useHeroSlides';
import { HeroSlide, SlideInput } from '@/services/api/heroSlides';
import { useState } from 'react';
import { SlideForm } from './components/SlideForm';

export default function HeroSlidesPage() {
  const { data: slides = [], isLoading, error } = useHeroSlides();
  const create  = useCreateHeroSlide();
  const update  = useUpdateHeroSlide();
  const remove  = useDeleteHeroSlide();
  const toggle  = useToggleHeroSlideActive();

  const [modal, setModal] = useState<'add' | HeroSlide | null>(null);

  const saving = create.isPending || update.isPending;

  const handleSave = (data: SlideInput) => {
    if (modal === 'add') {
      create.mutate(data, { onSuccess: () => setModal(null) });
    } else if (modal) {
      update.mutate({ id: modal.id, data }, { onSuccess: () => setModal(null) });
    }
  };

  const handleDelete = (slide: HeroSlide) => {
    if (!confirm(`Delete slide "${slide.title}"?`)) return;
    remove.mutate(slide.id);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', marginBottom:4 }}>Hero Slides</h1>
          <p style={{ fontSize:14, color:'var(--text-secondary)' }}>Manage the landing page hero slider. Changes are live immediately.</p>
        </div>
        <button onClick={() => setModal('add')} style={btnPrimary}>+ Add slide</button>
      </div>

      {/* Add/Edit modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={{ background:'var(--bg-card)', borderRadius:16, boxShadow:'var(--shadow-lg)', width:'100%', maxWidth:680, maxHeight:'90vh', overflowY:'auto', padding:28 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', marginBottom:20 }}>
              {modal === 'add' ? 'Add slide' : `Edit — ${(modal as HeroSlide).chip}`}
            </h2>
            <SlideForm initial={modal === 'add' ? undefined : modal as HeroSlide} onSave={handleSave} onCancel={() => setModal(null)} saving={saving} />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{ padding:20, borderRadius:12, background:'#FFF4F2', border:'1px solid #F6D4CD', color:'#C0392B', fontSize:14, marginBottom:20 }}>
          <b>Could not load slides.</b> Make sure the <code>hero_slides</code> table exists in Supabase.
          <details style={{ marginTop:8 }}><summary style={{ cursor:'pointer' }}>Show SQL to create table</summary>
            <pre style={{ fontSize:11, marginTop:8, whiteSpace:'pre-wrap' }}>{CREATE_TABLE_SQL}</pre>
          </details>
        </div>
      )}

      {/* Loading */}
      {isLoading && <div style={{ padding:'60px 0', textAlign:'center', color:'var(--text-muted)', fontSize:14 }}>Loading…</div>}

      {/* Slides list */}
      {!isLoading && !error && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {slides.length === 0 && (
            <div style={{ padding:'60px 0', textAlign:'center', color:'var(--text-muted)', fontSize:14 }}>
              No slides yet. Click <b>+ Add slide</b> to create the first one.
            </div>
          )}
          {slides.map((s, i) => (
            <div key={s.id} style={{ background:'var(--bg-card)', border:'1px solid var(--border-primary)', borderRadius:14, padding:'16px 20px', display:'grid', gridTemplateColumns:'auto 64px 1fr auto', gap:16, alignItems:'center' }}>
              {/* Sort order badge */}
              <div style={{ width:36, height:36, borderRadius:10, background:'var(--bg-primary)', border:'1px solid var(--border-primary)', display:'grid', placeItems:'center', fontWeight:900, fontSize:14, color:'var(--text-secondary)' }}>
                {String(i + 1).padStart(2,'0')}
              </div>
              {/* Photo thumb */}
              <div style={{ width:64, height:48, borderRadius:8, overflow:'hidden', background:'var(--bg-primary)', flexShrink:0 }}>
                <img src={s.photoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
              {/* Info */}
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:15, color:'var(--text-primary)', marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title.replace('\n',' ')}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.chip} · {s.primaryLabel}</div>
              </div>
              {/* Actions */}
              <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                <button onClick={() => toggle.mutate({ id:s.id, isActive:!s.isActive })} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid var(--border-primary)', background: s.isActive ? '#E4F4EC' : 'var(--bg-primary)', color: s.isActive ? '#1F8A5B' : 'var(--text-muted)', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {s.isActive ? '● Active' : '○ Hidden'}
                </button>
                <button onClick={() => setModal(s)} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid var(--border-primary)', background:'var(--bg-primary)', color:'var(--text-primary)', fontSize:12, fontWeight:700, cursor:'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(s)} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid #F6D4CD', background:'#FFF4F2', color:'#C0392B', fontSize:12, fontWeight:700, cursor:'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = { padding:'10px 20px', borderRadius:10, border:'none', background:'var(--accent-orange)', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer' };

const CREATE_TABLE_SQL = `CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  chip TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  primary_label TEXT NOT NULL,
  primary_href TEXT NOT NULL,
  ghost_label TEXT NOT NULL,
  ghost_href TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  stats JSONB,
  subject_chips JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`;

'use client';

import { usePublicCollections } from '@/hooks/queries/useFlashcardCollections';
import { FlashCardCollection } from '@/types';
import Link from 'next/link';
import { Suspense, useState } from 'react';

const SUBJECT_TINTS: Record<string, [string, string]> = {
  Physics:     ['var(--p-peach)',  'var(--p-ink-peach)'],
  Chemistry:   ['var(--p-mint)',   'var(--p-ink-mint)'],
  ICT:         ['var(--p-blue)',   'var(--p-ink-blue)'],
  Mathematics: ['var(--p-lav)',    'var(--p-ink-lav)'],
  English:     ['var(--p-yellow)', 'var(--p-ink-yellow)'],
};

function CollectionCard({ col }: { col: FlashCardCollection }) {
  const [tint, ink] = SUBJECT_TINTS[col.subjectName ?? ''] ?? ['var(--p-bg-alt)', 'var(--p-ink-2)'];
  return (
    <Link href={`/flashcards/${col.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)', overflow: 'hidden', transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = 'var(--p-shadow-lg)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = 'var(--p-shadow-sm)'; }}>
      {/* Tinted header */}
      <div style={{ background: tint, padding: '20px 22px', position: 'relative', minHeight: 128 }}>
        {/* Card stack */}
        <div style={{ position: 'absolute', right: 18, top: 18, width: 68, height: 88 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 11, background: '#fff', boxShadow: 'var(--p-shadow-sm)', transform: 'rotate(8deg)' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: 11, background: '#fff', boxShadow: 'var(--p-shadow-sm)', transform: 'rotate(2deg)' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: 11, background: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 26, color: ink, transform: 'rotate(-4deg)', boxShadow: 'var(--p-shadow-sm)' }}>{col.cardCount}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: ink }}>{(col.subjectName ?? col.level).toUpperCase()}</span>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {col.isBestseller && <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 999, fontSize: 10, background: 'var(--p-ink)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800 }}>★ bestseller</span>}
          {col.isNew && <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 999, fontSize: 10, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800 }}>New</span>}
        </div>
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 17, lineHeight: 1.3, marginBottom: 5, color: 'var(--p-ink)' }}>{col.title}</h3>
        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12, color: 'var(--p-muted)', marginBottom: 10 }}>by {col.tutorName}</div>
        {col.rating && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: '#FFF6E5', color: '#B07A12', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12 }}>★ {col.rating}</span>
            <span style={{ fontSize: 12, color: 'var(--p-muted)', fontWeight: 600 }}>{col.soldCount} sold</span>
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12, color: 'var(--p-muted)', marginBottom: 14 }}>{col.cardCount} cards</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--p-line)', paddingTop: 14 }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 20, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>
            {col.visibility === 'public_free' ? 'Free' : `Rs. ${col.price.toLocaleString()}`}
          </div>
          <span style={{ padding: '8px 16px', border: 'none', borderRadius: 10, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, boxShadow: 'var(--p-shadow-orange)' }}>
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

function FlashcardsContent() {
  const { data: collections = [], isLoading } = usePublicCollections();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');

  const subjects = Array.from(new Set(collections.map(c => c.subjectName).filter(Boolean)));
  const filtered = collections.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.tutorName.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subject || c.subjectName === subject;
    return matchSearch && matchSubject;
  });

  return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(160%) blur(10px)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 17, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
            megamind
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/marketplace" style={ghostBtn}>Tests</Link>
            <Link href="/my-tests" style={primaryBtn}>My tests →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '44px 0 0', background: 'var(--p-bg-alt)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 40px' }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-muted)', marginBottom: 16, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span><span>Flashcards</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 36, alignItems: 'center' }} className="fc-hero-grid">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
                <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Flashcard collections
              </div>
              <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,56px)', letterSpacing: '-0.015em', lineHeight: 1.08, color: 'var(--p-ink)', marginBottom: 18 }}>
                Memorize the <span style={{ color: 'var(--p-primary)' }}>tricky bits.</span>
              </h1>
              <p style={{ fontSize: 17, color: 'var(--p-ink-2)', maxWidth: 500, lineHeight: 1.65 }}>
                Curated decks from top tutors. Text, images, even short video clips. Swipe through on the go.
              </p>
            </div>
            <div style={{ padding: '20px 24px', border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow)', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 58, height: 58, borderRadius: 15, background: 'var(--p-bg-alt)', display: 'grid', placeItems: 'center', fontSize: 30, flexShrink: 0, boxShadow: 'var(--p-shadow-sm)' }}>🃏</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 26, color: 'var(--p-ink)', lineHeight: 1 }}>From Rs. 500</div>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 6 }}>One-time · keep forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '28px 0 10px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--p-muted)' }} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search decks, topics, tutors…"
                style={{ width: '100%', padding: '12px 14px 12px 44px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, background: '#fff', color: 'var(--p-ink)', outline: 'none', boxSizing: 'border-box', boxShadow: 'var(--p-shadow-sm)' }} />
            </div>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              style={{ padding: '12px 14px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, background: '#fff', color: 'var(--p-ink-2)', cursor: 'pointer', outline: 'none', boxShadow: 'var(--p-shadow-sm)' }}>
              <option value="">All subjects</option>
              {subjects.map(s => <option key={s} value={s!}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setSubject('')}
              style={{ padding: '8px 16px', border: '1px solid var(--p-line-2)', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, cursor: 'pointer', background: !subject ? 'var(--p-primary)' : '#fff', color: !subject ? '#fff' : 'var(--p-ink-2)', transition: 'all .12s' }}>
              All · {collections.length}
            </button>
            {subjects.map(s => (
              <button key={s} onClick={() => setSubject(s === subject ? '' : s!)}
                style={{ padding: '8px 16px', border: '1px solid var(--p-line-2)', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, cursor: 'pointer', background: subject === s ? 'var(--p-primary)' : '#fff', color: subject === s ? '#fff' : 'var(--p-ink-2)', transition: 'all .12s' }}>
                {s} · {collections.filter(c => c.subjectName === s).length}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '20px 0 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15, color: 'var(--p-muted)' }}>Loading collections…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15, color: 'var(--p-muted)' }}>No collections found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }} className="fc-grid">
              {filtered.map(col => <CollectionCard key={col.id} col={col} />)}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) { .fc-grid { grid-template-columns: repeat(2,1fr) !important; } .fc-hero-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .fc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

export default function FlashcardsPage() {
  return <Suspense><FlashcardsContent /></Suspense>;
}

const ghostBtn: React.CSSProperties   = { display: 'inline-flex', alignItems: 'center', padding: '9px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none' };
const primaryBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none' };

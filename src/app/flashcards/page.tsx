'use client';

import { usePublicCollections } from '@/hooks/queries/useFlashcardCollections';
import { FlashCardCollection } from '@/types';
import Link from 'next/link';
import { Suspense, useState } from 'react';

const TYPE_ICONS = { text: '📝', image: '🖼', video: '🎬' };

function CollectionCard({ col }: { col: FlashCardCollection }) {
  return (
    <Link href={`/flashcards/${col.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)', overflow: 'hidden' }}>
      {/* Color band */}
      <div style={{ background: col.coverColor, padding: '22px 20px', borderBottom: '2px solid var(--p-ink)', position: 'relative', minHeight: 120 }}>
        {/* Layered card stack */}
        <div style={{ position: 'absolute', right: 16, top: 16, transform: 'rotate(8deg)', width: 64, height: 82, background: 'var(--p-bg)', border: '2px solid var(--p-ink)', borderRadius: 10, boxShadow: '3px 3px 0 var(--p-ink)' }} />
        <div style={{ position: 'absolute', right: 22, top: 22, transform: 'rotate(2deg)', width: 64, height: 82, background: 'var(--p-bg)', border: '2px solid var(--p-ink)', borderRadius: 10 }} />
        <div style={{ position: 'absolute', right: 28, top: 28, transform: 'rotate(-4deg)', width: 64, height: 82, background: col.coverColor, border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, color: 'var(--p-ink)' }}>
          {col.cardCount}
        </div>
        <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--p-ink)' }}>{(col.subjectName ?? col.level).toUpperCase()}</span>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {col.isBestseller && <span style={{ display: 'inline-flex', padding: '2px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontSize: 10, background: 'var(--p-ink)', color: 'var(--p-bg)', fontFamily: 'var(--font-mono,monospace)' }}>★ bestseller</span>}
          {col.isNew && <span style={{ display: 'inline-flex', padding: '2px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontSize: 10, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-mono,monospace)' }}>new</span>}
        </div>
      </div>
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 17, lineHeight: 1.3, marginBottom: 6, color: 'var(--p-ink)' }}>{col.title}</h3>
        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginBottom: 10 }}>by {col.tutorName}</div>
        {col.rating && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, fontSize: 13 }}>
            <span style={{ color: 'var(--p-secondary)' }}>★★★★★</span>
            <span style={{ fontWeight: 600, color: 'var(--p-ink)' }}>{col.rating}</span>
            <span style={{ color: 'var(--p-muted)' }}>· {col.soldCount} sold</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 14, fontSize: 12, color: 'var(--p-muted)', fontFamily: 'var(--font-mono,monospace)' }}>
          {col.cardCount} cards
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px dashed var(--p-ink)', paddingTop: 14 }}>
          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)' }}>
            {col.visibility === 'public_free' ? 'Free' : `Rs. ${col.price.toLocaleString()}`}
          </div>
          <span style={{ padding: '8px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 12, boxShadow: '2px 2px 0 var(--p-ink)' }}>
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

function navBtn(bg: string, color: string): React.CSSProperties {
  return { padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: bg, color, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none', display: 'inline-block' };
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
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', fontWeight: 700, fontSize: 18, transform: 'rotate(-8deg)', fontFamily: 'var(--font-display,sans-serif)' }}>M</span>
            <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/marketplace" style={navBtn('var(--p-bg)', 'var(--p-ink)')}>Tests</Link>
            <Link href="/my-tests" style={navBtn('var(--p-primary)', 'var(--p-primary-ink)')}>My tests →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '56px 0 0', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 40px' }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginBottom: 16, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span><span>Flashcards</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 40, alignItems: 'center' }} className="fc-hero-grid">
            <div>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>Flashcard collections</span>
              <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--p-ink)', margin: '16px 0 18px' }}>
                Memorize the<br /><span style={{ color: 'var(--p-primary)' }}>tricky bits.</span>
              </h1>
              <p style={{ fontSize: 17, color: 'var(--p-ink-2)', maxWidth: 500, lineHeight: 1.6 }}>
                Curated decks from top tutors. Text, images, even short video clips. Swipe through on the go.
              </p>
            </div>
            <div style={{ padding: 22, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-card-c)', boxShadow: '6px 6px 0 var(--p-ink)', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 44 }}>🃏</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 28, color: 'var(--p-ink)' }}>From Rs. 500</div>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginTop: 4, letterSpacing: '0.06em' }}>ONE-TIME · KEEP FOREVER</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '30px 0 10px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search decks, topics, tutors…"
                style={{ width: '100%', padding: '12px 14px 12px 42px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, background: 'var(--p-bg)', color: 'var(--p-ink)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              style={{ padding: '12px 14px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, background: 'var(--p-bg)', color: 'var(--p-ink)', cursor: 'pointer', outline: 'none' }}>
              <option value="">All subjects</option>
              {subjects.map(s => <option key={s} value={s!}>{s}</option>)}
            </select>
          </div>
          {/* Subject chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <button onClick={() => setSubject('')}
              style={{ padding: '6px 14px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 12, cursor: 'pointer', background: !subject ? 'var(--p-ink)' : 'var(--p-bg)', color: !subject ? 'var(--p-bg)' : 'var(--p-ink)' }}>
              All · {collections.length}
            </button>
            {subjects.map(s => (
              <button key={s} onClick={() => setSubject(s === subject ? '' : s!)}
                style={{ padding: '6px 14px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 12, cursor: 'pointer', background: subject === s ? 'var(--p-ink)' : 'var(--p-bg)', color: subject === s ? 'var(--p-bg)' : 'var(--p-ink)' }}>
                {s} · {collections.filter(c => c.subjectName === s).length}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '24px 0 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>Loading collections…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>No collections found.</div>
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

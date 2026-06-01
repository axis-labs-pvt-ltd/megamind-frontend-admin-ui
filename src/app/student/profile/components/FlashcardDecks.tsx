// Client Component
'use client';

import { useMyCollectionPurchases } from '@/hooks/queries/useFlashcardCollections';
import Link from 'next/link';

export function FlashcardDecks() {
  const { data: purchases = [], isLoading } = useMyCollectionPurchases();

  return (
    <div style={{ marginTop: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)' }}>My flashcards</div>
          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 28, color: 'var(--p-ink)', marginTop: 10, letterSpacing: '-0.02em' }}>
            {purchases.length} deck{purchases.length !== 1 ? 's' : ''}{purchases.length > 0 && <span style={{ color: 'var(--p-primary)' }}> · {purchases.reduce((s, p) => s + (p.collection?.cardCount ?? 0), 0)} cards.</span>}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/flashcards" style={ghostBtn}>Browse store →</Link>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 220, borderRadius: 18, background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)' }} />)}
        </div>
      ) : purchases.length === 0 ? (
        <div style={{ padding: '50px 0', textAlign: 'center', border: '2px dashed var(--p-ink)', borderRadius: 18 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🃏</div>
          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)', marginBottom: 8 }}>No flashcard decks yet</div>
          <Link href="/flashcards" style={{ ...ghostBtn, display: 'inline-block', marginTop: 8 }}>Browse flashcards →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }} className="deck-grid">
          {purchases.map(p => {
            const col = p.collection;
            if (!col) return null;
            const pct = 0; // mastery tracking is future work
            return (
              <Link key={p.id} href={`/flashcards/${p.collectionId}/study`}
                style={{ border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '4px 4px 0 var(--p-ink)', overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
                {/* Cover band */}
                <div style={{ background: col.coverColor, padding: '18px', borderBottom: '2px solid var(--p-ink)', position: 'relative', minHeight: 110, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink)' }}>{col.subjectName ?? col.level}</span>
                  <div style={{ fontSize: 36, lineHeight: 1 }}>{col.coverEmoji}</div>
                  {col.isNew && <span style={{ position: 'absolute', top: 12, right: 12, padding: '2px 8px', border: '1.5px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 9, fontWeight: 700 }}>NEW</span>}
                </div>
                {/* Body */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.3, marginBottom: 6 }}>{col.title}</h3>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginBottom: 14 }}>{col.cardCount} cards · {col.tutorName}</div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono,monospace)', fontSize: 10, marginBottom: 6, fontWeight: 600, color: 'var(--p-ink-2)' }}>
                    <span>Study →</span><span>{col.cardCount} cards</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--p-bg-alt)', border: '1.5px solid var(--p-ink)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--p-primary)', borderRadius: 999 }} />
                  </div>
                </div>
              </Link>
            );
          })}
          <style>{`@media(max-width:960px){.deck-grid{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:560px){.deck-grid{grid-template-columns:1fr!important;}}`}</style>
        </div>
      )}
    </div>
  );
}

const ghostBtn: React.CSSProperties = { padding: '8px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' };

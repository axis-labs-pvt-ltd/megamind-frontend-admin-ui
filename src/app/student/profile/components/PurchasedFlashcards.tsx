// Client Component
'use client';

import { useMyCollectionPurchases } from '@/hooks/queries/useFlashcardCollections';
import Link from 'next/link';

export function PurchasedFlashcards() {
  const { data: purchases = [], isLoading } = useMyCollectionPurchases();

  if (isLoading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
      {[1, 2, 3].map(i => <div key={i} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, height: 200, background: 'var(--p-bg-alt)' }} />)}
    </div>
  );

  if (purchases.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🃏</div>
      <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>No flashcard decks yet</div>
      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)', marginBottom: 22 }}>Browse flashcard collections to start studying on the go.</div>
      <Link href="/flashcards" style={primaryBtn}>Browse flashcards →</Link>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="pf-grid">
      {purchases.map((p) => {
        const col = p.collection;
        if (!col) return null;
        return (
          <div key={p.id} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '5px 5px 0 var(--p-ink)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Cover */}
            <div style={{ background: col.coverColor, padding: '22px 20px', borderBottom: '2px solid var(--p-ink)', position: 'relative', minHeight: 100 }}>
              {/* Stacked card visual */}
              <div style={{ position: 'absolute', right: 14, top: 14, transform: 'rotate(6deg)', width: 52, height: 66, background: 'var(--p-bg)', border: '2px solid var(--p-ink)', borderRadius: 8, boxShadow: '2px 2px 0 var(--p-ink)' }} />
              <div style={{ position: 'absolute', right: 20, top: 20, transform: 'rotate(-3deg)', width: 52, height: 66, background: col.coverColor, border: '2px solid var(--p-ink)', borderRadius: 8, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)' }}>{col.cardCount}</div>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink)' }}>{col.subjectName ?? col.level}</span>
            </div>
            {/* Body */}
            <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.3, marginBottom: 6 }}>{col.title}</h3>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginBottom: 12 }}>by {col.tutorName} · {col.cardCount} cards</div>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginBottom: 14 }}>
                Purchased {new Date(p.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ flex: 1 }} />
              <Link href={`/flashcards/${p.collectionId}/study`}
                style={{ display: 'block', textAlign: 'center', padding: '10px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '2px 2px 0 var(--p-ink)' }}>
                Study now →
              </Link>
            </div>
          </div>
        );
      })}
      <style>{`@media(max-width:900px){.pf-grid{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:580px){.pf-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

const primaryBtn: React.CSSProperties = { display: 'inline-block', padding: '11px 24px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '3px 3px 0 var(--p-ink)' };

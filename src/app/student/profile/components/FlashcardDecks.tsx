// Client Component
'use client';

import { useMyCollectionPurchases } from '@/hooks/queries/useFlashcardCollections';
import Link from 'next/link';

const TINTS: Record<string, [string, string]> = {
  Physics:     ['var(--p-peach)',  'var(--p-ink-peach)'],
  Chemistry:   ['var(--p-mint)',   'var(--p-ink-mint)'],
  ICT:         ['var(--p-blue)',   'var(--p-ink-blue)'],
  Mathematics: ['var(--p-lav)',    'var(--p-ink-lav)'],
  English:     ['var(--p-yellow)', 'var(--p-ink-yellow)'],
};

export function FlashcardDecks() {
  const { data: purchases = [], isLoading } = useMyCollectionPurchases();

  return (
    <div style={{ marginTop: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)', marginBottom: 8 }}>
            <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />My flashcards
          </div>
          <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 28, color: 'var(--p-ink)', letterSpacing: '-0.015em' }}>
            {purchases.length} deck{purchases.length !== 1 ? 's' : ''}{purchases.length > 0 && <span style={{ color: 'var(--p-primary)' }}> · {purchases.reduce((s, p) => s + (p.collection?.cardCount ?? 0), 0)} cards.</span>}
          </h2>
        </div>
        <Link href="/flashcards" style={ghostBtn}>Browse store →</Link>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 220, borderRadius: 20, background: 'var(--p-bg-alt)' }} />)}
        </div>
      ) : purchases.length === 0 ? (
        <div style={{ padding: '50px 0', textAlign: 'center', border: '1.5px dashed var(--p-line-2)', borderRadius: 20, background: '#fff' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🃏</div>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 18, color: 'var(--p-ink)', marginBottom: 8 }}>No flashcard decks yet</div>
          <Link href="/flashcards" style={{ ...ghostBtn, display: 'inline-block', marginTop: 8 }}>Browse flashcards →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }} className="deck-grid">
          {purchases.map(p => {
            const col = p.collection;
            if (!col) return null;
            const [tint, ink] = TINTS[col.subjectName ?? ''] ?? ['var(--p-bg-alt)', 'var(--p-ink-2)'];
            return (
              <Link key={p.id} href={`/flashcards/${p.collectionId}/study`}
                style={{ border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', transition: 'transform .15s, box-shadow .15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = 'var(--p-shadow-lg)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = 'var(--p-shadow-sm)'; }}>
                {/* Cover band */}
                <div style={{ background: tint, padding: '18px', position: 'relative', minHeight: 110, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: ink }}>{col.subjectName ?? col.level}</span>
                  <div style={{ fontSize: 36, lineHeight: 1 }}>{col.coverEmoji}</div>
                  {col.isNew && <span style={{ position: 'absolute', top: 12, right: 12, padding: '2px 9px', borderRadius: 999, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 9, fontWeight: 800 }}>New</span>}
                </div>
                {/* Body */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.3, marginBottom: 5 }}>{col.title}</h3>
                  <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 11, color: 'var(--p-muted)', marginBottom: 14 }}>{col.cardCount} cards · {col.tutorName}</div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, marginBottom: 7, color: 'var(--p-primary)' }}>
                    <span>Study →</span><span style={{ color: 'var(--p-muted)' }}>{col.cardCount} cards</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'var(--p-line)', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: '0%', background: 'var(--p-primary)', borderRadius: 999 }} />
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

const ghostBtn: React.CSSProperties = { padding: '9px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none' };

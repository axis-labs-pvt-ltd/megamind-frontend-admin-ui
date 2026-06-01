'use client';

import { useConfetti } from '@/hooks/useConfetti';
import { useCollectionById } from '@/hooks/queries/useFlashcardCollections';
import { useFlashcardsByCollection } from '@/hooks/queries/useFlashcards';
import { FlashCard } from '@/types';
import Link from 'next/link';
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SwipeCard } from './components/SwipeCard';

function StudyContent({ id }: { id: string }) {
  const params = useSearchParams();
  const isSample = params.get('sample') === 'true';
  const { data: col } = useCollectionById(id);
  const { data: allCards = [], isLoading } = useFlashcardsByCollection(id);

  const cards: FlashCard[] = useMemo(() => isSample ? allCards.slice(0, 5) : allCards, [allCards, isSample]);
  const [idx, setIdx] = useState(0);
  const [knew, setKnew] = useState(0);
  const [review, setReview] = useState(0);
  const [exiting, setExiting] = useState<{ dir: 'left' | 'right' } | null>(null);
  const { fireFlashcardComplete } = useConfetti();
  const firedRef = useRef(false);

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    if (dir === 'right') setKnew(k => k + 1);
    else setReview(r => r + 1);
    setExiting({ dir });
    setTimeout(() => { setExiting(null); setIdx(i => i + 1); }, 300);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleSwipe('right');
      else if (e.key === 'ArrowLeft') handleSwipe('left');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSwipe]);

  const progress = cards.length ? Math.round((idx / cards.length) * 100) : 0;
  const isComplete = idx >= cards.length && cards.length > 0;

  useEffect(() => {
    if (isComplete && !firedRef.current) {
      firedRef.current = true;
      fireFlashcardComplete();
    }
  }, [isComplete, fireFlashcardComplete]);
  const coverColor = col?.coverColor ?? '#FFF2DD';

  return (
    <div style={{ background: 'var(--p-bg-alt, #FFF2DD)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Study bar */}
      <div style={{ background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href={`/flashcards/${id}`} style={{ padding: '7px 14px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 12, color: 'var(--p-ink)', textDecoration: 'none', background: 'var(--p-bg)', boxShadow: '2px 2px 0 var(--p-ink)' }}>← Exit</Link>
          <div>
            <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-ink)' }}>{col?.title ?? '…'}{isSample ? ' · Sample' : ''}</div>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginTop: 2 }}>by {col?.tutorName} · {cards.length} cards</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-ink)' }}>{Math.min(idx + 1, cards.length)} / {cards.length}</span>
          <div style={{ width: 140, height: 6, background: 'var(--p-ink)', opacity: 0.12, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: progress + '%', background: 'var(--p-primary)', borderRadius: 999, transition: 'width .3s ease' }} />
          </div>
        </div>
      </div>

      <main style={{ flex: 1, padding: '40px 0 24px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 24px' }}>
          {/* Stats strip */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {[{ val: knew, lbl: 'I knew it', color: '#2D6A4F' }, { val: review, lbl: 'Review again', color: '#D94A3D' }, { val: Math.max(0, cards.length - idx), lbl: 'Remaining', color: 'var(--p-ink)' }].map(s => (
              <div key={s.lbl} style={{ flex: 1, padding: '12px 14px', textAlign: 'center', border: '2px solid var(--p-ink)', borderRadius: 14, background: 'var(--p-bg)', boxShadow: '3px 3px 0 var(--p-ink)' }}>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Card stage */}
          <div style={{ position: 'relative', height: 520, marginBottom: 32 }}>
            {isLoading ? (
              <div style={{ display: 'grid', placeItems: 'center', height: '100%', fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>Loading…</div>
            ) : isComplete ? (
              <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--p-ink)', borderRadius: 24, background: 'var(--p-ink)', color: 'var(--p-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32, boxShadow: '6px 6px 0 rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 32, marginBottom: 10 }}>Deck complete!</h2>
                <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 24 }}>{knew} known · {review} to review</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => { setIdx(0); setKnew(0); setReview(0); }} style={{ padding: '12px 22px', border: '2px solid var(--p-bg)', borderRadius: 999, background: 'var(--p-secondary)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Restart
                  </button>
                  <Link href={`/flashcards/${id}`} style={{ padding: '12px 22px', border: '2px solid var(--p-bg)', borderRadius: 999, background: 'transparent', color: 'var(--p-bg)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    Back to deck
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {[2, 1, 0].map(offset => {
                  const cardIdx = idx + offset;
                  if (cardIdx >= cards.length) return null;
                  return (
                    <SwipeCard
                      key={cardIdx}
                      card={cards[cardIdx]}
                      index={idx}
                      total={cards.length}
                      stackOffset={offset}
                      coverColor={coverColor}
                      onSwipe={offset === 0 ? handleSwipe : () => {}}
                    />
                  );
                })}
              </>
            )}
          </div>

          {/* Action buttons */}
          {!isComplete && !isLoading && (
            <>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => handleSwipe('left')} style={{ padding: '14px 24px', minWidth: 130, border: '2px solid #D94A3D', borderRadius: 999, background: 'var(--p-bg)', color: '#D94A3D', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 #D94A3D' }}>
                  ← Review
                </button>
                <button onClick={() => {}} style={{ padding: '14px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' }}>
                  ↺ Flip
                </button>
                <button onClick={() => handleSwipe('right')} style={{ padding: '14px 24px', minWidth: 130, border: '2px solid var(--p-ink)', borderRadius: 999, background: '#2D6A4F', color: '#fff', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' }}>
                  I knew it →
                </button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 14, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>
                tip: drag the card · tap to flip · ← / → arrow keys
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Suspense><StudyContent id={id} /></Suspense>;
}

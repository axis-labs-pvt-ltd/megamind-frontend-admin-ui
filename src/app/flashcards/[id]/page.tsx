'use client';

import { useCollectionById, useCollectionAccess, usePurchaseCollection } from '@/hooks/queries/useFlashcardCollections';
import { useFlashcardsByCollection } from '@/hooks/queries/useFlashcards';
import { useAuth } from '@/contexts/authcontext';
import Link from 'next/link';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

function navBtn(bg: string, color: string): React.CSSProperties {
  return { padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: bg, color, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none', display: 'inline-block' };
}

const TYPE_LABEL: Record<string, string> = { text: '📝 TEXT', image: '🖼 IMAGE', video: '🎬 VIDEO' };

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { data: col, isLoading } = useCollectionById(id);
  const { data: cards = [] } = useFlashcardsByCollection(id);
  const { data: hasAccess } = useCollectionAccess(id);
  const purchase = usePurchaseCollection();
  const [buySuccess, setBuySuccess] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!user) { router.push('/auth/signin'); return; }
    setBuyError(null);
    try {
      await purchase.mutateAsync({ collectionId: id, price: col?.price ?? 0 });
      setBuySuccess(true);
    } catch (err: any) { setBuyError(err.message); }
  };

  const canStudy = hasAccess || col?.visibility === 'public_free';
  const sampleCards = cards.slice(0, 5);

  if (isLoading) return <div style={{ background: 'var(--p-bg)', minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>Loading…</div>;
  if (!col) return <div style={{ background: 'var(--p-bg)', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Not found.</div>;

  return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/flashcards" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/flashcards" style={navBtn('var(--p-bg)', 'var(--p-ink)')}>← All decks</Link>
            {canStudy && <Link href={`/flashcards/${id}/study`} style={navBtn('var(--p-primary)', 'var(--p-primary-ink)')}>Study now →</Link>}
          </div>
        </div>
      </nav>

      <section style={{ padding: '50px 0', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link> /
            <Link href="/flashcards" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Flashcards</Link> /
            <span>{col.title}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 50, alignItems: 'start' }} className="fcd-grid">
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                {col.subjectName && <span style={{ padding: '4px 12px', border: '2px solid var(--p-ink)', borderRadius: 999, fontSize: 12, background: col.coverColor, fontFamily: 'var(--font-mono,monospace)' }}>{col.subjectName}</span>}
                <span style={{ padding: '4px 12px', border: '2px solid var(--p-ink)', borderRadius: 999, fontSize: 12, fontFamily: 'var(--font-mono,monospace)' }}>{col.level.split(' ')[0]}</span>
                {col.isBestseller && <span style={{ padding: '4px 12px', border: '2px solid var(--p-ink)', borderRadius: 999, fontSize: 12, background: 'var(--p-ink)', color: 'var(--p-bg)', fontFamily: 'var(--font-mono,monospace)' }}>★ bestseller</span>}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--p-ink)', marginBottom: 18 }}>
                {col.title}
              </h1>
              {col.rating && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 18, fontSize: 15 }}>
                  <span style={{ color: 'var(--p-secondary)', fontSize: 18 }}>★★★★★</span>
                  <span style={{ fontWeight: 600, color: 'var(--p-ink)' }}>{col.rating}</span>
                  <span style={{ color: 'var(--p-muted)' }}>· {col.soldCount} students · by {col.tutorName}</span>
                </div>
              )}
              <p style={{ fontSize: 17, color: 'var(--p-ink-2)', maxWidth: 560, lineHeight: 1.6 }}>{col.description}</p>
              <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
                {[{ icon: '📝', count: cards.filter(c => c.type === 'text').length, label: 'text cards' }, { icon: '����', count: cards.filter(c => c.type === 'image').length, label: 'image cards' }, { icon: '🎬', count: cards.filter(c => c.type === 'video').length, label: 'video cards' }].filter(t => t.count > 0).map(t => (
                  <div key={t.label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, border: '2px solid var(--p-ink)', borderRadius: 10, background: col.coverColor, display: 'grid', placeItems: 'center', fontSize: 16 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-ink)' }}>{t.count} {t.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase card */}
            <div style={{ padding: 24, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)', position: 'sticky', top: 90 }}>
              {buySuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>Purchase complete!</div>
                  <Link href={`/flashcards/${id}/study`} style={{ ...navBtn('var(--p-primary)', 'var(--p-primary-ink)'), display: 'block', textAlign: 'center' }}>Start studying →</Link>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 40, lineHeight: 1, marginBottom: 4, color: 'var(--p-ink)' }}>
                    {col.visibility === 'public_free' ? 'Free' : `Rs. ${col.price.toLocaleString()}`}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginBottom: 20, letterSpacing: '0.06em' }}>ONE-TIME · KEEP FOREVER</div>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 20, padding: '14px', background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)', borderRadius: 12 }}>
                    {[{ val: col.cardCount, lbl: 'Cards' }, { val: '~' + Math.ceil(col.cardCount * 0.5), lbl: 'Min/run' }, { val: '∞', lbl: 'Replays' }].map(s => (
                      <div key={s.lbl} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)' }}>{s.val}</div>
                        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--p-muted)', marginTop: 3 }}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  {canStudy ? (
                    <Link href={`/flashcards/${id}/study`} style={{ ...navBtn('var(--p-primary)', 'var(--p-primary-ink)'), display: 'block', textAlign: 'center', padding: '15px 24px', fontSize: 15, boxShadow: '4px 4px 0 var(--p-ink)' }}>
                      Study now →
                    </Link>
                  ) : (
                    <>
                      <button onClick={handleBuy} disabled={purchase.isPending}
                        style={{ width: '100%', padding: '15px 24px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '4px 4px 0 var(--p-ink)', marginBottom: 10, opacity: purchase.isPending ? 0.7 : 1 }}>
                        {purchase.isPending ? 'Processing…' : !user ? 'Sign in to buy →' : `Buy now · Rs. ${col.price.toLocaleString()} →`}
                      </button>
                      {sampleCards.length > 0 && (
                        <Link href={`/flashcards/${id}/study?sample=true`} style={{ ...navBtn('var(--p-bg)', 'var(--p-ink)'), display: 'block', textAlign: 'center' }}>
                          Try 5 sample cards
                        </Link>
                      )}
                    </>
                  )}
                  {buyError && <div style={{ marginTop: 10, padding: '10px 14px', border: '1.5px solid var(--p-accent)', borderRadius: 10, fontSize: 13, color: 'var(--p-accent)', background: 'rgba(232,84,28,.08)' }}>{buyError}</div>}
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1.5px dashed var(--p-ink)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--p-muted)' }}>
                    {['Lifetime access on all devices', 'Swipe anywhere, even offline', 'Theory snippet on every card back'].map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--p-primary)' }}>✓</span>{f}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sample preview */}
      {sampleCards.length > 0 && (
        <section style={{ padding: '60px 0', background: 'var(--p-bg-alt)', borderTop: '2px solid var(--p-ink)', borderBottom: '2px solid var(--p-ink)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>Preview</span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 36, color: 'var(--p-ink)', marginTop: 12, marginBottom: 24 }}>5 sample cards.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }} className="sample-grid">
              {sampleCards.map((card, i) => (
                <div key={card.id} style={{ border: '2px solid var(--p-ink)', borderRadius: 14, overflow: 'hidden', transform: `rotate(${[-2, 1, -1, 2, -1][i]}deg)`, aspectRatio: '3/4', display: 'flex', flexDirection: 'column', background: col.coverColor, boxShadow: '4px 4px 0 var(--p-ink)' }}>
                  <div style={{ padding: '10px 12px', borderBottom: '2px solid var(--p-ink)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700 }}>{TYPE_LABEL[card.type]}</span>
                    <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)' }}>{i + 1}/5</span>
                  </div>
                  <div style={{ flex: 1, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    {card.type === 'video' ? <div style={{ fontSize: 40 }}>🎥</div> : card.type === 'image' && card.imageUrl ? <img src={card.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 80, objectFit: 'contain', borderRadius: 6 }} /> : null}
                    <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 16, lineHeight: 1.2, color: 'var(--p-ink)' }}>{card.front}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              {canStudy && <Link href={`/flashcards/${id}/study`} style={{ ...navBtn('var(--p-primary)', 'var(--p-primary-ink)'), fontSize: 14 }}>Try the full study experience →</Link>}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 960px) { .fcd-grid { grid-template-columns: 1fr !important; } .sample-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 600px) { .sample-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}

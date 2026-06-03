'use client';

import { useAuth } from '@/contexts/authcontext';
import { useActiveTests } from '@/hooks/queries/useTests';
import { usePurchaseTest } from '@/hooks/queries/usePurchases';
import { Test } from '@/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const TINTS = [
  ['var(--p-peach)',  'var(--p-ink-peach)'],
  ['var(--p-blue)',   'var(--p-ink-blue)'],
  ['var(--p-mint)',   'var(--p-ink-mint)'],
  ['var(--p-lav)',    'var(--p-ink-lav)'],
  ['var(--p-yellow)', 'var(--p-ink-yellow)'],
];

function getQuestionCount(t: Test) {
  return t.type === 'static' ? t.questionIds.length : t.rules.reduce((s, r) => s + r.questionCount, 0);
}
function getPrice(count: number) {
  if (count <= 20) return 1000;
  if (count <= 40) return 1500;
  return 2000;
}
function getEmoji(tags: string[]) {
  const t = tags.join(' ').toLowerCase();
  if (t.includes('physics')) return '⚛️';
  if (t.includes('chemistry')) return '🧪';
  if (t.includes('math')) return '📐';
  if (t.includes('ict') || t.includes('computer')) return '💻';
  if (t.includes('english')) return '📝';
  if (t.includes('biology')) return '🌿';
  return '📋';
}

function MarketplaceContent() {
  const router   = useRouter();
  const params   = useSearchParams();
  const { user } = useAuth();
  const { data: tests = [], isLoading: loading } = useActiveTests();
  const purchaseMutation = usePurchaseTest();
  const [search, setSearch]     = useState('');
  const [buying, setBuying]     = useState<Test | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState(false);

  useEffect(() => {
    const testId = params.get('testId');
    if (testId && tests.length > 0) {
      const t = tests.find(x => x.id === testId);
      if (t) setBuying(t);
    }
  }, [params, tests]);

  const filtered = tests.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.tags ?? []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBuy = async () => {
    if (!buying) return;
    if (!user) { router.push('/auth/signin'); return; }
    setBuyError(null);
    try {
      await purchaseMutation.mutateAsync({ testId: buying.id, price: getPrice(getQuestionCount(buying)) });
      setBuySuccess(true);
      setTimeout(() => { setBuying(null); setBuySuccess(false); router.push('/my-tests'); }, 1800);
    } catch (err: any) {
      setBuyError(err.message ?? 'Purchase failed');
    }
  };

  return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(160%) blur(10px)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 17, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
            megamind
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            {user ? (
              <>
                <Link href="/my-tests"       style={ghostNavBtn}>My Tests</Link>
                <Link href="/student/profile" style={primaryNavBtn}>Profile →</Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin" style={ghostNavBtn}>Log in</Link>
                <Link href="/auth/signup" style={primaryNavBtn}>Start free →</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '44px 0 0', background: 'var(--p-bg-alt)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 40px' }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-muted)', marginBottom: 24, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span><span>Test store</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
            <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Test marketplace
          </div>
          <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,56px)', letterSpacing: '-0.015em', lineHeight: 1.08, color: 'var(--p-ink)', marginBottom: 24 }}>
            No subscription?{' '}
            <span style={{ color: 'var(--p-primary)', position: 'relative', display: 'inline-block' }}>
              No problem.
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 8, background: 'var(--p-primary)', opacity: 0.22, borderRadius: 6, zIndex: -1 }} />
            </span>
          </h1>
          <div style={{ position: 'relative', maxWidth: 520 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--p-muted)' }} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests, topics…"
              style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, background: '#fff', color: 'var(--p-ink)', outline: 'none', boxSizing: 'border-box', boxShadow: 'var(--p-shadow-sm)' }} />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '44px 0 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15, color: 'var(--p-muted)' }}>Loading tests…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15, color: 'var(--p-muted)' }}>No tests found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="mp-grid">
              {filtered.map((t, i) => {
                const qCount = getQuestionCount(t);
                const price  = getPrice(qCount);
                const [tint, ink] = TINTS[i % TINTS.length];
                const emoji  = getEmoji(t.tags ?? []);
                return (
                  <div key={t.id} style={{ border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform .15s, box-shadow .15s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = 'var(--p-shadow-lg)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = 'var(--p-shadow-sm)'; }}>
                    <div style={{ background: tint, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: ink }}>
                        {emoji} {(t.tags?.[0] ?? 'General').toUpperCase()}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 11px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, background: 'rgba(255,255,255,0.7)', color: ink }}>
                        {t.type === 'dynamic' ? 'AI' : 'Fixed'}
                      </span>
                    </div>
                    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 18, fontWeight: 800, lineHeight: 1.3, marginBottom: 10, color: 'var(--p-ink)' }}>{t.title}</h3>
                      {t.description && <p style={{ fontSize: 13, color: 'var(--p-ink-2)', lineHeight: 1.6, marginBottom: 12 }}>{t.description}</p>}
                      <div style={{ display: 'flex', gap: 16, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12, color: 'var(--p-muted)' }}>
                        <span>📋 {qCount} questions</span>
                        <span>⏱ {t.timeLimit} min</span>
                      </div>
                      {t.tags && t.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                          {t.tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{ padding: '3px 11px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)' }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--p-line)', paddingTop: 16 }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 3 }}>One-time</div>
                          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>Rs. {price.toLocaleString()}</div>
                        </div>
                        <button onClick={() => setBuying(t)} style={buyBtn}>Buy →</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Purchase modal */}
      {buying && (
        <div className="mp-modal-wrap" style={{ position: 'fixed', inset: 0, background: 'rgba(30,34,48,0.42)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="mp-modal" style={{ background: '#fff', border: '1px solid var(--p-line)', borderRadius: 24, boxShadow: 'var(--p-shadow-lg)', maxWidth: 460, width: '100%', overflow: 'hidden' }}>
            <div style={{ background: 'var(--p-bg-alt)', borderBottom: '1px solid var(--p-line)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-ink-2)' }}>Confirm purchase</span>
              <button onClick={() => { setBuying(null); setBuyError(null); setBuySuccess(false); }} style={{ width: 32, height: 32, border: '1px solid var(--p-line-2)', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 16, color: 'var(--p-ink)', boxShadow: 'var(--p-shadow-sm)' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              {buySuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>Purchase complete!</div>
                  <div style={{ fontSize: 13, color: 'var(--p-ink-2)' }}>Redirecting to My Tests…</div>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 20, color: 'var(--p-ink)', marginBottom: 6 }}>{buying.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--p-ink-2)', marginBottom: 20 }}>{getQuestionCount(buying)} questions · {buying.timeLimit} min</div>
                  <div style={{ display: 'flex', gap: 0, border: '1px solid var(--p-line)', borderRadius: 14, overflow: 'hidden', marginBottom: 20, background: 'var(--p-bg-alt)' }}>
                    {[['Rs. ' + getPrice(getQuestionCount(buying)).toLocaleString(), 'Price'], ['∞', 'Access'], [String(buying.passingScore) + '%', 'Pass mark']].map(([val, lbl], i) => (
                      <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '14px 10px', borderLeft: i > 0 ? '1px solid var(--p-line)' : 'none' }}>
                        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 20, color: 'var(--p-ink)' }}>{val}</div>
                        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--p-muted)', marginTop: 4 }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, fontSize: 14, color: 'var(--p-ink-2)' }}>
                    {['Lifetime access to this test', 'AI-powered feedback on every answer', 'Theory snippets for every question'].map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--p-primary)', fontWeight: 800 }}>✓</span>{f}</div>
                    ))}
                  </div>
                  {buyError && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#b91c1c', marginBottom: 16 }}>{buyError}</div>}
                  {!user && <div style={{ padding: '10px 14px', background: 'var(--p-peach)', border: '1px solid var(--p-line)', borderRadius: 10, fontSize: 13, color: 'var(--p-ink)', marginBottom: 16 }}>⚠ You need to sign in to purchase.</div>}
                  <button onClick={handleBuy} disabled={purchaseMutation.isPending} style={{ width: '100%', padding: '15px 24px', border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--p-shadow-orange)', opacity: purchaseMutation.isPending ? 0.75 : 1 }}>
                    {purchaseMutation.isPending ? 'Processing…' : !user ? 'Sign in to buy →' : `Buy now · Rs. ${getPrice(getQuestionCount(buying)).toLocaleString()} →`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) { .mp-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) {
          .mp-grid { grid-template-columns: 1fr !important; }
          .mp-modal-wrap { align-items: flex-end !important; padding: 0 !important; }
          .mp-modal { border-radius: 20px 20px 0 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

const ghostNavBtn: React.CSSProperties   = { padding: '9px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none', display: 'inline-block' };
const primaryNavBtn: React.CSSProperties = { padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none', display: 'inline-block' };
const buyBtn: React.CSSProperties        = { padding: '11px 20px', border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--p-shadow-orange)' };

export default function MarketplacePage() {
  return <Suspense><MarketplaceContent /></Suspense>;
}

'use client';

import { useAuth } from '@/contexts/authcontext';
import { useActiveTests } from '@/hooks/queries/useTests';
import { usePurchaseTest } from '@/hooks/queries/usePurchases';
import { Test } from '@/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const BAND_COLORS = ['var(--p-card-a)', 'var(--p-card-c)', 'var(--p-card-d)', 'var(--p-card-e)', 'var(--p-card-b)'];

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

  // Auto-open purchase modal if testId param is present
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
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', fontSize: 18, fontWeight: 700, transform: 'rotate(-8deg)', fontFamily: 'var(--font-display,sans-serif)' }}>M</span>
            <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            {user ? (
              <>
                <Link href="/my-tests" style={navBtn('var(--p-bg)', 'var(--p-ink)')}>My Tests</Link>
                <Link href="/student/profile" style={navBtn('var(--p-primary)', 'var(--p-primary-ink)')}>Profile →</Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin" style={navBtn('var(--p-bg)', 'var(--p-ink)')}>Log in</Link>
                <Link href="/auth/signup" style={navBtn('var(--p-primary)', 'var(--p-primary-ink)')}>Start free →</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '56px 0 0', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 40px' }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginBottom: 28, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span><span>Test store</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,5vw,64px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--p-ink)', marginBottom: 20 }}>
            No subscription?{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              No problem.
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%232D6A4F' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
            </span>
          </h1>
          <div style={{ position: 'relative', maxWidth: 520 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests, topics…"
              style={{ width: '100%', padding: '14px 16px 14px 46px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, background: 'var(--p-bg)', color: 'var(--p-ink)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '44px 0 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>Loading tests…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>No tests found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="mp-grid">
              {filtered.map((t, i) => {
                const qCount = getQuestionCount(t);
                const price  = getPrice(qCount);
                const color  = BAND_COLORS[i % BAND_COLORS.length];
                const emoji  = getEmoji(t.tags ?? []);
                return (
                  <div key={t.id} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ background: color, padding: '16px 20px', borderBottom: '2px solid var(--p-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 700, color: 'var(--p-ink)', letterSpacing: '0.08em' }}>
                        {emoji} {(t.tags?.[0] ?? 'General').toUpperCase()}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 9, background: 'var(--p-bg)', color: 'var(--p-ink)' }}>
                        {t.type === 'dynamic' ? 'AI' : 'Fixed'}
                      </span>
                    </div>
                    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 19, fontWeight: 700, lineHeight: 1.3, marginBottom: 12, color: 'var(--p-ink)' }}>{t.title}</h3>
                      {t.description && <p style={{ fontSize: 13, color: 'var(--p-ink-2)', lineHeight: 1.5, marginBottom: 14 }}>{t.description}</p>}
                      <div style={{ display: 'flex', gap: 18, marginBottom: 16, fontSize: 13, color: 'var(--p-ink-2)' }}>
                        <span>📋 {qCount} questions</span>
                        <span>⏱ {t.timeLimit} min</span>
                      </div>
                      {t.tags && t.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                          {t.tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{ padding: '3px 10px', borderRadius: 999, border: '1.5px solid var(--p-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)' }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px dashed var(--p-ink)', paddingTop: 16 }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>One-time</div>
                          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 24, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>Rs. {price.toLocaleString()}</div>
                        </div>
                        <button onClick={() => setBuying(t)} style={{ padding: '11px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' }}>
                          Buy →
                        </button>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--p-bg)', border: '2px solid var(--p-ink)', borderRadius: 20, boxShadow: '8px 8px 0 var(--p-ink)', maxWidth: 460, width: '100%', overflow: 'hidden' }}>
            <div style={{ background: 'var(--p-bg-alt)', borderBottom: '2px solid var(--p-ink)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink-2)' }}>Confirm purchase</span>
              <button onClick={() => { setBuying(null); setBuyError(null); setBuySuccess(false); }} style={{ width: 30, height: 30, border: '1.5px solid var(--p-ink)', borderRadius: 8, background: 'var(--p-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 16, color: 'var(--p-ink)' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              {buySuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>Purchase complete!</div>
                  <div style={{ fontSize: 13, color: 'var(--p-ink-2)' }}>Redirecting to My Tests…</div>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', marginBottom: 6 }}>{buying.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--p-ink-2)', marginBottom: 20 }}>{getQuestionCount(buying)} questions · {buying.timeLimit} min</div>
                  <div style={{ display: 'flex', gap: 16, padding: '16px 20px', background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)', borderRadius: 14, marginBottom: 20 }}>
                    {[['Rs. ' + getPrice(getQuestionCount(buying)).toLocaleString(), 'Price'], ['∞', 'Access'], [String(buying.passingScore) + '%', 'Pass mark']].map(([val, lbl]) => (
                      <div key={lbl} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)' }}>{val}</div>
                        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--p-muted)', marginTop: 4 }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--p-ink-2)' }}>
                    {['Lifetime access to this test', 'AI-powered feedback on every answer', 'Theory snippets for every question'].map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--p-primary)', fontWeight: 700 }}>✓</span>{f}</div>
                    ))}
                  </div>
                  {buyError && <div style={{ padding: '10px 14px', background: 'rgba(217,74,61,.08)', border: '1.5px solid var(--p-accent)', borderRadius: 10, fontSize: 13, color: 'var(--p-accent)', marginBottom: 16 }}>{buyError}</div>}
                  {!user && <div style={{ padding: '10px 14px', background: 'var(--p-card-a)', border: '1.5px solid var(--p-ink)', borderRadius: 10, fontSize: 13, color: 'var(--p-ink)', marginBottom: 16 }}>⚠ You need to sign in to purchase.</div>}
                  <button onClick={handleBuy} disabled={purchaseMutation.isPending} style={{ width: '100%', padding: '15px 24px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '4px 4px 0 var(--p-ink)', opacity: purchaseMutation.isPending ? 0.7 : 1 }}>
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
        @media (max-width: 600px) { .mp-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function navBtn(bg: string, color: string): React.CSSProperties {
  return { padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: bg, color, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none', display: 'inline-block' };
}

export default function MarketplacePage() {
  return <Suspense><MarketplaceContent /></Suspense>;
}

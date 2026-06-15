'use client';

import { useAuth } from '@/contexts/authcontext';
import { useActiveTests } from '@/hooks/queries/useTests';
import { usePurchaseTest } from '@/hooks/queries/usePurchases';
import { Test } from '@/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

const GRADE_TAGS = ['O/L', 'A/L', 'Uni entrance'];
const TINTS = [
  ['var(--p-peach)', 'var(--p-ink-peach)'],
  ['var(--p-blue)',  'var(--p-ink-blue)'],
  ['var(--p-mint)',  'var(--p-ink-mint)'],
  ['var(--p-lav)',   'var(--p-ink-lav)'],
  ['var(--p-yellow)','var(--p-ink-yellow)'],
  ['var(--p-pink)',  'var(--p-ink-pink)'],
];

function getQuestionCount(t: Test) {
  return t.type === 'static' ? t.questionIds.length : t.rules.reduce((s, r) => s + r.questionCount, 0);
}
function getPrice(count: number) {
  if (count <= 20) return 1000; if (count <= 40) return 1500; return 2000;
}
function getEmoji(tags: string[]) {
  const s = tags.join(' ').toLowerCase();
  if (s.includes('physics'))   return '⚛️';
  if (s.includes('chemistry')) return '🧪';
  if (s.includes('math'))      return '📐';
  if (s.includes('ict') || s.includes('computer')) return '💻';
  if (s.includes('english'))   return '📝';
  if (s.includes('biology'))   return '🌿';
  return '📋';
}
function isBestseller(t: Test) { return getQuestionCount(t) >= 40; }
function isNew(t: Test) { return Date.now() - new Date(t.createdAt).getTime() < 60 * 864e5; }

function MarketplaceContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();
  const { data: tests = [], isLoading: loading } = useActiveTests();
  const purchaseMutation = usePurchaseTest();

  const [search, setSearch]           = useState('');
  const [activeSubject, setActiveSub] = useState('');
  const [grade, setGrade]             = useState('');
  const [sort, setSort]               = useState('newest');
  const [buying, setBuying]           = useState<Test | null>(null);
  const [buyError, setBuyError]       = useState<string | null>(null);
  const [buySuccess, setBuySuccess]   = useState(false);

  useEffect(() => {
    const testId = params.get('testId');
    if (testId && tests.length > 0) { const t = tests.find(x => x.id === testId); if (t) setBuying(t); }
    const sub = params.get('subject');
    if (sub) setActiveSub(sub);
  }, [params, tests]);

  const subjects = useMemo(() => {
    const s = new Set<string>();
    tests.forEach(t => (t.tags ?? []).forEach(tag => { if (!GRADE_TAGS.includes(tag)) s.add(tag); }));
    return Array.from(s);
  }, [tests]);

  const filtered = useMemo(() => {
    let r = tests.filter(t => {
      const tags = t.tags ?? [];
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !tags.some(g => g.toLowerCase().includes(search.toLowerCase()))) return false;
      if (activeSubject && !tags.includes(activeSubject)) return false;
      if (grade && !tags.includes(grade)) return false;
      return true;
    });
    if (sort === 'newest')     r = [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === 'price-asc')  r = [...r].sort((a, b) => getPrice(getQuestionCount(a)) - getPrice(getQuestionCount(b)));
    if (sort === 'price-desc') r = [...r].sort((a, b) => getPrice(getQuestionCount(b)) - getPrice(getQuestionCount(a)));
    return r;
  }, [tests, search, activeSubject, grade, sort]);

  const handleBuy = async () => {
    if (!buying) return;
    if (!user) { router.push('/auth/signin'); return; }
    setBuyError(null);
    try {
      await purchaseMutation.mutateAsync({ testId: buying.id, price: getPrice(getQuestionCount(buying)) });
      setBuySuccess(true);
      setTimeout(() => { setBuying(null); setBuySuccess(false); router.push('/my-tests'); }, 1800);
    } catch (err: any) { setBuyError(err.message ?? 'Purchase failed'); }
  };

  return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>

      {/* Sticky nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(160%) blur(10px)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 17, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
            megamind
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            {user ? (
              <><Link href="/my-tests" style={ghostNavBtn}>My Tests</Link><Link href="/student/profile" style={primaryNavBtn}>Profile →</Link></>
            ) : (
              <><Link href="/auth/signin" style={ghostNavBtn}>Log in</Link><Link href="/auth/signup" style={primaryNavBtn}>Start free →</Link></>
            )}
          </div>
        </div>
      </nav>

      {/* Hero + filters */}
      <section style={{ padding: '44px 0 0', background: 'var(--p-bg-alt)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 40px' }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-muted)', marginBottom: 24, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span><span>Test store</span>
          </div>

          <div className="mk-hero">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
                <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Buy single tests
              </div>
              <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,52px)', letterSpacing: '-0.015em', lineHeight: 1.08, color: 'var(--p-ink)', marginBottom: 18, maxWidth: 640 }}>
                No subscription?{' '}
                <span style={{ color: 'var(--p-primary)', position: 'relative', display: 'inline-block' }}>
                  No problem.
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 8, background: 'var(--p-primary)', opacity: 0.22, borderRadius: 6, zIndex: -1 }} />
                </span>
              </h1>
              <p style={{ fontSize: 'clamp(14px,1.1vw,17px)', color: 'var(--p-ink-2)', lineHeight: 1.65, maxWidth: 540 }}>
                One-time purchase. Yours forever. Pick a test, pay Rs.1,000–2,000, and review your answers and theory anytime.
              </p>
            </div>

            {/* Bundle promo card */}
            <div style={{ padding: '18px 22px', border: '1px solid var(--p-line)', borderRadius: 20, background: 'var(--p-bg-warm)', display: 'flex', gap: 14, alignItems: 'center', boxShadow: 'var(--p-shadow-sm)' }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center', fontSize: 28, boxShadow: 'var(--p-shadow-sm)', flexShrink: 0 }}>🎁</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 17, color: 'var(--p-ink)', marginBottom: 4 }}>Bundle 3, save 15%</div>
                <div style={{ fontSize: 13.5, color: 'var(--p-ink-2)' }}>Use code <b style={{ color: 'var(--p-primary-dark)' }}>MIND3</b> at checkout.</div>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="mk-filters">
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--p-muted)', pointerEvents: 'none' }} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests, topics, syllabus…" style={filterInput} />
            </div>
            <select value={activeSubject} onChange={e => setActiveSub(e.target.value)} style={filterSelect}>
              <option value="">All subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={grade} onChange={e => setGrade(e.target.value)} style={filterSelect}>
              <option value="">All grades</option>
              <option value="O/L">O/L</option>
              <option value="A/L">A/L</option>
              <option value="Uni entrance">Uni entrance</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} style={filterSelect}>
              <option value="newest">Newest</option>
              <option value="popular">Most popular</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
          </div>
        </div>
      </section>

      {/* Pill filters + grid */}
      <section style={{ padding: '46px 0 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

          {subjects.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              <button onClick={() => setActiveSub('')} style={pill(!activeSubject)}>
                All <span style={{ opacity: 0.7 }}>· {tests.length}</span>
              </button>
              {subjects.map(s => (
                <button key={s} onClick={() => setActiveSub(activeSubject === s ? '' : s)} style={pill(activeSubject === s)}>
                  {s} · {tests.filter(t => t.tags?.includes(s)).length}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15, color: 'var(--p-muted)' }}>Loading tests…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15, color: 'var(--p-muted)' }}>No tests found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="mp-grid">
              {filtered.map((t, i) => {
                const qCount = getQuestionCount(t);
                const price  = getPrice(qCount);
                const [tint, ink] = TINTS[i % TINTS.length];
                const emoji  = getEmoji(t.tags ?? []);
                const subj   = (t.tags ?? []).find(tag => !GRADE_TAGS.includes(tag)) ?? 'General';
                return (
                  <div key={t.id} className="mp-card" style={{ border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ background: tint, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: ink }}>{emoji} {subj.toUpperCase()}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {isBestseller(t) && <span className="tc-flag dark">★ Bestseller</span>}
                        {isNew(t) && <span className="tc-flag new">New</span>}
                        <span className="tc-flag">{t.type === 'dynamic' ? 'AI' : 'Fixed'}</span>
                      </div>
                    </div>
                    <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 18, fontWeight: 800, lineHeight: 1.3, marginBottom: 12, color: 'var(--p-ink)' }}>{t.title}</h3>
                      {t.description && <p style={{ fontSize: 13, color: 'var(--p-ink-2)', lineHeight: 1.6, marginBottom: 12 }}>{t.description}</p>}
                      <div style={{ display: 'flex', gap: 18, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--p-ink-2)' }}>
                        <span>📋 {qCount} questions</span><span>⏱ {t.timeLimit} min</span>
                      </div>
                      {(t.tags ?? []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                          {(t.tags ?? []).slice(0, 3).map(tag => (
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
                  <div style={{ display: 'flex', border: '1px solid var(--p-line)', borderRadius: 14, overflow: 'hidden', marginBottom: 20, background: 'var(--p-bg-alt)' }}>
                    {[['Rs. ' + getPrice(getQuestionCount(buying)).toLocaleString(), 'Price'], ['∞', 'Access'], [String(buying.passingScore) + '%', 'Pass mark']].map(([val, lbl], idx) => (
                      <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '14px 10px', borderLeft: idx > 0 ? '1px solid var(--p-line)' : 'none' }}>
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
        .mk-hero { display:grid; grid-template-columns:1.6fr 1fr; gap:36px; align-items:center; margin-bottom:0; }
        .mk-filters { margin-top:32px; display:grid; grid-template-columns:1.6fr auto auto auto; gap:12px; align-items:center; }
        .mp-card { transition:transform .15s, box-shadow .15s; cursor:pointer; }
        .mp-card:hover { transform:translateY(-5px); box-shadow:var(--p-shadow-lg); }
        .tc-flag { background:rgba(255,255,255,0.8); color:var(--p-ink-2); font-family:var(--font-display,Nunito,sans-serif); font-weight:800; font-size:10.5px; padding:4px 9px; border-radius:999px; white-space:nowrap; }
        .tc-flag.dark { background:var(--p-ink); color:#fff; }
        .tc-flag.new { background:var(--p-primary); color:#fff; }
        @media (max-width:960px) {
          .mp-grid { grid-template-columns:repeat(2,1fr) !important; }
          .mk-filters { grid-template-columns:1fr !important; }
          .mk-hero { grid-template-columns:1fr; }
        }
        @media (max-width:600px) {
          .mp-grid { grid-template-columns:1fr !important; }
          .mp-modal-wrap { align-items:flex-end !important; padding:0 !important; }
          .mp-modal { border-radius:20px 20px 0 0 !important; max-width:100% !important; }
        }
      `}</style>
    </div>
  );
}

const pill = (active: boolean): React.CSSProperties => ({ padding: '9px 16px', borderRadius: 999, border: `1px solid ${active ? 'var(--p-primary)' : 'var(--p-line-2)'}`, background: active ? 'var(--p-primary)' : 'var(--p-bg)', color: active ? '#fff' : 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13.5, cursor: 'pointer', transition: 'all .12s' });
const filterInput: React.CSSProperties  = { width: '100%', padding: '12px 16px 12px 44px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, background: '#fff', color: 'var(--p-ink)', outline: 'none', boxSizing: 'border-box', boxShadow: 'var(--p-shadow-sm)' };
const filterSelect: React.CSSProperties = { padding: '12px 14px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, background: '#fff', color: 'var(--p-ink)', cursor: 'pointer', boxShadow: 'var(--p-shadow-sm)', whiteSpace: 'nowrap' };
const ghostNavBtn: React.CSSProperties   = { padding: '9px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none', display: 'inline-block' };
const primaryNavBtn: React.CSSProperties = { padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none', display: 'inline-block' };
const buyBtn: React.CSSProperties        = { padding: '11px 20px', border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--p-shadow-orange)' };

export default function MarketplacePage() {
  return <Suspense><MarketplaceContent /></Suspense>;
}

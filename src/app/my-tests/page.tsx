'use client';

import { useAuth } from '@/contexts/authcontext';
import { useMyPurchases, useSessionDetails, useStudentAttempts } from '@/hooks/queries/usePurchases';
import { TestHistory, StaticTest } from '@/types';
import { QuizResultScreen } from '@/app/tests/take-test/components/QuizResultScreen';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const C_OK  = '#1F8A5B';
const C_BAD = '#E0533D';
const TINTS = [
  ['var(--p-peach)','var(--p-ink-peach)'],
  ['var(--p-mint)','var(--p-ink-mint)'],
  ['var(--p-blue)','var(--p-ink-blue)'],
  ['var(--p-lav)','var(--p-ink-lav)'],
  ['var(--p-yellow)','var(--p-ink-yellow)'],
  ['var(--p-pink)','var(--p-ink-pink)'],
];

export default function MyTestsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'tests' | 'history'>('tests');
  const [viewingSession, setViewingSession] = useState<TestHistory | null>(null);

  const { data: purchases = [],  isLoading: purchasesLoading } = useMyPurchases();
  const { data: history   = [],  isLoading: historyLoading   } = useStudentAttempts(user?.id);
  const { data: sessionDetails, isLoading: detailsLoading, error: detailsError } = useSessionDetails(viewingSession?.id ?? null);
  const loading = purchasesLoading || historyLoading;

  useEffect(() => { if (!authLoading && !user) router.push('/auth/signin'); }, [user, authLoading, router]);
  if (authLoading || !user) return null;

  const fmt     = (sec: number) => `${Math.floor(sec / 60)}m ${sec % 60}s`;
  const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (viewingSession) {
    if (detailsLoading) return <Spinner label="Loading results…" />;
    if (detailsError || !sessionDetails) return (
      <div style={{ minHeight:'100vh', background:'var(--p-bg)', display:'grid', placeItems:'center', padding:'40px 28px' }}>
        <div style={{ textAlign:'center', maxWidth:420 }}>
          <div style={{ fontSize:40, marginBottom:14 }}>⚠️</div>
          <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:20, color:'var(--p-ink)', marginBottom:8 }}>Couldn't load results</div>
          <p style={{ color:'var(--p-ink-2)', fontSize:14, marginBottom:24 }}>{(detailsError as Error)?.message ?? 'Something went wrong.'}</p>
          <button onClick={() => setViewingSession(null)} style={btnPrimary}>← Back to history</button>
        </div>
      </div>
    );
    const fakeTest: StaticTest = { id:viewingSession.testId, title:viewingSession.testTitle, description:'', type:'static', questionIds:sessionDetails.questions.map(q => q.id), timeLimit:0, passingScore:viewingSession.passingScore, isActive:true, createdAt:viewingSession.completedAt };
    return <QuizResultScreen test={fakeTest} result={{ score:viewingSession.score, correctAnswers:viewingSession.correctAnswers, totalQuestions:viewingSession.totalQuestions, timeSpent:viewingSession.timeSpent }} questions={sessionDetails.questions} answers={sessionDetails.answers} onRetake={() => { setViewingSession(null); router.push(`/tests/take-test?testId=${viewingSession.testId}`); }} onBack={() => setViewingSession(null)} />;
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--p-bg)' }}>
      <style>{`
        .mt-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .hovcard { transition:transform .15s, box-shadow .15s; }
        .hovcard:hover { transform:translateY(-4px); box-shadow:var(--p-shadow-lg) !important; }
        @media (max-width:960px){ .mt-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media (max-width:600px){ .mt-grid { grid-template-columns:1fr !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(255,255,255,0.92)', backdropFilter:'saturate(160%) blur(10px)', borderBottom:'1px solid var(--p-line)' }}>
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'14px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <span style={{ width:34, height:34, background:'var(--p-primary)', borderRadius:10, display:'grid', placeItems:'center', color:'#fff', fontSize:19, fontWeight:900, fontFamily:'var(--font-display,sans-serif)', boxShadow:'var(--p-shadow-orange)' }}>M</span>
            <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:900, fontSize:22, letterSpacing:'-0.03em', color:'var(--p-ink)' }}>megamind<span style={{ color:'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Link href="/marketplace" style={btnGhostSm}>Browse tests</Link>
            <Link href="/student/profile" style={{ ...btnGhostSm, background:'var(--p-primary)', color:'#fff', border:'none', boxShadow:'var(--p-shadow-orange)' }}>{profile?.full_name ?? user.email}</Link>
          </div>
        </div>
      </nav>

      {/* Page hero */}
      <section style={{ padding:'44px 0 0', background:'var(--p-bg-alt)', borderBottom:'1px solid var(--p-line)' }}>
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 28px 0' }}>
          <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:13, color:'var(--p-muted)', marginBottom:22 }}>
            <Link href="/" style={{ color:'var(--p-primary)', textDecoration:'none' }}>Home</Link>{' / '}
            <span style={{ color:'var(--p-ink-2)' }}>My Tests</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:900, fontSize:'clamp(32px,4vw,52px)', letterSpacing:'-0.02em', lineHeight:1.06, color:'var(--p-ink)', marginBottom:10 }}>
            Your megamind<span style={{ color:'var(--p-primary)' }}>.</span>
          </h1>
          <p style={{ color:'var(--p-ink-2)', fontSize:15, fontWeight:600, marginBottom:32 }}>
            {purchases.length} purchased test{purchases.length !== 1 ? 's' : ''} · {history.length} completed
          </p>
          <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--p-line)', flexWrap:'wrap' }}>
            {(['tests','history'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:'12px 20px', border:'none', borderBottom: tab === t ? '3px solid var(--p-primary)' : '3px solid transparent', background:'transparent', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:15, cursor:'pointer', color: tab === t ? 'var(--p-primary)' : 'var(--p-ink-2)', marginBottom:-1 }}>
                {t === 'tests' ? '📚 Purchased Tests' : '📊 Test History'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding:'40px 0 80px' }}>
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 28px' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'80px 0', fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:14, color:'var(--p-muted)', letterSpacing:'0.05em', textTransform:'uppercase' }}>Loading…</div>
          ) : tab === 'tests' ? (
            purchases.length === 0 ? <EmptyPurchases /> : (
              <div className="mt-grid">
                {purchases.map((p, i) => {
                  const t = p.test; if (!t) return null;
                  const [tint, ink] = TINTS[i % TINTS.length];
                  return (
                    <div key={p.id} className="hovcard" style={{ background:'var(--p-bg)', border:'1px solid var(--p-line)', borderRadius:'var(--p-radius)', boxShadow:'var(--p-shadow)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                      <div style={{ background:tint, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:11, color:ink, letterSpacing:'0.05em', textTransform:'uppercase' }}>{(t.tags?.[0] ?? 'General').toUpperCase()}</span>
                        <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:10, padding:'3px 9px', borderRadius:999, background:'rgba(255,255,255,0.75)', color:ink }}>{t.type}</span>
                      </div>
                      <div style={{ padding:'18px 18px 20px', display:'flex', flexDirection:'column', flex:1, gap:10 }}>
                        <h3 style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:16, color:'var(--p-ink)', lineHeight:1.3 }}>{t.title}</h3>
                        <div style={{ display:'flex', gap:14, fontSize:13, color:'var(--p-ink-2)', fontWeight:600 }}>
                          <span>⏱ {t.timeLimit} min</span>
                          <span>🎯 {t.passingScore}% to pass</span>
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                          {t.tags?.slice(0,3).map(tag => (
                            <span key={tag} style={{ padding:'3px 9px', borderRadius:999, background:'var(--p-bg-alt)', color:'var(--p-ink-2)', fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:10.5 }}>{tag}</span>
                          ))}
                        </div>
                        <div style={{ flex:1 }} />
                        <div style={{ borderTop:'1px solid var(--p-line)', paddingTop:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:11, letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--p-muted)' }}>
                            {fmtDate(p.purchasedAt)}
                          </div>
                          <Link href={`/tests/take-test?testId=${t.id}`} style={{ padding:'9px 18px', border:'none', borderRadius:10, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:13, textDecoration:'none', boxShadow:'var(--p-shadow-orange)' }}>
                            ▶ Start →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            history.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 0' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📊</div>
                <h3 style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:22, color:'var(--p-ink)', marginBottom:8 }}>No history yet</h3>
                <p style={{ color:'var(--p-ink-2)', fontSize:15 }}>Complete a test to see your results here.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {history.map(h => {
                  const circ = 2 * Math.PI * 22;
                  const col  = h.score >= 80 ? C_OK : h.score >= 60 ? 'var(--p-primary)' : C_BAD;
                  return (
                    <div key={h.id} className="hovcard" style={{ background:'var(--p-bg)', border:'1px solid var(--p-line)', borderRadius:'var(--p-radius)', boxShadow:'var(--p-shadow)', padding:'14px 20px', display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:18, alignItems:'center' }}>
                      <div style={{ position:'relative', width:56, height:56, flexShrink:0 }}>
                        <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform:'rotate(-90deg)' }}>
                          <circle cx={28} cy={28} r={22} stroke="var(--p-line)" strokeWidth={6} fill="none" />
                          <circle cx={28} cy={28} r={22} stroke={col} strokeWidth={6} fill="none" strokeDasharray={circ} strokeDashoffset={circ * (1 - h.score / 100)} strokeLinecap="round" />
                        </svg>
                        <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', fontFamily:'var(--font-display,sans-serif)', fontWeight:900, fontSize:13, color:'var(--p-ink)' }}>{h.score}</div>
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:15, color:'var(--p-ink)', marginBottom:5 }}>{h.testTitle}</div>
                        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                          <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:10.5, padding:'3px 9px', borderRadius:999, background:'var(--p-bg-alt)', color:'var(--p-ink-2)' }}>{h.correctAnswers}/{h.totalQuestions} correct</span>
                          <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:12, letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--p-muted)' }}>⏱ {fmt(h.timeSpent)}</span>
                          <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:12, letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--p-muted)' }}>{fmtDate(h.completedAt)}</span>
                        </div>
                      </div>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 13px', borderRadius:999, fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:12.5, background: h.passed ? '#E4F4EC' : '#FCECEA', color: h.passed ? C_OK : C_BAD, flexShrink:0 }}>
                        {h.passed ? '✓ Passed' : '✕ Failed'}
                      </span>
                      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                        <button onClick={() => setViewingSession(h)} style={btnPrimary}>View results →</button>
                        <Link href={`/tests/take-test?testId=${h.testId}`} style={btnGhostSm}>Retry →</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div style={{ minHeight:'100vh', background:'var(--p-bg)', display:'grid', placeItems:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
        <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:20, color:'var(--p-ink)' }}>{label}</div>
      </div>
    </div>
  );
}

function EmptyPurchases() {
  return (
    <div style={{ textAlign:'center', padding:'80px 24px' }}>
      <div style={{ width:80, height:80, borderRadius:20, background:'var(--p-peach)', display:'grid', placeItems:'center', margin:'0 auto 20px', fontSize:36 }}>📚</div>
      <h3 style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:22, color:'var(--p-ink)', marginBottom:10 }}>No tests yet</h3>
      <p style={{ color:'var(--p-ink-2)', fontSize:15, marginBottom:28 }}>Browse the marketplace and buy your first test to get started.</p>
      <Link href="/marketplace" style={{ display:'inline-flex', padding:'13px 24px', border:'none', borderRadius:12, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:15, textDecoration:'none', boxShadow:'var(--p-shadow-orange)' }}>
        Browse tests →
      </Link>
    </div>
  );
}

const btnPrimary:  React.CSSProperties = { padding:'9px 18px', border:'none', borderRadius:10, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:13, cursor:'pointer', boxShadow:'var(--p-shadow-orange)', textDecoration:'none' };
const btnGhostSm:  React.CSSProperties = { padding:'9px 16px', border:'1.5px solid var(--p-line-2)', borderRadius:10, background:'var(--p-bg)', color:'var(--p-ink)', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:13, boxShadow:'var(--p-shadow-sm)', textDecoration:'none', display:'inline-flex', alignItems:'center' };

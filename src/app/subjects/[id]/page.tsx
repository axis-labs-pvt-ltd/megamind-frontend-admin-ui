// Client Component - Subject landing page
'use client';

import { useAuth } from '@/contexts/authcontext';
import { useSubjectById } from '@/hooks/queries/useSubjects';
import { useActiveTests } from '@/hooks/queries/useTests';
import { Test } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const TINTS = [
  { bg: 'var(--p-blue)',   ink: 'var(--p-ink-blue)' },
  { bg: 'var(--p-peach)',  ink: 'var(--p-ink-peach)' },
  { bg: 'var(--p-mint)',   ink: 'var(--p-ink-mint)' },
  { bg: 'var(--p-lav)',    ink: 'var(--p-ink-lav)' },
  { bg: 'var(--p-yellow)', ink: 'var(--p-ink-yellow)' },
  { bg: 'var(--p-pink)',   ink: 'var(--p-ink-pink)' },
];

function getEmoji(name: string) {
  const n = name.toLowerCase();
  if (n.includes('ict') || n.includes('computer')) return '💻';
  if (n.includes('physics')) return '⚛️';
  if (n.includes('chemistry')) return '🧪';
  if (n.includes('math')) return '📐';
  if (n.includes('english')) return '📚';
  if (n.includes('biology')) return '🌿';
  if (n.includes('history')) return '📜';
  if (n.includes('geography')) return '🌍';
  return '📋';
}

function getTestPrice(t: Test) {
  const c = t.type === 'static' ? t.questionIds.length : t.rules.reduce((s, r) => s + r.questionCount, 0);
  return c <= 20 ? 1000 : c <= 40 ? 1500 : 2000;
}

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: subject, isLoading, error } = useSubjectById(id);
  const { data: allTests = [] } = useActiveTests();
  const [modFilter, setModFilter] = useState('all');

  const relatedTests = useMemo(
    () => allTests.filter(t => (t.tags ?? []).some(tag => tag.toLowerCase() === subject?.name.toLowerCase())).slice(0, 3),
    [allTests, subject?.name]
  );

  const totalQuestions = useMemo(
    () => Object.values(subject?.questionCounts ?? {}).reduce((s, c) => s + c, 0),
    [subject?.questionCounts]
  );

  const visibleModules = subject?.modules ?? [];
  const featuredModule = visibleModules[0];
  const heroTint = TINTS[0];

  if (isLoading) return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 28px', textAlign: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15, color: 'var(--p-muted)' }}>Loading…</div>
    </div>
  );

  if (error || !subject) return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>Subject not found</div>
        <Link href="/" style={{ color: 'var(--p-primary)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700 }}>← Back to home</Link>
      </div>
    </div>
  );

  const emoji = getEmoji(subject.name);

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
              <><Link href="/my-tests" style={ghostBtn}>My Tests</Link><Link href="/student/profile" style={primaryBtn}>Profile →</Link></>
            ) : (
              <><Link href="/auth/signin" style={ghostBtn}>Log in</Link><Link href="/auth/signup" style={primaryBtn}>Start free →</Link></>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '44px 0 60px', background: 'var(--p-bg-alt)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

          {/* Breadcrumbs */}
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-muted)', marginBottom: 28, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--p-ink-2)' }}>Subjects</span>
            <span>/</span>
            <span>{subject.name}</span>
          </div>

          <div className="subj-hero-grid">
            {/* Left: info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 66, height: 66, borderRadius: 18, background: heroTint.bg, display: 'grid', placeItems: 'center', fontSize: 32, boxShadow: 'var(--p-shadow-sm)' }}>{emoji}</div>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(32px,4.5vw,52px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--p-ink)', marginBottom: 16 }}>
                {subject.name}
              </h1>
              {subject.description && (
                <p style={{ fontSize: 'clamp(15px,1.2vw,17px)', color: 'var(--p-ink-2)', lineHeight: 1.65, maxWidth: 500, marginBottom: 28 }}>
                  {subject.description}
                </p>
              )}

              {/* Stats */}
              <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 32 }}>
                {[
                  [String(subject.modules.length), 'Modules'],
                  [String(totalQuestions || '—'), 'Questions'],
                  ['0%', 'Your progress'],
                ].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 36, color: lbl === 'Your progress' ? 'var(--p-primary)' : 'var(--p-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 6 }}>{lbl}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#modules" style={heroCta}>Continue learning →</a>
                <Link href={`/marketplace?subject=${encodeURIComponent(subject.name)}`} style={heroGhost}>Browse {subject.name} tests</Link>
              </div>
            </div>

            {/* Right: featured module gradient card */}
            {featuredModule && (
              <div style={{ padding: 26, borderRadius: 20, background: 'linear-gradient(150deg,var(--p-hero-a),var(--p-hero-b) 55%,var(--p-hero-c))', color: '#fff', boxShadow: 'var(--p-shadow-lg)', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, color: '#fff' }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: '#fff' }} />Start here
                  </span>
                  <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>Module 01</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 10, color: '#fff' }}>{featuredModule.name}</h3>
                {featuredModule.description && (
                  <p style={{ fontSize: 14.5, opacity: 0.9, marginBottom: 18, lineHeight: 1.55, color: '#fff' }}>
                    {featuredModule.description.slice(0, 120)}{featuredModule.description.length > 120 ? '…' : ''}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
                  {[
                    `${subject.questionCounts[featuredModule.id] ?? 0} questions`,
                    `~${Math.ceil((subject.questionCounts[featuredModule.id] ?? 10) * 1.2)} min`,
                    'adaptive',
                  ].map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', color: '#fff' }}>{tag}</span>
                  ))}
                </div>
                <Link href={`/subjects/${id}/modules/${featuredModule.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '13px 20px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, textDecoration: 'none', boxSizing: 'border-box' as const }}>
                  Start module →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Module catalog */}
      {visibleModules.length > 0 && (
        <section id="modules" style={{ padding: '60px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
                  <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Module catalog
                </div>
                <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(22px,3vw,36px)', letterSpacing: '-0.015em', lineHeight: 1.1, color: 'var(--p-ink)', margin: 0 }}>
                  {visibleModules.length} module{visibleModules.length !== 1 ? 's' : ''}.{' '}
                  <span style={{ color: 'var(--p-primary)', position: 'relative', display: 'inline-block' }}>
                    Pick your battle.
                    <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 6, background: 'var(--p-primary)', opacity: 0.22, borderRadius: 4, zIndex: -1 }} />
                  </span>
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['all', 'started'].map(f => (
                  <button key={f} onClick={() => setModFilter(f)} style={{ padding: '9px 16px', borderRadius: 999, border: `1px solid ${modFilter === f ? 'var(--p-primary)' : 'var(--p-line-2)'}`, background: modFilter === f ? 'var(--p-primary)' : '#fff', color: modFilter === f ? '#fff' : 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all .12s', textTransform: 'capitalize' }}>
                    {f === 'all' ? 'All' : 'Started'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="mod-grid">
              {visibleModules.map((m, i) => {
                const { bg, ink } = TINTS[i % TINTS.length];
                const num = String(i + 1).padStart(2, '0');
                const qCount = subject.questionCounts[m.id] ?? 0;
                const isFirst = i === 0;
                return (
                  <Link key={m.id} href={`/subjects/${id}/modules/${m.id}`} className="mod-card" style={{ border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)', padding: 24, display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', transition: 'transform .15s, box-shadow .15s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--p-shadow-lg)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--p-shadow-sm)'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 13, background: bg, color: ink, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 16 }}>{num}</div>
                      {isFirst && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 999, background: 'linear-gradient(90deg,var(--p-hero-a),var(--p-hero-b))', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11 }}>
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: '#fff' }} />Start here
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 19, lineHeight: 1.3, marginBottom: 8, color: 'var(--p-ink)' }}>{m.name}</h3>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 12 }}>
                      {qCount > 0 ? `${qCount} questions` : 'Questions coming soon'}
                    </div>
                    {m.description && (
                      <p style={{ fontSize: 13.5, color: 'var(--p-ink-2)', lineHeight: 1.6, marginBottom: 18, flex: 1 }}>
                        {m.description.slice(0, 100)}{m.description.length > 100 ? '…' : ''}
                      </p>
                    )}
                    {!m.description && <div style={{ flex: 1 }} />}

                    {/* Progress bar */}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, marginBottom: 7, color: 'var(--p-ink-2)' }}>
                        <span>Not started</span><span>0%</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 999, background: 'var(--p-line)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '0%', borderRadius: 999, background: 'var(--p-primary)' }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related tests */}
      {relatedTests.length > 0 && (
        <section style={{ padding: '0 0 60px', background: 'var(--p-bg-alt)', borderTop: '1px solid var(--p-line)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '60px 28px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
                  <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Related tests
                </div>
                <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(22px,2.8vw,34px)', letterSpacing: '-0.015em', color: 'var(--p-ink)', margin: 0 }}>
                  Buy a {subject.name} test paper
                </h2>
              </div>
              <Link href={`/marketplace?subject=${encodeURIComponent(subject.name)}`} style={ghostBtn}>View all →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="rel-tests-grid">
              {relatedTests.map((t, i) => {
                const { bg, ink } = TINTS[i % TINTS.length];
                const qCount = t.type === 'static' ? t.questionIds.length : t.rules.reduce((s, r) => s + r.questionCount, 0);
                return (
                  <div key={t.id} style={{ border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: bg, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: ink }}>{subject.name}</span>
                      <span style={{ background: 'rgba(255,255,255,0.8)', color: ink, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, padding: '4px 9px', borderRadius: 999 }}>{t.type === 'dynamic' ? 'AI' : 'Fixed'}</span>
                    </div>
                    <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 17, lineHeight: 1.3, marginBottom: 10, color: 'var(--p-ink)' }}>{t.title}</h3>
                      <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--p-ink-2)', fontWeight: 600, marginBottom: 14 }}>
                        <span>📋 {qCount} questions</span><span>⏱ {t.timeLimit} min</span>
                      </div>
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--p-line)', paddingTop: 14 }}>
                        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 20, color: 'var(--p-ink)' }}>Rs. {getTestPrice(t).toLocaleString()}</div>
                        <Link href={`/marketplace?testId=${t.id}`} style={{ padding: '10px 18px', border: 'none', borderRadius: 11, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none' }}>Buy →</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Sign-up CTA */}
      {!user && (
        <section style={{ padding: '60px 0', background: 'var(--p-bg-warm)', borderTop: '1px solid var(--p-line)' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{emoji}</div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: 'var(--p-ink)', marginBottom: 12 }}>
              Ready to master {subject.name}?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--p-ink-2)', marginBottom: 24, lineHeight: 1.65 }}>
              Create a free account to track your progress, unlock AI feedback and access all {visibleModules.length} modules.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={heroCta}>Start for free →</Link>
              <Link href="/auth/signin" style={heroGhost}>Log in</Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .subj-hero-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:50px; align-items:center; }
        .mod-card { transition:transform .15s, box-shadow .15s; cursor:pointer; }
        .mod-card:hover { transform:translateY(-5px); box-shadow:var(--p-shadow-lg); }
        @media (max-width:960px) { .subj-hero-grid { grid-template-columns:1fr; } .mod-grid { grid-template-columns:repeat(2,1fr) !important; } .rel-tests-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media (max-width:600px) { .mod-grid { grid-template-columns:1fr !important; } .rel-tests-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}

const ghostBtn: React.CSSProperties   = { display:'inline-flex', alignItems:'center', gap:8, padding:'9px 16px', border:'1.5px solid var(--p-line-2)', borderRadius:10, background:'#fff', color:'var(--p-ink-2)', fontFamily:'var(--font-display,Nunito,sans-serif)', fontWeight:700, fontSize:13, boxShadow:'var(--p-shadow-sm)', textDecoration:'none' };
const primaryBtn: React.CSSProperties = { display:'inline-flex', alignItems:'center', gap:8, padding:'9px 16px', border:'none', borderRadius:10, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,Nunito,sans-serif)', fontWeight:800, fontSize:13, boxShadow:'var(--p-shadow-orange)', textDecoration:'none' };
const heroCta: React.CSSProperties    = { display:'inline-flex', alignItems:'center', gap:8, padding:'13px 22px', border:'none', borderRadius:12, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,Nunito,sans-serif)', fontWeight:800, fontSize:15, boxShadow:'var(--p-shadow-orange)', textDecoration:'none' };
const heroGhost: React.CSSProperties  = { display:'inline-flex', alignItems:'center', gap:8, padding:'13px 22px', border:'1.5px solid var(--p-line-2)', borderRadius:12, background:'#fff', color:'var(--p-ink-2)', fontFamily:'var(--font-display,Nunito,sans-serif)', fontWeight:700, fontSize:15, boxShadow:'var(--p-shadow-sm)', textDecoration:'none' };

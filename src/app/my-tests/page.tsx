'use client';

import { useAuth } from '@/contexts/authcontext';
import { fetchMyPurchases } from '@/services/api/purchases';
import { fetchStudentAttempts } from '@/services/api/testSessions';
import { Purchase, TestHistory } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const BAND_COLORS = ['var(--p-card-a)', 'var(--p-card-c)', 'var(--p-card-d)', 'var(--p-card-e)', 'var(--p-card-b)'];

export default function MyTestsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab]             = useState<'tests' | 'history'>('tests');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [history, setHistory]     = useState<TestHistory[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, h] = await Promise.all([
        fetchMyPurchases().catch(() => []),
        fetchStudentAttempts(user.id).catch(() => []),
      ]);
      setPurchases(p);
      setHistory(h.map((s: any) => ({
        id: s.id,
        testId: s.test_id,
        testTitle: s.tests?.title ?? 'Unknown test',
        passingScore: s.tests?.passing_score ?? 0,
        score: s.score ?? 0,
        passed: (s.score ?? 0) >= (s.tests?.passing_score ?? 100),
        timeSpent: s.time_spent ?? 0,
        completedAt: new Date(s.completed_at),
        correctAnswers: (s.test_session_answers ?? []).filter((a: any) => a.is_correct).length,
        totalQuestions: (s.test_session_answers ?? []).length,
      })));
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || !user) return null;

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}m ${sec % 60}s`;
  const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg)' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', fontSize: 18, fontWeight: 700, transform: 'rotate(-8deg)', fontFamily: 'var(--font-display,sans-serif)' }}>M</span>
            <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/marketplace" style={ghostNavBtn}>Browse tests</Link>
            <Link href="/student/profile" style={{ ...ghostNavBtn, background: 'var(--p-primary)', color: 'var(--p-primary-ink)' }}>
              {profile?.full_name ?? user.email}
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section style={{ padding: '56px 0 0', background: 'var(--p-bg-alt)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 40px' }}>
          <span style={eyebrow}>My learning</span>
          <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--p-ink)', marginTop: 16, marginBottom: 12 }}>
            Your megamind<span style={{ color: 'var(--p-primary)' }}>.</span>
          </h1>
          <p style={{ color: 'var(--p-ink-2)', fontSize: 16 }}>
            {purchases.length} purchased test{purchases.length !== 1 ? 's' : ''} · {history.length} completed
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginTop: 32 }}>
            {(['tests', 'history'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 24px',
                border: '2px solid var(--p-ink)',
                borderBottom: tab === t ? '2px solid var(--p-bg)' : '2px solid var(--p-ink)',
                borderRadius: t === 'tests' ? '10px 0 0 0' : '0 10px 0 0',
                background: tab === t ? 'var(--p-bg)' : 'transparent',
                color: 'var(--p-ink)',
                fontFamily: 'var(--font-display,sans-serif)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                marginBottom: tab === t ? '-2px' : 0,
                position: 'relative', zIndex: tab === t ? 1 : 0,
              }}>
                {t === 'tests' ? '📚 Purchased Tests' : '📊 Test History'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '40px 0 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>Loading…</div>
          ) : tab === 'tests' ? (
            purchases.length === 0 ? (
              <EmptyPurchases />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="mt-grid">
                {purchases.map((p, i) => {
                  const t = p.test;
                  if (!t) return null;
                  const color = BAND_COLORS[i % BAND_COLORS.length];
                  return (
                    <div key={p.id} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '5px 5px 0 var(--p-ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ background: color, borderBottom: '2px solid var(--p-ink)', padding: '14px 20px' }}>
                        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, color: 'var(--p-ink)', letterSpacing: '0.08em' }}>
                          {(t.tags?.[0] ?? 'General').toUpperCase()} · {t.type}
                        </div>
                      </div>
                      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
                        <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 17, color: 'var(--p-ink)' }}>{t.title}</h3>
                        <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--p-ink-2)' }}>
                          <span>⏱ {t.timeLimit} min</span>
                          <span>🎯 {t.passingScore}% to pass</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {t.tags?.slice(0, 3).map(tag => (
                            <span key={tag} style={{ padding: '3px 10px', borderRadius: 999, border: '1.5px solid var(--p-ink)', fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)' }}>{tag}</span>
                          ))}
                        </div>
                        <div style={{ flex: 1 }} />
                        <div style={{ borderTop: '1.5px dashed var(--p-ink)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>
                            Purchased {formatDate(p.purchasedAt)}
                          </div>
                          <Link href={`/tests/take-test?testId=${t.id}`} style={{ padding: '9px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '3px 3px 0 var(--p-ink)', display: 'inline-block' }}>
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
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>No history yet</h3>
                <p style={{ color: 'var(--p-ink-2)', fontSize: 15 }}>Complete a test to see your results here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {history.map(h => (
                  <div key={h.id} style={{ border: '2px solid var(--p-ink)', borderRadius: 16, background: 'var(--p-bg)', boxShadow: '4px 4px 0 var(--p-ink)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, border: '2px solid var(--p-ink)', background: h.passed ? 'var(--p-card-d)' : 'var(--p-card-b)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)' }}>{h.score}%</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 16, color: 'var(--p-ink)', marginBottom: 4 }}>{h.testTitle}</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--p-ink-2)', flexWrap: 'wrap' }}>
                        <span>{h.correctAnswers}/{h.totalQuestions} correct</span>
                        <span>⏱ {formatTime(h.timeSpent)}</span>
                        <span>{formatDate(h.completedAt)}</span>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 600, background: h.passed ? 'var(--p-card-d)' : 'var(--p-card-b)', color: 'var(--p-ink)', flexShrink: 0 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: h.passed ? 'var(--p-primary)' : 'var(--p-accent)', flexShrink: 0 }} />
                      {h.passed ? 'Passed' : 'Failed'}
                    </span>
                    <Link href={`/tests/take-test?testId=${h.testId}`} style={{ padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg-alt)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                      Retry →
                    </Link>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) { .mt-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .mt-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function EmptyPurchases() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>📚</div>
      <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, color: 'var(--p-ink)', marginBottom: 10 }}>No tests yet</h3>
      <p style={{ color: 'var(--p-ink-2)', fontSize: 15, marginBottom: 28 }}>Browse the marketplace and buy your first test to get started.</p>
      <Link href="/marketplace" style={{ display: 'inline-flex', padding: '13px 24px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '4px 4px 0 var(--p-ink)' }}>
        Browse tests →
      </Link>
    </div>
  );
}

const eyebrow: React.CSSProperties = { fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 };
const ghostNavBtn: React.CSSProperties = { padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' };

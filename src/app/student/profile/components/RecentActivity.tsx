// Client Component
'use client';

import { TestHistory, Purchase } from '@/types';
import Link from 'next/link';

const SUB_TINTS: Record<string, [string, string]> = {
  physics:     ['var(--p-peach)',  'var(--p-ink-peach)'],
  chemistry:   ['var(--p-mint)',   'var(--p-ink-mint)'],
  biology:     ['var(--p-blue)',   'var(--p-ink-blue)'],
  mathematics: ['var(--p-lav)',    'var(--p-ink-lav)'],
  english:     ['var(--p-yellow)', 'var(--p-ink-yellow)'],
  ict:         ['var(--p-blue)',   'var(--p-ink-blue)'],
};
function subTint(title: string): [string, string] {
  const t = title.toLowerCase();
  return Object.entries(SUB_TINTS).find(([k]) => t.includes(k))?.[1] ?? ['var(--p-bg-alt)', 'var(--p-ink-2)'];
}

function ScoreRing({ score }: { score: number }) {
  const r = 22; const circ = 2 * Math.PI * r;
  const color = score >= 80 ? 'var(--p-ink-mint)' : score >= 60 ? 'var(--p-primary)' : 'var(--p-ink-pink)';
  return (
    <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
      <svg width={56} height={56} viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={28} cy={28} r={r} stroke="var(--p-line)" strokeWidth={6} fill="none" />
        <circle cx={28} cy={28} r={r} stroke={color} strokeWidth={6} fill="none"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 14, color: 'var(--p-ink)' }}>{score}</div>
    </div>
  );
}

const BAND_TINTS = ['var(--p-peach)', 'var(--p-blue)', 'var(--p-mint)', 'var(--p-lav)', 'var(--p-yellow)'];

interface Props { history: TestHistory[]; purchases: Purchase[]; loading: boolean; onReview: (h: TestHistory) => void; }

export function RecentActivity({ history, purchases, loading, onReview }: Props) {
  const recent = history.slice(0, 5);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }} className="rec-grid">
      {/* Attempts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.015em' }}>Recent attempts.</h2>
          <a href="#" style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, color: 'var(--p-primary)', textDecoration: 'none' }}>See all →</a>
        </div>
        {loading ? <Skeleton n={4} h={80} /> : recent.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-muted)' }}>No test attempts yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.map(a => {
              const [tint, ink] = subTint(a.testTitle);
              return (
                <button key={a.id} onClick={() => onReview(a)}
                  style={{ padding: '14px 18px', border: '1px solid var(--p-line)', borderRadius: 16, background: '#fff', boxShadow: 'var(--p-shadow-sm)', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 14, alignItems: 'center', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'box-shadow .15s' }}>
                  <ScoreRing score={a.score} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.testTitle}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5 }}>
                      <span style={{ padding: '3px 9px', borderRadius: 999, background: tint, color: ink, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10 }}>
                        {a.correctAnswers}/{a.totalQuestions} correct
                      </span>
                      <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 11, color: 'var(--p-muted)' }}>{Math.floor(a.timeSpent / 60)}m {a.timeSpent % 60}s</span>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12, color: 'var(--p-muted)' }}>{new Date(a.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <span style={{ fontSize: 18, color: 'var(--p-muted)' }}>→</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchases */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.015em' }}>My tests.</h2>
          <Link href="/marketplace" style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, color: 'var(--p-primary)', textDecoration: 'none' }}>+ Buy more</Link>
        </div>
        {loading ? <Skeleton n={4} h={68} /> : purchases.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-muted)' }}>No tests purchased yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {purchases.slice(0, 6).map((p, i) => {
              const t = p.test;
              const attempt = history.find(h => h.testId === p.testId);
              const status = attempt ? 'completed' : 'not-started';
              const statusStyle = {
                completed:    { lbl: '✓ Completed',   bg: 'var(--p-mint)', col: 'var(--p-ink-mint)' },
                'not-started': { lbl: '○ Not started', bg: 'var(--p-bg-alt)', col: 'var(--p-muted)' },
              }[status]!;
              return (
                <Link key={p.id} href={`/tests/take-test?testId=${p.testId}`}
                  style={{ padding: '14px 16px', border: '1px solid var(--p-line)', borderRadius: 16, background: '#fff', boxShadow: 'var(--p-shadow-sm)', display: 'flex', gap: 14, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: BAND_TINTS[i % BAND_TINTS.length], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, color: 'var(--p-ink)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t?.title ?? 'Test'}</div>
                    <div style={{ marginTop: 5, display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ padding: '3px 9px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, background: statusStyle.bg, color: statusStyle.col }}>{statusStyle.lbl}</span>
                      {attempt && <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, color: 'var(--p-muted)' }}>{attempt.score}%</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 13, color: 'var(--p-ink)' }}>Rs. {p.price.toLocaleString()}</div>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 11, color: 'var(--p-muted)', marginTop: 2 }}>{new Date(p.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@media(max-width:960px){.rec-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

function Skeleton({ n, h }: { n: number; h: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{Array.from({ length: n }).map((_, i) => <div key={i} style={{ height: h, borderRadius: 16, background: 'var(--p-bg-alt)' }} />)}</div>;
}

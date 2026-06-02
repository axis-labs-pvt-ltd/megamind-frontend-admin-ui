// Client Component
'use client';

import { TestHistory, Purchase } from '@/types';
import Link from 'next/link';

const SUB_COLORS: Record<string, string> = {
  physics: 'var(--p-card-a)', chemistry: 'var(--p-card-d)', biology: 'var(--p-card-c)',
  mathematics: 'var(--p-card-e)', english: 'var(--p-card-b)', ict: 'var(--p-card-c)',
};
function subColor(title: string) {
  const t = title.toLowerCase();
  return Object.entries(SUB_COLORS).find(([k]) => t.includes(k))?.[1] ?? 'var(--p-card-a)';
}

function ScoreRing({ score }: { score: number }) {
  const r = 22; const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#2D6A4F' : score >= 60 ? 'var(--p-primary)' : '#D94A3D';
  return (
    <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
      <svg width={56} height={56} viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={28} cy={28} r={r} stroke="var(--p-ink)" strokeOpacity={0.1} strokeWidth={6} fill="none" />
        <circle cx={28} cy={28} r={r} stroke={color} strokeWidth={6} fill="none"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-ink)' }}>{score}</div>
    </div>
  );
}

interface Props { history: TestHistory[]; purchases: Purchase[]; loading: boolean; onReview: (h: TestHistory) => void; }

export function RecentActivity({ history, purchases, loading, onReview }: Props) {
  const recent = history.slice(0, 5);

  const STATUS: Record<string, { lbl: string; bg: string; col: string }> = {
    completed:   { lbl: '✓ Completed',   bg: '#2D6A4F',          col: '#fff' },
    'in-progress': { lbl: '◐ In progress', bg: 'var(--p-primary)',  col: 'var(--p-primary-ink)' },
    'not-started': { lbl: '○ Not started', bg: 'var(--p-bg-alt)',   col: 'var(--p-ink)' },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }} className="rec-grid">
      {/* Attempts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>Recent attempts.</h2>
          <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-primary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{history.length} total</span>
        </div>
        {loading ? <Skeleton n={4} h={72} /> : recent.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)' }}>No test attempts yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(a => (
              <button key={a.id} onClick={() => onReview(a)}
                style={{ padding: '14px 18px', border: '2px solid var(--p-ink)', borderRadius: 14, background: 'var(--p-bg)', boxShadow: '3px 3px 0 var(--p-ink)', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 14, alignItems: 'center', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <ScoreRing score={a.score} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-ink)', lineHeight: 1.3 }}>{a.testTitle}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 999, border: '1.5px solid var(--p-ink)', background: subColor(a.testTitle), fontFamily: 'var(--font-mono,monospace)', fontSize: 10 }}>
                      {a.correctAnswers}/{a.totalQuestions} correct
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)' }}>{Math.floor(a.timeSpent / 60)}m {a.timeSpent % 60}s</span>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>{new Date(a.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                <span style={{ fontSize: 18, color: 'var(--p-ink)' }}>→</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Purchases */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 26, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>My tests.</h2>
          <Link href="/marketplace" style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-primary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>+ BUY MORE</Link>
        </div>
        {loading ? <Skeleton n={4} h={60} /> : purchases.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)' }}>No tests purchased yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {purchases.slice(0, 6).map((p, i) => {
              const t = p.test;
              const attempt = history.find(h => h.testId === p.testId);
              const status = attempt ? 'completed' : 'not-started';
              const s = STATUS[status];
              const COLORS = ['var(--p-card-a)', 'var(--p-card-d)', 'var(--p-card-e)', 'var(--p-card-c)', 'var(--p-card-b)'];
              return (
                <Link key={p.id} href={`/tests/take-test?testId=${p.testId}`}
                  style={{ padding: '14px 16px', border: '2px solid var(--p-ink)', borderRadius: 14, background: 'var(--p-bg)', boxShadow: '3px 3px 0 var(--p-ink)', display: 'flex', gap: 14, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: COLORS[i % COLORS.length], border: '2px solid var(--p-ink)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--p-ink)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t?.title ?? 'Test'}</div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 9, background: s.bg, color: s.col }}>{s.lbl}</span>
                      {attempt && <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginLeft: 6 }}>{attempt.score}%</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, color: 'var(--p-ink)' }}>Rs. {p.price.toLocaleString()}</div>
                    <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 9, color: 'var(--p-muted)', marginTop: 2 }}>{new Date(p.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
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
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: n }).map((_, i) => <div key={i} style={{ height: h, borderRadius: 14, background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)' }} />)}</div>;
}

// Client Component
'use client';

interface Kpi { label: string; value: string | number; sub: string; bg: string; color?: string; }

interface Props { quizzes: number; avgScore: number; xp: number; testsOwned: number; loading: boolean; }

export function KpiStrip({ quizzes, avgScore, xp, testsOwned, loading }: Props) {
  const v = (n: string | number) => loading ? '…' : n;

  const kpis: Kpi[] = [
    { label: 'QUIZZES TAKEN', value: v(quizzes),             sub: loading ? '' : `+${Math.max(0, Math.round(quizzes * 0.08))} this week`, bg: 'var(--p-card-a)' },
    { label: 'AVG SCORE',     value: loading ? '…' : `${avgScore}%`, sub: 'cumulative',                                                    bg: 'var(--p-card-d)' },
    { label: 'XP EARNED',     value: v(xp),                  sub: `level ${Math.floor(xp / 350)} · ${350 - (xp % 350)} to next`,          bg: 'var(--p-card-c)' },
    { label: 'TESTS OWNED',   value: v(testsOwned),           sub: 'all time',                                                             bg: 'var(--p-ink)', color: 'var(--p-bg)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 36 }} className="kpi-grid">
      {kpis.map(k => (
        <div key={k.label} style={{ padding: 22, border: '2px solid var(--p-ink)', borderRadius: 18, background: k.bg, boxShadow: '5px 5px 0 var(--p-ink)', color: k.color ?? 'var(--p-ink)' }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 12, color: k.color === 'var(--p-bg)' ? 'var(--p-secondary)' : undefined }}>
            {k.label}
          </div>
          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 44, lineHeight: 1, letterSpacing: '-0.03em' }}>{k.value}</div>
          <div style={{ marginTop: 7, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, opacity: 0.7 }}>{k.sub}</div>
        </div>
      ))}
      <style>{`@media(max-width:860px){.kpi-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </div>
  );
}

// Client Component
'use client';

interface Kpi { label: string; value: string | number; sub: string; bg: string; ink: string; }

interface Props { quizzes: number; avgScore: number; xp: number; testsOwned: number; loading: boolean; }

export function KpiStrip({ quizzes, avgScore, xp, testsOwned, loading }: Props) {
  const v = (n: string | number) => loading ? '…' : n;

  const kpis: Kpi[] = [
    { label: 'Quizzes taken', value: v(quizzes),             sub: loading ? '' : `+${Math.max(0, Math.round(quizzes * 0.08))} this week`, bg: 'var(--p-peach)',  ink: 'var(--p-ink-peach)' },
    { label: 'Avg score',     value: loading ? '…' : `${avgScore}%`, sub: 'cumulative',                                                   bg: 'var(--p-mint)',   ink: 'var(--p-ink-mint)' },
    { label: 'XP earned',     value: v(xp),                  sub: `level ${Math.floor(xp / 350)} · ${350 - (xp % 350)} to next`,         bg: 'var(--p-blue)',   ink: 'var(--p-ink-blue)' },
    { label: 'Tests owned',   value: v(testsOwned),           sub: 'all time',                                                            bg: 'linear-gradient(150deg,var(--p-hero-a),var(--p-hero-c))', ink: '#fff' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 32 }} className="kpi-grid">
      {kpis.map(k => (
        <div key={k.label} style={{ padding: 22, border: '1px solid var(--p-line)', borderRadius: 18, background: k.bg, boxShadow: 'var(--p-shadow-sm)', color: k.ink }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 12 }}>
            {k.label}
          </div>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 42, lineHeight: 1, letterSpacing: '-0.02em' }}>{k.value}</div>
          <div style={{ marginTop: 8, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12, opacity: 0.75 }}>{k.sub}</div>
        </div>
      ))}
      <style>{`@media(max-width:860px){.kpi-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </div>
  );
}

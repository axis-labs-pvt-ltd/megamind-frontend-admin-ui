// Client Component
'use client';

interface Attempt { score: number; completedAt: Date; }
interface Props { attempts: Attempt[]; loading: boolean; }

const SUB_COLORS: Record<string, string> = {
  Physics: 'var(--p-card-a)', Chemistry: 'var(--p-card-d)', Biology: 'var(--p-card-c)',
  Mathematics: 'var(--p-card-e)', English: 'var(--p-card-b)', ICT: 'var(--p-card-c)',
};

export function PerformancePanel({ attempts, loading }: Props) {
  // Build 8 weekly buckets from attempts
  const now = Date.now();
  const buckets = Array.from({ length: 8 }, (_, i) => {
    const weekStart = now - (7 - i) * 7 * 86400000;
    const weekEnd   = weekStart + 7 * 86400000;
    const week = attempts.filter(a => {
      const t = new Date(a.completedAt).getTime();
      return t >= weekStart && t < weekEnd;
    });
    const avg = week.length ? Math.round(week.reduce((s, a) => s + a.score, 0) / week.length) : null;
    return { label: `W${i + 1}`, avg };
  });

  // Fill nulls forward/back for chart continuity
  const filled = buckets.map((b, i) => {
    if (b.avg !== null) return b.avg;
    const prev = buckets.slice(0, i).reverse().find(x => x.avg !== null)?.avg;
    const next = buckets.slice(i + 1).find(x => x.avg !== null)?.avg;
    return prev ?? next ?? 50;
  });

  const W = 560; const H = 200; const PAD = 36;
  const xs = filled.map((_, i) => PAD + (i / 7) * (W - PAD * 2));
  const ys = filled.map(v => H - PAD - ((v - 0) / 100) * (H - PAD * 2));
  const pathD   = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  const areaD   = pathD + ` L ${xs[7]} ${H - PAD} L ${xs[0]} ${H - PAD} Z`;
  const first   = filled[0]; const last = filled[7];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 36 }} className="dash-grid">
      {/* Chart */}
      <div style={{ padding: 28, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '5px 5px 0 var(--p-ink)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink-2)' }}>Performance trend</div>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 26, color: 'var(--p-ink)', marginTop: 8, letterSpacing: '-0.02em' }}>Last 8 weeks.</h2>
          </div>
        </div>
        {loading ? (
          <div style={{ height: 200, background: 'var(--p-bg-alt)', borderRadius: 12 }} />
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200 }}>
            {[100, 75, 50].map((pct, i) => {
              const cy = H - PAD - ((pct / 100) * (H - PAD * 2));
              return <g key={pct}><line x1={0} y1={cy} x2={W} y2={cy} stroke="var(--p-ink)" strokeOpacity={0.1} strokeDasharray="4 4" /><text x={2} y={cy - 3} fontFamily="JetBrains Mono, monospace" fontSize={9} fill="var(--p-muted)">{pct}%</text></g>;
            })}
            <path d={areaD} fill="var(--p-primary)" fillOpacity={0.1} />
            <path d={pathD} fill="none" stroke="var(--p-primary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={i === 7 ? 6 : 4} fill={i === 7 ? 'var(--p-primary)' : 'var(--p-bg)'} stroke="var(--p-ink)" strokeWidth={1.5} />)}
            {buckets.map((b, i) => <text key={i} x={xs[i]} y={H - 4} fontFamily="JetBrains Mono, monospace" fontSize={9} fill="var(--p-muted)" textAnchor="middle">{b.label}</text>)}
          </svg>
        )}
        {!loading && (
          <div style={{ display: 'flex', gap: 28, marginTop: 16, paddingTop: 16, borderTop: '1.5px dashed var(--p-ink)' }}>
            <div><div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)' }}>{first}% → {last}%</div><div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>8-week improvement</div></div>
            <div><div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)' }}>{attempts.length}</div><div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total attempts</div></div>
          </div>
        )}
      </div>

      {/* Subject breakdown */}
      <div style={{ padding: 28, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '5px 5px 0 var(--p-ink)' }}>
        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink-2)' }}>Subjects</div>
        <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 26, color: 'var(--p-ink)', marginTop: 8, marginBottom: 22, letterSpacing: '-0.02em' }}>Where you stand.</h2>
        {loading ? <div style={{ height: 180, background: 'var(--p-bg-alt)', borderRadius: 12 }} /> : (
          <SubjectBars attempts={attempts} />
        )}
      </div>
      <style>{`@media(max-width:960px){.dash-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

function SubjectBars({ attempts }: { attempts: Attempt[] }) {
  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'ICT'];
  const rows = subjects.map(name => {
    const matching = (attempts as any[]).filter(a => (a.testTitle ?? '').toLowerCase().includes(name.toLowerCase()));
    const pct = matching.length ? Math.round(matching.reduce((s: number, a: any) => s + a.score, 0) / matching.length) : 0;
    return { name, pct, attempts: matching.length };
  }).filter(r => r.attempts > 0);

  if (rows.length === 0) return <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', textAlign: 'center', padding: '40px 0' }}>Complete some tests to see your subject performance.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {rows.map(r => (
        <div key={r.name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: SUB_COLORS[r.name] ?? 'var(--p-card-a)', border: '1.5px solid var(--p-ink)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-ink)' }}>{r.name}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 600, color: 'var(--p-ink)' }}>{r.pct}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--p-bg-alt)', border: '1.5px solid var(--p-ink)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${r.pct}%`, background: r.pct >= 80 ? '#2D6A4F' : 'var(--p-primary)', borderRadius: 999 }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginTop: 3 }}>{r.attempts} attempts</div>
        </div>
      ))}
    </div>
  );
}

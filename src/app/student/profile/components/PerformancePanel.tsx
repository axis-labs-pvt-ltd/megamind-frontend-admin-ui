// Client Component
'use client';

const SUB_TINTS: Record<string, [string, string]> = {
  Physics:     ['var(--p-peach)',  'var(--p-ink-peach)'],
  Chemistry:   ['var(--p-mint)',   'var(--p-ink-mint)'],
  Biology:     ['var(--p-blue)',   'var(--p-ink-blue)'],
  Mathematics: ['var(--p-lav)',    'var(--p-ink-lav)'],
  English:     ['var(--p-yellow)', 'var(--p-ink-yellow)'],
  ICT:         ['var(--p-blue)',   'var(--p-ink-blue)'],
};

interface Attempt { score: number; completedAt: Date; }
interface Props { attempts: Attempt[]; loading: boolean; }

export function PerformancePanel({ attempts, loading }: Props) {
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

  const filled = buckets.map((b, i) => {
    if (b.avg !== null) return b.avg;
    const prev = buckets.slice(0, i).reverse().find(x => x.avg !== null)?.avg;
    const next = buckets.slice(i + 1).find(x => x.avg !== null)?.avg;
    return prev ?? next ?? 50;
  });

  const W = 560; const H = 200; const PAD = 36;
  const xs = filled.map((_, i) => PAD + (i / 7) * (W - PAD * 2));
  const ys = filled.map(v => H - PAD - ((v / 100) * (H - PAD * 2)));
  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  const areaD = pathD + ` L ${xs[7]} ${H - PAD} L ${xs[0]} ${H - PAD} Z`;
  const first = filled[0]; const last = filled[7];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 32 }} className="dash-grid">
      {/* Chart */}
      <div style={{ padding: 28, border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Performance trend
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 26, color: 'var(--p-ink)', marginTop: 8, letterSpacing: '-0.015em' }}>Last 8 weeks.</h2>
          </div>
        </div>
        {loading ? (
          <div style={{ height: 200, background: 'var(--p-bg-alt)', borderRadius: 14 }} />
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200 }}>
            {[100, 75, 50].map(pct => {
              const cy = H - PAD - ((pct / 100) * (H - PAD * 2));
              return <g key={pct}><line x1={0} y1={cy} x2={W} y2={cy} stroke="var(--p-line-2)" strokeDasharray="4 4" /><text x={2} y={cy - 3} fontFamily="Mulish,sans-serif" fontSize={9} fill="var(--p-muted)">{pct}%</text></g>;
            })}
            <path d={areaD} fill="var(--p-primary)" fillOpacity={0.08} />
            <path d={pathD} fill="none" stroke="var(--p-primary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={i === 7 ? 6 : 4} fill={i === 7 ? 'var(--p-primary)' : '#fff'} stroke="var(--p-primary)" strokeWidth={2} />)}
            {buckets.map((b, i) => <text key={i} x={xs[i]} y={H - 4} fontFamily="Mulish,sans-serif" fontSize={9} fill="var(--p-muted)" textAnchor="middle">{b.label}</text>)}
          </svg>
        )}
        {!loading && (
          <div style={{ display: 'flex', gap: 30, marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--p-line)' }}>
            <div><div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 18, color: 'var(--p-ink)' }}>{first}% → {last}%</div><div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 4 }}>8-week improvement</div></div>
            <div><div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 18, color: 'var(--p-ink)' }}>{attempts.length}</div><div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 4 }}>Total attempts</div></div>
          </div>
        )}
      </div>

      {/* Subject breakdown */}
      <div style={{ padding: 28, border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
          <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Subjects
        </div>
        <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 26, color: 'var(--p-ink)', marginTop: 8, marginBottom: 22, letterSpacing: '-0.015em' }}>Where you stand.</h2>
        {loading ? <div style={{ height: 180, background: 'var(--p-bg-alt)', borderRadius: 14 }} /> : <SubjectBars attempts={attempts} />}
      </div>
      <style>{`@media(max-width:960px){.dash-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

function SubjectBars({ attempts }: { attempts: any[] }) {
  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'ICT'];
  const rows = subjects.map(name => {
    const matching = attempts.filter(a => (a.testTitle ?? '').toLowerCase().includes(name.toLowerCase()));
    const pct = matching.length ? Math.round(matching.reduce((s, a) => s + a.score, 0) / matching.length) : 0;
    return { name, pct, count: matching.length };
  }).filter(r => r.count > 0);

  if (rows.length === 0) return <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--p-muted)', textAlign: 'center', padding: '40px 0' }}>Complete some tests to see your subject performance.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {rows.map(r => {
        const [tint, ink] = SUB_TINTS[r.name] ?? ['var(--p-bg-alt)', 'var(--p-ink-2)'];
        return (
          <div key={r.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ width: 13, height: 13, borderRadius: 4, background: tint, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, color: 'var(--p-ink)' }}>{r.name}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, color: ink }}>{r.pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--p-line)', overflow: 'hidden' }}>
              <span style={{ display: 'block', height: '100%', width: `${r.pct}%`, borderRadius: 999, background: 'var(--p-primary)', transition: 'width .3s' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 11, color: 'var(--p-muted)', marginTop: 4 }}>{r.count} attempts</div>
          </div>
        );
      })}
    </div>
  );
}

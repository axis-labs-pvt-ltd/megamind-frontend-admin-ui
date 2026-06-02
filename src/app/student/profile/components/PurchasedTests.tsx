// Client Component
'use client';

import { Purchase } from '@/types';
import Link from 'next/link';

const COLORS = ['var(--p-card-a)', 'var(--p-card-c)', 'var(--p-card-d)', 'var(--p-card-e)', 'var(--p-card-b)'];

const EMOJI: Record<string, string> = { physics: '⚛️', chemistry: '🧪', math: '📐', ict: '💻', english: '📝', biology: '🌿' };
function getEmoji(tags: string[]) {
  const t = tags.join(' ').toLowerCase();
  return Object.entries(EMOJI).find(([k]) => t.includes(k))?.[1] ?? '📋';
}

interface Props {
  purchases: Purchase[];
  loading: boolean;
}

export function PurchasedTests({ purchases, loading }: Props) {
  if (loading) return <LoadingGrid />;

  if (purchases.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
      <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>No tests yet</div>
      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)', marginBottom: 22 }}>Browse the marketplace to find your first test.</div>
      <Link href="/marketplace" style={primaryBtn}>Browse tests →</Link>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="pt-grid">
      {purchases.map((p, i) => {
        const t = p.test;
        if (!t) return null;
        const color = COLORS[i % COLORS.length];
        const emoji = getEmoji(t.tags ?? []);
        const qCount = t.type === 'static' ? t.questionIds.length : (t as any).rules?.reduce((s: number, r: any) => s + r.questionCount, 0) ?? 0;
        return (
          <div key={p.id} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '5px 5px 0 var(--p-ink)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: color, padding: '16px 18px', borderBottom: '2px solid var(--p-ink)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--p-bg)', border: '2px solid var(--p-ink)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>{emoji}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink-2)' }}>{t.tags?.[0] ?? 'General'}</div>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 9, color: 'var(--p-muted)', marginTop: 2 }}>Purchased {new Date(p.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
            <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 16, color: 'var(--p-ink)', lineHeight: 1.3, marginBottom: 10 }}>{t.title}</h3>
              <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                {[['📋', `${qCount} q`], ['⏱', `${t.timeLimit}m`], ['🎯', `${t.passingScore}% pass`]].map(([icon, lbl]) => (
                  <div key={String(lbl)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)' }}><span>{icon}</span>{lbl}</div>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              <Link href={`/tests/take-test?testId=${t.id}`}
                style={{ display: 'block', textAlign: 'center', padding: '10px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '2px 2px 0 var(--p-ink)' }}>
                Take test →
              </Link>
            </div>
          </div>
        );
      })}
      <style>{`@media(max-width:900px){.pt-grid{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:580px){.pt-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, height: 180, background: 'var(--p-bg-alt)', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );
}

const primaryBtn: React.CSSProperties = { display: 'inline-block', padding: '11px 24px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '3px 3px 0 var(--p-ink)' };

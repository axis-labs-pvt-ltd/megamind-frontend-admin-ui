// Client Component
'use client';

import { TestHistory as TH } from '@/types';

interface Props {
  history: TH[];
  loading: boolean;
  onReview: (h: TH) => void;
}

export function TestHistoryTab({ history, loading, onReview }: Props) {
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[1, 2, 3].map(i => <div key={i} style={{ height: 64, borderRadius: 14, background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)' }} />)}
    </div>
  );

  if (history.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>📊</div>
      <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', marginBottom: 8 }}>No attempts yet</div>
      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: 'var(--p-muted)' }}>Complete a test to see your history here.</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 90px 100px', gap: 12, padding: '8px 16px', fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, color: 'var(--p-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="hist-row">
        <span>Test</span><span style={{ textAlign: 'center' }}>Score</span><span style={{ textAlign: 'center' }}>Pass</span><span style={{ textAlign: 'center' }}>Time</span><span style={{ textAlign: 'center' }}>Date</span><span />
      </div>

      {history.map(h => {
        const passed = h.passed;
        const mins = Math.floor(h.timeSpent / 60);
        const secs = h.timeSpent % 60;
        return (
          <div key={h.id}
            style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 90px 100px', gap: 12, alignItems: 'center', padding: '14px 16px', border: '2px solid var(--p-ink)', borderRadius: 14, background: passed ? 'rgba(45,106,79,0.04)' : 'var(--p-bg)', boxShadow: '3px 3px 0 var(--p-ink)' }}
            className="hist-row">
            <div>
              <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-ink)', lineHeight: 1.3 }}>{h.testTitle}</div>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginTop: 2 }}>{h.correctAnswers}/{h.totalQuestions} correct</div>
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: passed ? '#2D6A4F' : '#D94A3D' }}>{h.score}%</div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 999, background: passed ? '#2D6A4F' : '#D94A3D', color: '#fff', fontWeight: 700, fontSize: 13, border: '2px solid var(--p-ink)' }}>
                {passed ? '✓' : '✕'}
              </span>
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-ink-2)' }}>{mins}m {secs}s</div>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>
              {new Date(h.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={() => onReview(h)}
                style={{ padding: '6px 14px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 12, cursor: 'pointer', boxShadow: '2px 2px 0 var(--p-ink)', whiteSpace: 'nowrap' }}>
                Review →
              </button>
            </div>
          </div>
        );
      })}
      <style>{`@media(max-width:700px){.hist-row{grid-template-columns:1fr 64px 48px 80px!important;}.hist-row>*:nth-child(4),.hist-row>*:nth-child(5){display:none!important;}}`}</style>
    </div>
  );
}

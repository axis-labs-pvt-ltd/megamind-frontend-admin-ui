// Client Component - Pre-test screen with test info
'use client';

import { Test } from '@/types';

interface Props {
  test: Test;
  onStart: () => void;
  onBack: () => void;
}

export function QuizPreScreen({ test, onStart, onBack }: Props) {
  const questionCount = test.type === 'static'
    ? test.questionIds.length
    : test.rules.reduce((sum, r) => sum + r.questionCount, 0);

  const stats = [
    { value: String(questionCount), label: 'Questions' },
    { value: `${test.timeLimit}`,   label: 'Minutes'   },
    { value: `${test.passingScore}%`, label: 'Pass mark' },
    { value: test.type === 'dynamic' ? 'AI' : 'Fixed',  label: 'Mode' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg-alt)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={ghostBtnSm}>← Exit</button>
        <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>
          megamind<span style={{ color: 'var(--p-primary)' }}>.</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 28px' }}>
        <div style={{ maxWidth: 580, width: '100%' }}>

          {/* Chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={chip}><span style={dot} />{test.type === 'dynamic' ? 'AI adaptive' : 'Fixed paper'}</span>
            {test.tags?.map(tag => <span key={tag} style={chip}>{tag}</span>)}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--p-ink)', marginBottom: 14 }}>
            {test.title}
          </h1>
          {test.description && (
            <p style={{ fontSize: 16, color: 'var(--p-ink-2)', lineHeight: 1.55, marginBottom: 32 }}>{test.description}</p>
          )}

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 36 }}>
            {stats.map(s => (
              <div key={s.label} style={{ padding: 18, border: '2px solid var(--p-ink)', borderRadius: 14, background: 'var(--p-bg)', boxShadow: '4px 4px 0 var(--p-ink)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--p-ink)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onStart} style={{
              flex: 1, padding: '16px 24px', border: '2px solid var(--p-ink)', borderRadius: 999,
              background: 'var(--p-primary)', color: 'var(--p-primary-ink)',
              fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 16,
              cursor: 'pointer', boxShadow: '4px 4px 0 var(--p-ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'transform .12s, box-shadow .12s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 var(--p-ink)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 var(--p-ink)'; }}>
              ▶ Start Test
            </button>
            <button onClick={onBack} style={{ padding: '16px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' }}>
              Browse tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const chip: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '5px 12px', border: '1.5px solid var(--p-ink)', borderRadius: 999,
  fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 500,
  letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--p-bg)', color: 'var(--p-ink)',
};
const dot: React.CSSProperties = { width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)', flexShrink: 0 };
const ghostBtnSm: React.CSSProperties = {
  padding: '8px 14px', border: '2px solid var(--p-ink)', borderRadius: 999,
  background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '2px 2px 0 var(--p-ink)',
};

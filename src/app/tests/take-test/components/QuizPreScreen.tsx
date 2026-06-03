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
    { value: test.type === 'dynamic' ? 'AI' : 'Fixed', label: 'Mode' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg-alt)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--p-line)', padding: '13px 28px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--p-shadow-sm)' }}>
        <button onClick={onBack} style={ghostBtnSm}>← Exit</button>
        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 20, color: 'var(--p-ink)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--p-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 15, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
          megamind
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 28px' }}>
        <div style={{ maxWidth: 580, width: '100%' }}>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ ...chip, background: 'var(--p-primary-soft)', color: 'var(--p-primary-dark)', borderColor: 'transparent' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)', flexShrink: 0 }} />
              {test.type === 'dynamic' ? 'AI adaptive' : 'Fixed paper'}
            </span>
            {test.tags?.map(tag => <span key={tag} style={chip}>{tag}</span>)}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,50px)', letterSpacing: '-0.015em', lineHeight: 1.08, color: 'var(--p-ink)', marginBottom: 14 }}>
            {test.title}
          </h1>
          {test.description && (
            <p style={{ fontSize: 16, color: 'var(--p-ink-2)', lineHeight: 1.65, marginBottom: 32 }}>{test.description}</p>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 36, border: '1px solid var(--p-line)', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: 'var(--p-shadow-sm)' }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: 20, textAlign: 'center', borderRight: i < 3 ? '1px solid var(--p-line)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--p-ink)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onStart} style={{
              flex: 1, padding: '16px 24px', border: 'none', borderRadius: 14,
              background: 'var(--p-primary)', color: '#fff',
              fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 16,
              cursor: 'pointer', boxShadow: 'var(--p-shadow-orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'transform .15s, box-shadow .15s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 18px 38px rgba(255,106,44,0.34)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = 'var(--p-shadow-orange)'; }}>
              ▶ Start Test
            </button>
            <button onClick={onBack} style={{ padding: '16px 22px', border: '1.5px solid var(--p-line-2)', borderRadius: 14, background: '#fff', color: 'var(--p-ink)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--p-shadow-sm)' }}>
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
  padding: '5px 12px', border: '1px solid var(--p-line-2)', borderRadius: 999,
  fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)',
};
const ghostBtnSm: React.CSSProperties = {
  padding: '9px 16px', border: '1px solid var(--p-line-2)', borderRadius: 10,
  background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)',
  fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--p-shadow-sm)',
};

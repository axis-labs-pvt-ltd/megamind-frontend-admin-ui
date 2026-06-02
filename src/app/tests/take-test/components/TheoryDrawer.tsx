// Client Component - Slide-in theory panel
'use client';

import { Question } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  question: Question;
}

export function TheoryDrawer({ open, onClose, question }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,34,48,0.42)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .2s', zIndex: 99,
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 440, maxWidth: '92vw',
        background: '#fff',
        boxShadow: '-20px 0 60px rgba(24,28,46,0.18)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.7,0,.2,1)',
        zIndex: 100, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        {/* Warm header */}
        <div style={{ padding: '24px 28px', background: 'var(--p-peach)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-ink-peach)', marginBottom: 4 }}>📖 mini theory</div>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, color: 'var(--p-ink)' }}>Quick concept recap</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 17, display: 'grid', placeItems: 'center', color: 'var(--p-ink)', boxShadow: 'var(--p-shadow-sm)' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 28, flex: 1 }}>

          {/* Type/difficulty info box */}
          <div style={{ background: 'var(--p-bg-alt)', borderRadius: 14, padding: 18, marginBottom: 22, border: '1px solid var(--p-line)', fontFamily: 'var(--font-display,Nunito,sans-serif)' }}>
            <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 8 }}>QUESTION TYPE</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--p-ink)' }}>{question.type.toUpperCase()}</div>
            {question.difficulty && (
              <>
                <div style={{ height: 1, background: 'var(--p-line)', margin: '10px 0' }} />
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--p-ink-2)' }}>Difficulty: {question.difficulty}</div>
              </>
            )}
          </div>

          {/* Reference video */}
          {question.referenceVideoUrl && (
            <div style={{ marginBottom: 22 }}>
              <h4 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 16, fontWeight: 800, color: 'var(--p-ink)', marginBottom: 10 }}>🎥 Reference Material</h4>
              <a href={question.referenceVideoUrl} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', border: '1px solid var(--p-line)', borderRadius: 12,
                background: 'var(--p-blue)', color: 'var(--p-ink-blue)', textDecoration: 'none',
                fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14,
                boxShadow: 'var(--p-shadow-sm)',
              }}>
                → Watch reference video
              </a>
            </div>
          )}

          {/* Tip */}
          <div style={{ padding: 18, background: 'var(--p-bg-alt)', borderRadius: 14, fontSize: 14, color: 'var(--p-ink-2)', lineHeight: 1.65, marginBottom: 20, border: '1px solid var(--p-line)' }}>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)', marginBottom: 8 }}>💡 Quick tip</div>
            Read the question carefully. Eliminate obviously wrong options first, then choose between the remaining ones based on your understanding of the concept.
          </div>

          {/* Related topics */}
          {question.categories.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 12 }}>Related concept</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {question.categories.map(c => (
                  <span key={c.id} style={{ padding: '5px 13px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)', border: '1px solid var(--p-line)' }}>
                    → {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

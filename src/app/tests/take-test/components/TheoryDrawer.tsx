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
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .2s', zIndex: 99,
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 420, maxWidth: '90vw',
        background: 'var(--p-bg)', borderLeft: '2px solid var(--p-ink)',
        boxShadow: '-10px 0 0 rgba(0,0,0,0.05)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.7,0,.2,1)',
        zIndex: 100, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        {/* Amber header */}
        <div style={{ padding: '26px 28px', borderBottom: '2px solid var(--p-ink)', background: 'var(--p-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink)', marginBottom: 4 }}>📖 mini theory</div>
            <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, color: 'var(--p-ink)' }}>Quick concept recap</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 999, border: '2px solid var(--p-ink)', background: 'var(--p-bg)', cursor: 'pointer', fontSize: 18, display: 'grid', placeItems: 'center', color: 'var(--p-ink)' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 28, flex: 1 }}>

          {/* Question type / difficulty info box */}
          <div style={{ background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)', borderRadius: 12, padding: 18, marginBottom: 22, fontFamily: 'var(--font-mono,monospace)', fontSize: 13 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 8 }}>QUESTION TYPE</div>
            <div style={{ color: 'var(--p-ink)', fontWeight: 700 }}>{question.type.toUpperCase()}</div>
            {question.difficulty && (
              <>
                <div style={{ height: 1, background: 'var(--p-ink)', opacity: 0.15, margin: '10px 0' }} />
                <div style={{ fontWeight: 500, color: 'var(--p-ink-2)' }}>Difficulty: {question.difficulty}</div>
              </>
            )}
          </div>

          {/* Reference video */}
          {question.referenceVideoUrl && (
            <div style={{ marginBottom: 22 }}>
              <h4 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 16, fontWeight: 700, color: 'var(--p-ink)', marginBottom: 10 }}>🎥 Reference Material</h4>
              <a href={question.referenceVideoUrl} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', border: '2px solid var(--p-ink)', borderRadius: 12,
                background: 'var(--p-card-c)', color: 'var(--p-ink)', textDecoration: 'none',
                fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14,
                boxShadow: '3px 3px 0 var(--p-ink)',
              }}>
                → Watch reference video
              </a>
            </div>
          )}

          {/* Tip */}
          <div style={{ padding: 16, background: 'var(--p-card-c)', border: '2px solid var(--p-ink)', borderRadius: 12, fontSize: 14, color: 'var(--p-ink)', lineHeight: 1.65, marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink-2)', marginBottom: 8 }}>💡 Quick tip</div>
            Read the question carefully. Eliminate obviously wrong options first, then choose between the remaining ones based on your understanding of the concept.
          </div>

          {/* Related topics */}
          {question.categories.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 10 }}>Related concept</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {question.categories.map(c => (
                  <span key={c.id} style={{ padding: '4px 12px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, background: 'var(--p-bg)', color: 'var(--p-ink)' }}>
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

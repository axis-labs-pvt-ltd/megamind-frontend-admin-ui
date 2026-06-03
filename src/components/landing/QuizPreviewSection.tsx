// Client Component - Interactive quiz demo on landing page
'use client';

import { useState } from 'react';

const DEMO = {
  subject: 'Physics', module: 'Waves · Module 04',
  question: 'A sound wave travels at 340 m/s through air. What is the wavelength of a 680 Hz tone?',
  options: [{ id: 'A', text: '0.5 m' }, { id: 'B', text: '0.5 cm' }, { id: 'C', text: '5.0 m' }, { id: 'D', text: '2.0 m' }],
  correct: 'A',
  theory: { title: 'Wave speed formula', body: 'The speed of a wave (v) equals its frequency (f) times wavelength (λ). Rearrange: λ = v ÷ f. Here λ = 340 ÷ 680 = 0.5 m.' },
};

export function QuizPreviewSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const reset = () => { setSelected(null); setRevealed(false); setShowTheory(false); };

  return (
    <section id="quiz" style={{ padding: '84px 0', background: 'var(--p-bg-warm)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} className="quiz-prev-grid">

          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              Try it live
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.1, marginBottom: 20, color: 'var(--p-ink)' }}>
              Stuck? Tap <span style={{ color: 'var(--p-primary)' }}>&ldquo;show theory&rdquo;</span> — we&apos;ll teach you in 30 seconds.
            </h2>
            <p style={{ fontSize: 'clamp(15px,1.2vw,17px)', color: 'var(--p-ink-2)', lineHeight: 1.65, maxWidth: 480, marginBottom: 28 }}>
              This is the actual Megamind question format. Answer first, or peek the theory and learn the concept before you commit.
            </p>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                ['Bite-sized theory',  'Each concept in 30–60 seconds, not a 20-page PDF.'],
                ['AI hints on demand', "Stuck after 15 seconds? The AI nudges, doesn't spoil."],
                ['No penalty for peeking', 'Learning is the point — score is secondary.'],
              ].map(([h, b]) => (
                <div key={h} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--p-primary)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: 'var(--p-shadow-orange)' }}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, color: 'var(--p-ink)', marginBottom: 2 }}>{h}</div>
                    <div style={{ fontSize: 13, color: 'var(--p-muted)', lineHeight: 1.5 }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz card */}
          <div style={{ padding: 28, border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, background: 'var(--p-peach)', color: 'var(--p-ink-peach)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--p-ink-peach)' }} />{DEMO.subject}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 11px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)' }}>{DEMO.module}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 12, fontWeight: 700, color: 'var(--p-muted)' }}>Q 04 / 10</span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 8, borderRadius: 999, background: 'var(--p-line)', overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ height: '100%', width: '40%', borderRadius: 999, background: 'var(--p-primary)', transition: 'width .3s' }} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 18, color: 'var(--p-ink)' }}>{DEMO.question}</h3>

            <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
              {DEMO.options.map(o => {
                const isCorrect = o.id === DEMO.correct;
                const isSelected = selected === o.id;
                let bg = '#fff', borderColor = 'var(--p-line-2)', textColor = 'var(--p-ink)';
                if (revealed) {
                  if (isCorrect) { bg = 'var(--p-mint)'; borderColor = 'var(--p-ink-mint)'; textColor = 'var(--p-ink-mint)'; }
                  else if (isSelected) { bg = 'var(--p-pink)'; borderColor = 'var(--p-ink-pink)'; textColor = 'var(--p-ink-pink)'; }
                } else if (isSelected) { bg = 'var(--p-primary-soft)'; borderColor = 'var(--p-primary)'; textColor = 'var(--p-primary-dark)'; }
                return (
                  <button key={o.id} disabled={revealed} onClick={() => setSelected(o.id)} style={{
                    padding: '13px 15px', border: `1.5px solid ${borderColor}`, borderRadius: 14,
                    background: bg, color: textColor,
                    fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    cursor: revealed ? 'default' : 'pointer', width: '100%',
                    boxShadow: isSelected && !revealed ? 'var(--p-shadow-sm)' : 'none',
                    transition: 'border-color .12s, background .12s',
                  }}>
                    <span style={{ width: 30, height: 30, borderRadius: 9, background: isSelected && !revealed ? 'var(--p-primary)' : 'var(--p-bg-alt)', color: isSelected && !revealed ? '#fff' : 'var(--p-ink-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{o.id}</span>
                    <span style={{ flex: 1 }}>{o.text}</span>
                    {revealed && isCorrect && <span style={{ color: 'var(--p-ink-mint)', fontWeight: 900 }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {!showTheory ? (
              <button onClick={() => setShowTheory(true)} style={{ width: '100%', padding: '11px 14px', border: '1.5px dashed var(--p-line-2)', background: 'var(--p-bg-alt)', borderRadius: 12, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, color: 'var(--p-ink-2)', cursor: 'pointer' }}>
                📖 Show theory · no penalty
              </button>
            ) : (
              <div style={{ padding: 16, background: 'var(--p-bg-alt)', borderRadius: 14, marginBottom: 14, border: '1px solid var(--p-line)' }}>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)', marginBottom: 7 }}>📖 {DEMO.theory.title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--p-ink-2)' }}>{DEMO.theory.body}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {!revealed ? (
                <button onClick={() => { if (selected) setRevealed(true); }} disabled={!selected} style={{ flex: 1, padding: '13px 18px', borderRadius: 12, border: 'none', background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, cursor: selected ? 'pointer' : 'not-allowed', opacity: selected ? 1 : 0.45, boxShadow: 'var(--p-shadow-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Submit answer →</button>
              ) : (
                <>
                  <button onClick={reset} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: '1.5px solid var(--p-line-2)', background: '#fff', color: 'var(--p-ink)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--p-shadow-sm)' }}>Try again</button>
                  <button onClick={reset} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: 'none', background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--p-shadow-orange)' }}>Next question →</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 960px) { .quiz-prev-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

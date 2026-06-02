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
    <section id="quiz" style={{ padding: '110px 0', background: 'var(--p-bg)', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} className="quiz-prev-grid">

          {/* Left */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />Try it live
            </span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,46px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 18, marginBottom: 20, color: 'var(--p-ink)' }}>
              Stuck? Tap <span style={{ color: 'var(--p-primary)' }}>&ldquo;show theory&rdquo;</span> — we&apos;ll teach you in 30 seconds.
            </h2>
            <p style={{ fontSize: 17, color: 'var(--p-ink-2)', lineHeight: 1.55, maxWidth: 480, marginBottom: 28 }}>
              This is the actual Megamind question format. Answer first, or peek the theory and learn the concept before you commit.
            </p>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                ['Bite-sized theory', 'Each concept in 30–60 seconds, not a 20-page PDF.'],
                ['AI hints on demand', "Stuck after 15 seconds? The AI nudges, doesn't spoil."],
                ['No penalty for peeking', 'Learning is the point — score is secondary.'],
              ].map(([h, b]) => (
                <div key={h} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', display: 'grid', placeItems: 'center', border: '2px solid var(--p-ink)', flexShrink: 0 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-display,sans-serif)', fontSize: 15, color: 'var(--p-ink)' }}>{h}</div>
                    <div style={{ fontSize: 13, color: 'var(--p-muted)' }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz card */}
          <div style={{ padding: 28, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: 'var(--p-card-a)', color: 'var(--p-ink)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--p-primary)' }} />{DEMO.subject}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: 'var(--p-bg)', color: 'var(--p-ink)' }}>{DEMO.module}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 600, color: 'var(--p-muted)' }}>Q 04 / 10</span>
            </div>

            <div style={{ height: 8, background: 'var(--p-bg-alt)', border: '2px solid var(--p-ink)', borderRadius: 999, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ height: '100%', width: '40%', background: 'var(--p-primary)' }} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 20, fontWeight: 600, lineHeight: 1.35, marginBottom: 18, color: 'var(--p-ink)' }}>{DEMO.question}</h3>

            <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
              {DEMO.options.map(o => {
                const isCorrect = o.id === DEMO.correct;
                const isSelected = selected === o.id;
                let bg = 'var(--p-bg)', color = 'var(--p-ink)';
                if (revealed) {
                  if (isCorrect) bg = 'var(--p-card-d)';
                  else if (isSelected) bg = 'var(--p-card-b)';
                } else if (isSelected) { bg = 'var(--p-primary)'; color = 'var(--p-primary-ink)'; }
                return (
                  <button key={o.id} disabled={revealed} onClick={() => setSelected(o.id)} style={{
                    padding: '13px 15px', border: '2px solid var(--p-ink)', borderRadius: 12,
                    background: bg, color, fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    cursor: revealed ? 'default' : 'pointer',
                    boxShadow: isSelected && !revealed ? '2px 2px 0 var(--p-ink)' : 'none',
                  }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, border: '1.5px solid currentColor', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{o.id}</span>
                    <span style={{ flex: 1 }}>{o.text}</span>
                    {revealed && isCorrect && <span>✓</span>}
                  </button>
                );
              })}
            </div>

            {!showTheory ? (
              <button onClick={() => setShowTheory(true)} style={{ width: '100%', padding: '11px 14px', border: '2px dashed var(--p-ink)', background: 'var(--p-bg-alt)', borderRadius: 12, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, color: 'var(--p-ink)', cursor: 'pointer' }}>
                ✦ Show theory · no penalty
              </button>
            ) : (
              <div style={{ padding: 14, background: 'var(--p-secondary)', border: '2px solid var(--p-ink)', borderRadius: 12, marginBottom: 14, color: 'var(--p-ink)' }}>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>📖 {DEMO.theory.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55 }}>{DEMO.theory.body}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {!revealed ? (
                <button onClick={() => { if (selected) setRevealed(true); }} disabled={!selected} style={{ flex: 1, padding: '13px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: selected ? 'pointer' : 'not-allowed', opacity: selected ? 1 : 0.45, boxShadow: '3px 3px 0 var(--p-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Submit answer →</button>
              ) : (
                <>
                  <button onClick={reset} style={{ flex: 1, padding: '12px 14px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '2px 2px 0 var(--p-ink)' }}>Try again</button>
                  <button onClick={reset} style={{ flex: 1, padding: '12px 14px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '2px 2px 0 var(--p-ink)' }}>Next question →</button>
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

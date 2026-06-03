// Client Component - Active quiz interface
'use client';

import { Question, Test } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { TheoryDrawer } from './TheoryDrawer';

interface Props {
  test: Test;
  questions: Question[];
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onExit: () => void;
}

export function QuizActiveScreen({ test, questions, answers, onAnswerChange, onSubmit, isSubmitting, onExit }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTheory, setShowTheory]     = useState(false);
  const [flagged, setFlagged]           = useState<Set<string>>(new Set());
  const [elapsed, setElapsed]           = useState(0);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSeconds = test.timeLimit * 60;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(s => {
        if (s + 1 >= totalSeconds) { clearInterval(timerRef.current!); onSubmit(); }
        return s + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const remaining = totalSeconds - elapsed;
  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  const isWarning = remaining < 120;

  const current       = questions[currentIndex];
  const userAnswer    = answers[current?.id];
  const answeredCount = Object.keys(answers).length;

  const selectOption = (optId: string) => {
    if (!current) return;
    if (current.type === 'multi-select') {
      const prev = Array.isArray(userAnswer) ? [...userAnswer] : [];
      onAnswerChange(current.id, prev.includes(optId) ? prev.filter(x => x !== optId) : [...prev, optId]);
    } else {
      onAnswerChange(current.id, optId);
    }
  };

  const toggleFlag = () => {
    const next = new Set(flagged);
    next.has(current.id) ? next.delete(current.id) : next.add(current.id);
    setFlagged(next);
  };

  if (!current) return null;

  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--p-bg-alt)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @media (max-width: 600px) {
          .quiz-topbar { padding: 10px 14px !important; flex-wrap: wrap; gap: 8px; }
          .quiz-topbar-title { font-size: 13px !important; }
          .quiz-topbar-sub { display: none !important; }
          .quiz-topbar-right { font-size: 11px !important; gap: 10px !important; }
          .quiz-progress { padding: 8px 14px !important; }
          .quiz-main { padding: 28px 0 80px !important; }
          .quiz-inner { padding: 0 14px !important; }
          .quiz-nav { padding-top: 16px !important; }
          .quiz-nav button { padding: 11px 16px !important; font-size: 13px !important; }
        }
      `}</style>

      {/* Sticky top bar */}
      <div className="quiz-topbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid var(--p-line)', padding: '13px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--p-shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onExit} style={ghostSm}>← Exit</button>
          <div>
            <div className="quiz-topbar-title" style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, color: 'var(--p-ink)' }}>{test.title}</div>
            <div className="quiz-topbar-sub" style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 2 }}>
              Question {currentIndex + 1} of {questions.length} · ~{test.timeLimit} min total
            </div>
          </div>
        </div>
        <div className="quiz-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 14, fontWeight: 800, color: isWarning ? '#C23A6B' : 'var(--p-ink)' }}>
            ⏱ {mins}:{secs}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, background: 'var(--p-mint)', color: 'var(--p-ink-mint)' }}>
            ✓ {answeredCount} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="quiz-progress" style={{ background: '#fff', padding: '10px 28px', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', maxWidth: 760, margin: '0 auto' }}>
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent  = i === currentIndex;
            return (
              <button key={q.id} onClick={() => setCurrentIndex(i)} title={`Q${i + 1}`} style={{
                flex: 1, maxWidth: 80, height: 7,
                background: isCurrent ? 'var(--p-primary)' : isAnswered ? 'var(--p-ink-mint)' : 'var(--p-line)',
                border: 'none', borderRadius: 999,
                cursor: 'pointer', transition: 'background .15s', padding: 0,
              }} />
            );
          })}
        </div>
      </div>

      {/* Question area */}
      <main className="quiz-main" style={{ flex: 1, padding: '48px 0 100px' }}>
        <div className="quiz-inner" style={{ maxWidth: 760, margin: '0 auto', padding: '0 28px' }}>

          {/* Chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
            <span style={chipStyle(diffTint(current.difficulty))}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: diffInk(current.difficulty), flexShrink: 0 }} />
              {current.difficulty || 'standard'}
            </span>
            {test.type === 'dynamic' && (
              <span style={{ ...chipStyle('var(--p-lav)'), color: 'var(--p-ink-lav)' }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--p-ink-lav)', flexShrink: 0 }} />AI adaptive
              </span>
            )}
            {flagged.has(current.id) && <span style={chipStyle('var(--p-yellow)')}>⚑ Flagged</span>}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(20px,2.5vw,30px)', lineHeight: 1.35, color: 'var(--p-ink)', marginBottom: 28 }}>
            {current.text}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {(current.options ?? []).map((opt, i) => {
              const isSelected = Array.isArray(userAnswer) ? userAnswer.includes(opt.id) : userAnswer === opt.id;
              return (
                <div key={opt.id} onClick={() => selectOption(opt.id)} style={{
                  padding: '16px 18px', border: `1.5px solid ${isSelected ? 'var(--p-primary)' : 'var(--p-line-2)'}`, borderRadius: 14,
                  background: isSelected ? 'var(--p-primary-soft)' : '#fff',
                  color: isSelected ? 'var(--p-primary-dark)' : 'var(--p-ink)',
                  display: 'flex', gap: 14, alignItems: 'center',
                  fontSize: 16, fontWeight: 500, cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--p-shadow-sm)' : 'none',
                  transition: 'border-color .12s, background .12s, box-shadow .12s',
                }}
                  onMouseEnter={e => { if (!isSelected) { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--p-primary)'; el.style.background = 'var(--p-primary-soft)'; } }}
                  onMouseLeave={e => { if (!isSelected) { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--p-line-2)'; el.style.background = '#fff'; } }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: isSelected ? 'var(--p-primary)' : 'var(--p-bg-alt)', color: isSelected ? '#fff' : 'var(--p-ink-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 13, flexShrink: 0 }}>
                    {LETTERS[i]}
                  </span>
                  <span style={{ flex: 1 }}>{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Help row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            <button onClick={() => setShowTheory(true)} style={ghostSm}>📖 Show theory</button>
            <button onClick={toggleFlag} style={{ ...ghostSm, background: flagged.has(current.id) ? 'var(--p-yellow)' : '#fff', borderColor: flagged.has(current.id) ? 'var(--p-ink-yellow)' : 'var(--p-line-2)', color: flagged.has(current.id) ? 'var(--p-ink-yellow)' : 'var(--p-ink-2)' }}>
              ⚑ {flagged.has(current.id) ? 'Unflag' : 'Flag question'}
            </button>
          </div>

          {/* Navigation */}
          <div className="quiz-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid var(--p-line)' }}>
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}
              style={{ ...ghostBtn, opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}>
              ← Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => i + 1)} style={primaryBtn}>Next question →</button>
            ) : (
              <button onClick={onSubmit} disabled={isSubmitting}
                style={{ ...primaryBtn, opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Submitting…' : 'Submit test →'}
              </button>
            )}
          </div>
        </div>
      </main>

      <TheoryDrawer open={showTheory} onClose={() => setShowTheory(false)} question={current} />
    </div>
  );
}

function diffTint(d?: string) {
  if (d === 'easy') return 'var(--p-mint)';
  if (d === 'hard') return 'var(--p-pink)';
  return 'var(--p-blue)';
}
function diffInk(d?: string) {
  if (d === 'easy') return 'var(--p-ink-mint)';
  if (d === 'hard') return 'var(--p-ink-pink)';
  return 'var(--p-ink-blue)';
}

const chipStyle = (bg: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '5px 12px', borderRadius: 999, border: 'none',
  fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 11, fontWeight: 800,
  letterSpacing: '0.04em', textTransform: 'uppercase', background: bg,
});
const ghostSm: React.CSSProperties   = { padding: '9px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: 'var(--p-shadow-sm)', transition: 'border-color .12s' };
const ghostBtn: React.CSSProperties  = { padding: '12px 22px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', color: 'var(--p-ink)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--p-shadow-sm)' };
const primaryBtn: React.CSSProperties = { padding: '12px 24px', border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--p-shadow-orange)' };

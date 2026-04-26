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

  const current      = questions[currentIndex];
  const userAnswer   = answers[current?.id];
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
    <div style={{ minHeight: '100vh', background: 'var(--p-bg-alt)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Sticky top bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onExit} style={ghostSm}>← Exit</button>
          <div>
            <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: 'var(--p-ink)' }}>{test.title}</div>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
              Question {currentIndex + 1} of {questions.length} · ~{test.timeLimit} min total
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 13, color: isWarning ? '#D94A3D' : 'var(--p-ink)', fontWeight: 600 }}>
            ⏱ {mins}:{secs}
          </span>
          <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-ink)' }}>
            {answeredCount} / {questions.length} answered
          </span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ background: 'var(--p-bg)', padding: '12px 28px', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', maxWidth: 760, margin: '0 auto' }}>
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent  = i === currentIndex;
            return (
              <button key={q.id} onClick={() => setCurrentIndex(i)} title={`Q${i + 1}`} style={{
                flex: 1, maxWidth: 80, height: 6,
                background: isCurrent ? 'var(--p-primary)' : isAnswered ? 'var(--p-card-d)' : 'var(--p-bg-alt)',
                border: '1.5px solid var(--p-ink)', borderRadius: 999,
                cursor: 'pointer', transition: 'background .15s', padding: 0,
              }} />
            );
          })}
        </div>
      </div>

      {/* ── Question area ── */}
      <main style={{ flex: 1, padding: '48px 0 100px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 28px' }}>

          {/* Chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
            <span style={chip}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)', flexShrink: 0 }} />
              {current.moduleId ? `Module ${current.moduleId.slice(0, 6)}` : 'Question'}
            </span>
            <span style={{ ...chip, background: diffColor(current.difficulty), textTransform: 'uppercase' }}>
              {current.difficulty}
            </span>
            {test.type === 'dynamic' && (
              <span style={{ ...chip, background: 'var(--p-accent)', color: 'white', borderColor: 'var(--p-ink)' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'white', flexShrink: 0 }} />AI adaptive
              </span>
            )}
            {flagged.has(current.id) && <span style={{ ...chip, background: 'var(--p-card-a)' }}>⚑ Flagged</span>}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 'clamp(20px,2.5vw,32px)', lineHeight: 1.3, color: 'var(--p-ink)', marginBottom: 28 }}>
            {current.text}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {(current.options ?? []).map((opt, i) => {
              const isSelected = Array.isArray(userAnswer) ? userAnswer.includes(opt.id) : userAnswer === opt.id;
              return (
                <div key={opt.id} onClick={() => selectOption(opt.id)} style={{
                  padding: '18px 20px', border: '2px solid var(--p-ink)', borderRadius: 14,
                  background: isSelected ? 'var(--p-primary)' : 'var(--p-bg)',
                  color: isSelected ? 'var(--p-primary-ink)' : 'var(--p-ink)',
                  display: 'flex', gap: 14, alignItems: 'center',
                  fontSize: 16, fontWeight: 500, cursor: 'pointer',
                  boxShadow: isSelected ? '3px 3px 0 var(--p-ink)' : 'none',
                  transition: 'transform .12s, box-shadow .12s',
                }}
                  onMouseEnter={e => { if (!isSelected) { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(-2px,-2px)'; el.style.boxShadow = '3px 3px 0 var(--p-ink)'; } }}
                  onMouseLeave={e => { if (!isSelected) { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = 'none'; } }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid currentColor', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono,monospace)', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
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
            <button onClick={toggleFlag} style={{ ...ghostSm, background: flagged.has(current.id) ? 'var(--p-card-a)' : 'var(--p-bg)' }}>
              ⚑ {flagged.has(current.id) ? 'Unflag' : 'Flag question'}
            </button>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 22, borderTop: '2px dashed var(--p-ink)' }}>
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}
              style={{ ...ghostBtn, opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}>
              ← Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => i + 1)} style={primaryBtn}>
                Next question →
              </button>
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

function diffColor(d?: string) {
  if (d === 'easy') return 'var(--p-card-d)';
  if (d === 'hard') return 'var(--p-card-b)';
  return 'var(--p-card-c)';
}

const chip: React.CSSProperties     = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--p-bg)', color: 'var(--p-ink)' };
const ghostSm: React.CSSProperties  = { padding: '8px 14px',  border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)',      color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '2px 2px 0 var(--p-ink)' };
const ghostBtn: React.CSSProperties = { padding: '12px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)',      color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' };
const primaryBtn: React.CSSProperties = { padding: '12px 24px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' };

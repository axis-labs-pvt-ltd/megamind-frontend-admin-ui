// Client Component - Quiz result screen
'use client';

import { Question, Test } from '@/types';
import { useState } from 'react';
import { SolutionDialog } from './SolutionDialog';

interface Props {
  test: Test;
  result: { score: number; correctAnswers: number; totalQuestions: number; timeSpent: number };
  questions: Question[];
  answers: Record<string, string | string[]>;
  onRetake: () => void;
  onBack: () => void;
}

export function QuizResultScreen({ test, result, questions, answers, onRetake, onBack }: Props) {
  const [solutionQuestion, setSolutionQuestion] = useState<Question | null>(null);
  const [solutionAnswer, setSolutionAnswer] = useState<{ userAnswer: string | string[] | null; isCorrect: boolean } | null>(null);

  const openSolution = (q: Question, userAns: string | string[] | undefined, correct: boolean) => {
    setSolutionQuestion(q);
    setSolutionAnswer({ userAnswer: userAns ?? null, isCorrect: correct });
  };
  const closeSolution = () => { setSolutionQuestion(null); setSolutionAnswer(null); };
  const passed  = result.score >= test.passingScore;
  const mins    = Math.floor(result.timeSpent / 60);
  const secs    = result.timeSpent % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  // SVG score circle
  const r      = 120;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (result.score / 100) * circ;

  // Derive topic breakdown from question categories
  const topicMap: Record<string, { got: number; total: number }> = {};
  questions.forEach(q => {
    const userAns  = answers[q.id];
    const correct  = !!userAns && JSON.stringify(userAns) === JSON.stringify(q.correctAnswer);
    const topics   = q.categories?.length ? q.categories.map(c => c.name) : ['General'];
    topics.forEach(t => {
      if (!topicMap[t]) topicMap[t] = { got: 0, total: 0 };
      topicMap[t].total++;
      if (correct) topicMap[t].got++;
    });
  });
  const topics = Object.entries(topicMap).map(([name, v]) => ({ name, ...v, pct: Math.round((v.got / v.total) * 100) }));

  // AI feedback bullets derived from score
  const weakTopics   = topics.filter(t => t.pct < 60).map(t => t.name);
  const strongTopics = topics.filter(t => t.pct === 100).map(t => t.name);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--p-bg)' }}>
      <style>{`
        @media (max-width: 860px) { .res-grid, .ai-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) {
          .res-hero { padding: 48px 0 !important; }
          .res-hero-inner { padding: 0 14px !important; gap: 28px !important; }
          .res-score-circle { width: 200px !important; height: 200px !important; }
          .res-score-circle svg { width: 200px !important; height: 200px !important; }
          .res-big-score { font-size: 60px !important; }
          .res-stats { gap: 18px !important; }
          .res-body { padding: 40px 0 !important; }
          .res-body-inner { padding: 0 14px !important; gap: 16px !important; }
          .res-review { padding: 0 0 60px !important; }
          .res-review-inner { padding: 0 14px !important; }
          .res-q-row { grid-template-columns: 40px 1fr !important; }
          .res-q-btn { display: none !important; }
        }
      `}</style>

      {/* ── Dark hero ── */}
      <section className="res-hero" style={{ background: 'var(--p-ink)', color: 'var(--p-bg)', padding: '80px 0', borderBottom: '0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }} className="res-hero-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 50, alignItems: 'center' }} className="res-grid">

            {/* Score circle */}
            <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
              <svg width={280} height={280} viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={140} cy={140} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={20} fill="none" />
                <circle cx={140} cy={140} r={r} stroke="var(--p-secondary)" strokeWidth={20} fill="none"
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 80, lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--p-bg)' }}>
                  {result.score}<span style={{ fontSize: 36 }}>%</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, opacity: 0.7, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {result.correctAnswers} of {result.totalQuestions} correct
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', border: '1.5px solid var(--p-bg)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-bg)', background: 'transparent', textTransform: 'uppercase' }}>
                  {test.title}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', border: '1.5px solid var(--p-bg)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-bg)', background: passed ? '#2D6A4F' : '#D94A3D', textTransform: 'uppercase' }}>
                  {passed ? '✓ Passed' : '✕ Not passed'}
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,4.5vw,64px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16, color: 'var(--p-bg)' }}>
                {passed ? 'Solid run!' : 'Good effort!'}
              </h1>
              <p style={{ fontSize: 17, opacity: 0.85, maxWidth: 540, marginBottom: 26, lineHeight: 1.55 }}>
                You scored <strong>{result.score}%</strong> on this test.
                {passed
                  ? ` You passed with a margin of ${result.score - test.passingScore}% above the pass mark.`
                  : ` You needed ${test.passingScore}% to pass — keep practicing!`}
              </p>

              <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
                <Stat big={timeStr}                                 label="Time taken"      />
                <Stat big={`+${result.correctAnswers * 15}`}        label="XP earned"       accent />
                <Stat big={`${result.correctAnswers}/${result.totalQuestions}`} label="Correct"  />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI feedback + topic breakdown ── */}
      <section className="res-body" style={{ padding: '80px 0' }}>
        <div className="res-body-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }} className="ai-grid">

            {/* AI feedback card */}
            <div style={{ padding: 28, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, background: 'var(--p-accent)', color: 'white' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'white', flexShrink: 0 }} />AI feedback
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 26, fontWeight: 700, color: 'var(--p-ink)', marginBottom: 14 }}>What I noticed.</h2>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {strongTopics.length > 0 && (
                  <li style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: '#2D6A4F', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <div style={{ color: 'var(--p-ink)', fontSize: 14, lineHeight: 1.55 }}>
                      <b>{strongTopics.join(', ')}</b> — you answered all of these correctly on the first try.
                    </div>
                  </li>
                )}
                {weakTopics.length > 0 && (
                  <li style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--p-primary)', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>!</span>
                    <div style={{ color: 'var(--p-ink)', fontSize: 14, lineHeight: 1.55 }}>
                      <b>{weakTopics.join(', ')}</b> — these tripped you up. We'll target them in your next session.
                    </div>
                  </li>
                )}
                <li style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: 'var(--p-primary)', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>!</span>
                  <div style={{ color: 'var(--p-ink)', fontSize: 14, lineHeight: 1.55 }}>
                    Your score is <b>{result.score}%</b> — {result.score >= test.passingScore ? 'above' : 'below'} the {test.passingScore}% pass mark.
                  </div>
                </li>
              </ul>

              <div style={{ marginTop: 22, paddingTop: 20, borderTop: '1.5px dashed var(--p-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: 'var(--p-ink)' }}>Recommended next</div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>
                    {weakTopics.length > 0 ? `Practice ${weakTopics[0]}` : 'Try a harder level'}
                  </div>
                </div>
                <button onClick={onRetake} style={smBtn}>Start →</button>
              </div>
            </div>

            {/* Topic breakdown card */}
            <div style={{ padding: 28, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)' }}>
              <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 26, fontWeight: 700, color: 'var(--p-ink)', marginBottom: 6 }}>Topic breakdown</h2>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 22 }}>how you did per sub-topic</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {topics.length === 0 ? (
                  <p style={{ color: 'var(--p-muted)', fontSize: 14 }}>No topic data available.</p>
                ) : topics.map(t => (
                  <div key={t.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, color: 'var(--p-ink)' }}>{t.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)' }}>{t.got}/{t.total} · {t.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--p-bg-alt)', border: '1.5px solid var(--p-ink)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${t.pct}%`, background: t.pct === 100 ? '#2D6A4F' : t.pct === 0 ? '#D94A3D' : 'var(--p-primary)', transition: 'width .4s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Question review ── */}
      <section className="res-review" style={{ padding: '0 0 100px' }}>
        <div className="res-review-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-0.02em', color: 'var(--p-ink)', marginBottom: 24 }}>
            Review your{' '}
            <span style={{ display: 'inline-block', position: 'relative' }}>
              {result.totalQuestions} answers.
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: -5, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%232D6A4F' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {questions.map((q, i) => {
              const userAns  = answers[q.id];
              const isCorrect = !!userAns && JSON.stringify(userAns) === JSON.stringify(q.correctAnswer);
              return (
                <div key={q.id} style={{
                  padding: '16px 20px', border: '2px solid var(--p-ink)', borderRadius: 14,
                  background: isCorrect ? 'var(--p-bg)' : 'var(--p-card-b)',
                  display: 'flex', alignItems: 'center', gap: 16,
                  boxShadow: '3px 3px 0 var(--p-ink)',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: isCorrect ? '#2D6A4F' : '#D94A3D', color: 'white', border: '2px solid var(--p-ink)', display: 'grid', placeItems: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {isCorrect ? '✓' : '✕'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 3 }}>Q {String(i + 1).padStart(2, '0')}</div>
                    <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 500, fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.4 }}>{q.text}</div>
                  </div>
                  <button onClick={() => openSolution(q, userAns, isCorrect)} style={smGhost}>
                    {isCorrect ? 'Review' : 'See solution'} →
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={onRetake} style={primaryBtn}>Practice weak spots →</button>
            <button onClick={onBack}   style={ghostBtn}>Back to module</button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .res-grid, .ai-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {solutionQuestion && solutionAnswer && (
        <SolutionDialog
          question={solutionQuestion}
          userAnswer={solutionAnswer.userAnswer}
          isCorrect={solutionAnswer.isCorrect}
          onClose={closeSolution}
        />
      )}
    </div>
  );
}

function Stat({ big, label, accent }: { big: string; label: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1, color: accent ? 'var(--p-secondary)' : 'var(--p-bg)' }}>{big}</div>
      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-bg-alt)', marginTop: 4, opacity: 0.75 }}>{label}</div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = { padding: '13px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' };
const ghostBtn: React.CSSProperties   = { padding: '13px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)',      color: 'var(--p-ink)',          fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' };
const smBtn: React.CSSProperties      = { padding: '8px 16px',  border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '2px 2px 0 var(--p-ink)' };
const smGhost: React.CSSProperties    = { padding: '7px 12px',  border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)',      color: 'var(--p-ink)',          fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 12, textDecoration: 'none', flexShrink: 0, boxShadow: '2px 2px 0 var(--p-ink)', whiteSpace: 'nowrap', cursor: 'pointer' };

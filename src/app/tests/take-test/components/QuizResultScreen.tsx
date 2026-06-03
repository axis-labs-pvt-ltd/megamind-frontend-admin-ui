// Client Component
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

const C_OK  = '#1F8A5B';
const C_BAD = '#E0533D';

export function QuizResultScreen({ test, result, questions, answers, onRetake, onBack }: Props) {
  const [solutionQuestion, setSolutionQuestion] = useState<Question | null>(null);
  const [solutionAnswer, setSolutionAnswer] = useState<{ userAnswer: string | string[] | null; isCorrect: boolean } | null>(null);

  const openSolution = (q: Question, userAns: string | string[] | undefined, correct: boolean) => {
    setSolutionQuestion(q); setSolutionAnswer({ userAnswer: userAns ?? null, isCorrect: correct });
  };
  const closeSolution = () => { setSolutionQuestion(null); setSolutionAnswer(null); };

  const passed  = result.score >= test.passingScore;
  const mins    = Math.floor(result.timeSpent / 60);
  const secs    = result.timeSpent % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  const r      = 120;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (result.score / 100) * circ;

  const topicMap: Record<string, { got: number; total: number }> = {};
  questions.forEach(q => {
    const correct = !!answers[q.id] && JSON.stringify(answers[q.id]) === JSON.stringify(q.correctAnswer);
    const topics  = q.categories?.length ? q.categories.map(c => c.name) : ['General'];
    topics.forEach(t => {
      if (!topicMap[t]) topicMap[t] = { got: 0, total: 0 };
      topicMap[t].total++;
      if (correct) topicMap[t].got++;
    });
  });
  const topics      = Object.entries(topicMap).map(([name, v]) => ({ name, ...v, pct: Math.round((v.got / v.total) * 100) }));
  const weakTopics  = topics.filter(t => t.pct < 60).map(t => t.name);
  const strongTopics = topics.filter(t => t.pct === 100).map(t => t.name);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--p-bg)' }}>
      <style>{`
        .res-grid, .ai-grid { display:grid; }
        .res-grid { grid-template-columns:1fr 1.6fr; gap:50px; align-items:center; }
        .ai-grid  { grid-template-columns:1fr 1fr; gap:30px; }
        .res-bar  { height:8px; border-radius:999px; background:var(--p-bg-alt); overflow:hidden; }
        .res-bar span { display:block; height:100%; border-radius:999px; transition:width .4s; }
        .res-crumbs { font-family:var(--font-display,sans-serif); font-size:13px; color:rgba(255,255,255,0.75); margin-bottom:36px; display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
        .res-crumbs a { color:rgba(255,255,255,0.9); text-decoration:none; }
        .res-crumbs span { color:#fff; }
        .res-tag { font-family:var(--font-display,sans-serif); font-weight:700; font-size:12.5px; padding:6px 13px; border-radius:999px; background:rgba(255,255,255,0.2); color:#fff; }
        .res-tag.ghost { background:transparent; box-shadow:inset 0 0 0 1.5px rgba(255,255,255,0.5); }
        .res-chip-solid { display:inline-flex; align-items:center; gap:7px; padding:6px 13px; border-radius:999px; background:var(--p-primary); color:#fff; font-family:var(--font-display,sans-serif); font-weight:700; font-size:12.5px; margin-bottom:16px; }
        .res-chip-dot { width:7px; height:7px; border-radius:999px; background:#fff; }
        .fb-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:16px; }
        .fb-list li { display:flex; gap:12px; font-size:14.5px; color:var(--p-ink-2); line-height:1.5; }
        .fb-ic { width:24px; height:24px; border-radius:999px; display:grid; place-items:center; font-weight:900; font-size:13px; flex-shrink:0; color:#fff; }
        .qrev-row { background:var(--p-bg); border:1px solid var(--p-line); border-radius:var(--p-radius); box-shadow:var(--p-shadow); padding:16px 20px; display:flex; align-items:center; gap:16px; }
        .qrev-badge { width:40px; height:40px; border-radius:999px; color:#fff; display:grid; place-items:center; font-weight:900; flex-shrink:0; }
        .kicker { font-family:var(--font-display,sans-serif); font-weight:700; font-size:12px; letter-spacing:0.05em; text-transform:uppercase; color:var(--p-muted); }
        .stat-num { font-family:var(--font-display,sans-serif); font-weight:900; font-size:clamp(30px,4vw,46px); line-height:1; letter-spacing:-0.02em; color:#fff; }
        .hl-underline { position:relative; white-space:nowrap; display:inline-block; }
        .hl-underline::after { content:''; position:absolute; left:0; right:0; bottom:2px; height:8px; background:var(--p-primary); opacity:0.22; border-radius:6px; z-index:-1; }
        @media (max-width:860px) { .res-grid, .ai-grid { grid-template-columns:1fr !important; } }
        @media (max-width:600px) { .res-crumbs { display:none; } }
      `}</style>

      {/* Hero */}
      <section style={{ padding:'54px 0 60px', background:`linear-gradient(150deg,var(--p-hero-a),var(--p-hero-b) 55%,var(--p-hero-c))` }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
          <div className="res-crumbs">
            <a href="/my-tests">My Tests</a><span>/</span>
            <a href="/my-tests">{test.title}</a><span>/</span>
            <span>Result</span>
          </div>
          <div className="res-grid">
            <div style={{ position:'relative', display:'grid', placeItems:'center' }}>
              <svg width="260" height="260" viewBox="0 0 280 280" style={{ transform:'rotate(-90deg)' }}>
                <circle cx={140} cy={140} r={r} stroke="rgba(255,255,255,0.22)" strokeWidth={20} fill="none" />
                <circle cx={140} cy={140} r={r} stroke="#fff" strokeWidth={20} fill="none"
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
              </svg>
              <div style={{ position:'absolute', textAlign:'center', color:'#fff' }}>
                <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:900, fontSize:78, lineHeight:1, letterSpacing:'-0.04em' }}>
                  {result.score}<span style={{ fontSize:34 }}>%</span>
                </div>
                <div className="kicker" style={{ color:'rgba(255,255,255,0.8)', marginTop:6 }}>{result.correctAnswers} of {result.totalQuestions} correct</div>
              </div>
            </div>

            <div>
              <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
                <span className="res-tag">{test.title}</span>
                <span className={`res-tag ghost`}>{passed ? '✓ Passed' : '✕ Not passed'}</span>
              </div>
              <h1 style={{ color:'#fff', marginBottom:16 }}>{passed ? 'Solid run!' : 'Good effort!'}</h1>
              <p style={{ fontSize:18, color:'rgba(255,255,255,0.92)', maxWidth:540, marginBottom:28, lineHeight:1.6 }}>
                You scored <strong>{result.score}%</strong> on this test.
                {passed
                  ? ` You passed with a margin of ${result.score - test.passingScore}% above the pass mark.`
                  : ` You needed ${test.passingScore}% to pass — keep practicing!`}
              </p>
              <div style={{ display:'flex', gap:40, flexWrap:'wrap' }}>
                <div><div className="stat-num">{timeStr}</div><div className="kicker" style={{ color:'rgba(255,255,255,0.8)', marginTop:6 }}>Time taken</div></div>
                <div><div className="stat-num" style={{ color:'var(--p-secondary)' }}>+{result.correctAnswers * 15}</div><div className="kicker" style={{ color:'rgba(255,255,255,0.8)', marginTop:6 }}>XP earned</div></div>
                <div><div className="stat-num">{result.correctAnswers}/{result.totalQuestions}</div><div className="kicker" style={{ color:'rgba(255,255,255,0.8)', marginTop:6 }}>Correct</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI feedback + topic breakdown */}
      <section style={{ padding:'84px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
          <div className="ai-grid">
            <div style={{ background:'var(--p-bg)', border:'1px solid var(--p-line)', borderRadius:'var(--p-radius)', boxShadow:'var(--p-shadow)', padding:30 }}>
              <div className="res-chip-solid"><span className="res-chip-dot" />AI feedback</div>
              <h2 style={{ fontSize:26, marginBottom:18 }}>What I noticed.</h2>
              <ul className="fb-list">
                {strongTopics.length > 0 && (
                  <li>
                    <span className="fb-ic" style={{ background:C_OK }}>✓</span>
                    <div><b style={{ color:'var(--p-ink)' }}>{strongTopics.join(', ')}</b> — you answered all of these correctly on the first try.</div>
                  </li>
                )}
                {weakTopics.length > 0 && (
                  <li>
                    <span className="fb-ic" style={{ background:'var(--p-primary)' }}>!</span>
                    <div><b style={{ color:'var(--p-ink)' }}>{weakTopics.join(', ')}</b> — these tripped you up. We'll target them in your next session.</div>
                  </li>
                )}
                <li>
                  <span className="fb-ic" style={{ background:'var(--p-primary)' }}>!</span>
                  <div>Your score is <b style={{ color:'var(--p-ink)' }}>{result.score}%</b> — {result.score >= test.passingScore ? 'above' : 'below'} the {test.passingScore}% pass mark.</div>
                </li>
              </ul>
              <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid var(--p-line)', display:'flex', justifyContent:'space-between', alignItems:'center', gap:14 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:15 }}>Recommended next</div>
                  <div className="kicker" style={{ marginTop:2 }}>{weakTopics.length > 0 ? `Practice ${weakTopics[0]}` : 'Try a harder level'}</div>
                </div>
                <button onClick={onRetake} style={btnSm}>Start →</button>
              </div>
            </div>

            <div style={{ background:'var(--p-bg)', border:'1px solid var(--p-line)', borderRadius:'var(--p-radius)', boxShadow:'var(--p-shadow)', padding:30 }}>
              <h2 style={{ fontSize:26, marginBottom:6 }}>Topic breakdown</h2>
              <div className="kicker" style={{ marginBottom:24 }}>how you did per sub-topic</div>
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {topics.length === 0
                  ? <p style={{ color:'var(--p-muted)', fontSize:14 }}>No topic data available.</p>
                  : topics.map(t => {
                      const col = t.pct === 100 ? C_OK : (t.pct === 0 ? C_BAD : 'var(--p-primary)');
                      return (
                        <div key={t.name}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                            <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:15 }}>{t.name}</span>
                            <span className="kicker">{t.got}/{t.total} · {t.pct}%</span>
                          </div>
                          <div className="res-bar"><span style={{ width:`${Math.max(t.pct, 3)}%`, background:col }} /></div>
                        </div>
                      );
                    })
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Question review */}
      <section style={{ paddingTop:0, paddingBottom:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
          <h2 style={{ marginBottom:28 }}>Review your <span className="hl-underline">{result.totalQuestions} answers.</span></h2>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {questions.map((q, i) => {
              const userAns   = answers[q.id];
              const isCorrect = !!userAns && JSON.stringify(userAns) === JSON.stringify(q.correctAnswer);
              return (
                <div key={q.id} className="qrev-row" style={isCorrect ? undefined : { background:'#FFF4F2', borderColor:'#F6D4CD' }}>
                  <div className="qrev-badge" style={{ background: isCorrect ? C_OK : C_BAD }}>{isCorrect ? '✓' : '✕'}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="kicker" style={{ marginBottom:4 }}>Q {String(i + 1).padStart(2, '0')}</div>
                    <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:15.5 }}>{q.text}</div>
                  </div>
                  <button onClick={() => openSolution(q, userAns, isCorrect)} style={btnSmGhost}>
                    {isCorrect ? 'Review' : 'See solution'} →
                  </button>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:40, display:'flex', gap:12, flexWrap:'wrap' }}>
            <button onClick={onRetake} style={btnPrimary}>Practice weak spots →</button>
            <button onClick={onBack}   style={btnGhost}>Back to module</button>
          </div>
        </div>
      </section>

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

const btnPrimary: React.CSSProperties  = { display:'inline-flex', alignItems:'center', padding:'13px 24px', border:'none', borderRadius:12, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'var(--p-shadow-orange)', textDecoration:'none' };
const btnGhost: React.CSSProperties    = { display:'inline-flex', alignItems:'center', padding:'13px 24px', border:'1.5px solid var(--p-line-2)', borderRadius:12, background:'var(--p-bg)', color:'var(--p-ink)', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'var(--p-shadow-sm)' };
const btnSm: React.CSSProperties       = { padding:'9px 16px', border:'none', borderRadius:10, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'var(--p-shadow-orange)' };
const btnSmGhost: React.CSSProperties  = { padding:'9px 16px', border:'1.5px solid var(--p-line-2)', borderRadius:10, background:'var(--p-bg)', color:'var(--p-ink)', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:14, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' };

// Client Component
'use client';

import { Question } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  question: Question;
  userAnswer: string | string[] | null;
  isCorrect: boolean;
  onClose: () => void;
}

const C_OK  = '#1F8A5B';
const C_BAD = '#E0533D';

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}?rel=0` : null;
    }
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed${u.pathname}?rel=0`;
    if (u.hostname.includes('vimeo.com')) return `https://player.vimeo.com/video/${u.pathname.replace('/', '')}`;
    return null;
  } catch { return null; }
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function VideoPlayer({ url, label }: { url: string; label: string }) {
  const embed  = getEmbedUrl(url);
  const direct = isDirectVideo(url);
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:12, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--p-muted)', marginBottom:10 }}>{label}</div>
      {embed ? (
        <div style={{ position:'relative', paddingBottom:'56.25%', height:0, borderRadius:12, overflow:'hidden', border:'1px solid var(--p-line)' }}>
          <iframe src={embed} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      ) : direct ? (
        <video src={url} controls style={{ width:'100%', borderRadius:12, border:'1px solid var(--p-line)', background:'#000' }} />
      ) : (
        <a href={url} target="_blank" rel="noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', border:'none', borderRadius:10, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:14, textDecoration:'none', boxShadow:'var(--p-shadow-orange)' }}>
          ▶ Watch video →
        </a>
      )}
    </div>
  );
}

function resolveAnswer(answer: string | string[] | null | undefined, options?: Question['options']): string {
  if (!answer) return '—';
  const resolve = (id: string) => options?.find(o => o.id === id)?.text ?? id;
  if (Array.isArray(answer)) return answer.map(resolve).join(', ');
  return resolve(String(answer));
}

export function SolutionDialog({ question, userAnswer, isCorrect, onClose }: Props) {
  const [tab, setTab] = useState<'answer' | 'solution'>(
    question.solutionVideoUrl || question.solutionText || question.referenceVideoUrl ? 'solution' : 'answer'
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasSolution = !!(question.solutionVideoUrl || question.solutionText || question.referenceVideoUrl);

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(30,34,48,0.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background:'var(--p-bg)', border:'1px solid var(--p-line)', borderRadius:'var(--p-radius-lg)', boxShadow:'var(--p-shadow-lg)', width:'100%', maxWidth:780, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--p-line)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ marginBottom:10 }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 13px', borderRadius:999, background: isCorrect ? C_OK : C_BAD, color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:12.5 }}>
                {isCorrect ? '✓ Correct' : '✕ Incorrect'}
              </span>
            </div>
            <p style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:16, color:'var(--p-ink)', lineHeight:1.45, margin:0 }}>
              {question.text}
            </p>
          </div>
          <button onClick={onClose} style={{ flexShrink:0, width:36, height:36, borderRadius:999, border:'1px solid var(--p-line-2)', background:'var(--p-bg)', cursor:'pointer', display:'grid', placeItems:'center', fontWeight:700, fontSize:20, color:'var(--p-muted)', boxShadow:'var(--p-shadow-sm)' }}>×</button>
        </div>

        {/* Tabs */}
        {hasSolution && (
          <div style={{ display:'flex', borderBottom:'1px solid var(--p-line)', padding:'0 24px' }}>
            {(['answer', 'solution'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding:'12px 20px', border:'none', borderBottom: tab === t ? `3px solid var(--p-primary)` : '3px solid transparent', background:'transparent', fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:13, cursor:'pointer', color: tab === t ? 'var(--p-primary)' : 'var(--p-muted)', textTransform:'capitalize', marginBottom:-1 }}>
                {t === 'answer' ? '📋 Answer review' : '🎬 Solution'}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {(!hasSolution || tab === 'answer') && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

              {/* Your answer */}
              <div style={{ padding:'16px 20px', border:`1.5px solid ${isCorrect ? C_OK : C_BAD}`, borderRadius:var_radius, background: isCorrect ? 'rgba(31,138,91,0.06)' : 'rgba(224,83,61,0.06)' }}>
                <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:11, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--p-muted)', marginBottom:6 }}>Your answer</div>
                <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:15, color:'var(--p-ink)' }}>
                  {resolveAnswer(userAnswer, question.options)}
                </div>
              </div>

              {/* Correct answer */}
              <div style={{ padding:'16px 20px', border:`1.5px solid ${C_OK}`, borderRadius:var_radius, background:'rgba(31,138,91,0.06)' }}>
                <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:11, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--p-muted)', marginBottom:6 }}>Correct answer</div>
                <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:15, color:C_OK }}>
                  {resolveAnswer(question.correctAnswer as string | string[], question.options)}
                </div>
              </div>

              {/* MCQ options */}
              {question.options && question.options.length > 0 && (
                <div>
                  <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:11, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--p-muted)', marginBottom:10 }}>All options</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {question.options.map(opt => {
                      const chosen  = Array.isArray(userAnswer) ? userAnswer.includes(opt.id) : userAnswer === opt.id;
                      const correct = opt.isCorrect;
                      const border  = correct ? C_OK : chosen ? C_BAD : 'var(--p-line-2)';
                      const bg      = correct ? 'rgba(31,138,91,0.06)' : chosen ? 'rgba(224,83,61,0.06)' : 'transparent';
                      return (
                        <div key={opt.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 14px', borderRadius:'var(--p-radius-sm)', border:`1.5px solid ${border}`, background:bg }}>
                          <span style={{ width:22, height:22, borderRadius:999, border:`1.5px solid ${border}`, display:'grid', placeItems:'center', fontSize:11, fontWeight:900, flexShrink:0, background: correct ? C_OK : chosen ? C_BAD : 'transparent', color:(correct || chosen) ? '#fff' : 'var(--p-muted)' }}>
                            {correct ? '✓' : chosen ? '✕' : ''}
                          </span>
                          <span style={{ fontSize:14, color:'var(--p-ink)', flex:1, fontFamily:'var(--font-display,sans-serif)', fontWeight:500 }}>{opt.text}</span>
                          {correct && <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:10, letterSpacing:'0.05em', color:C_OK, textTransform:'uppercase' }}>Correct</span>}
                          {!correct && chosen && <span style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:10, letterSpacing:'0.05em', color:C_BAD, textTransform:'uppercase' }}>Your pick</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasSolution && tab === 'solution' && (
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {question.solutionVideoUrl && <VideoPlayer url={question.solutionVideoUrl} label="📹 Solution video" />}
              {question.solutionText && (
                <div>
                  <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:11, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--p-muted)', marginBottom:10 }}>📖 Explanation</div>
                  <div style={{ padding:'18px 20px', border:'1px solid var(--p-line)', borderRadius:'var(--p-radius)', background:'var(--p-bg-alt)', boxShadow:'var(--p-shadow-sm)' }}>
                    <p style={{ fontSize:15, color:'var(--p-ink)', lineHeight:1.7, margin:0, whiteSpace:'pre-wrap', fontFamily:'var(--font-display,sans-serif)' }}>{question.solutionText}</p>
                  </div>
                </div>
              )}
              {question.referenceVideoUrl && <VideoPlayer url={question.referenceVideoUrl} label="📚 Reference video" />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 24px', borderTop:'1px solid var(--p-line)', display:'flex', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 24px', border:'none', borderRadius:10, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,sans-serif)', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'var(--p-shadow-orange)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const var_radius = 'var(--p-radius-sm)';

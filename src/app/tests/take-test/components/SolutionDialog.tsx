'use client';

import { Question } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  question: Question;
  userAnswer: string | string[] | null;
  isCorrect: boolean;
  onClose: () => void;
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}?rel=0` : null;
    }
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}?rel=0`;
    }
    if (u.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video/${u.pathname.replace('/', '')}`;
    }
    return null;
  } catch { return null; }
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function VideoPlayer({ url, label }: { url: string; label: string }) {
  const embed = getEmbedUrl(url);
  const direct = isDirectVideo(url);
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 10 }}>{label}</div>
      {embed ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', border: '2px solid var(--p-ink)' }}>
          <iframe src={embed} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      ) : direct ? (
        <video src={url} controls style={{ width: '100%', borderRadius: 12, border: '2px solid var(--p-ink)', background: '#000' }} />
      ) : (
        <a href={url} target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '3px 3px 0 var(--p-ink)' }}>
          ▶ Watch video →
        </a>
      )}
    </div>
  );
}

function resolveAnswer(
  answer: string | string[] | null | undefined,
  options?: Question['options']
): string {
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
    <div className="solution-dialog-wrap" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(26,21,20,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="solution-dialog" style={{ background: 'var(--p-bg)', border: '2px solid var(--p-ink)', borderRadius: 20, boxShadow: '8px 8px 0 var(--p-ink)', width: '100%', maxWidth: 780, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '2px solid var(--p-ink)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: isCorrect ? '#2D6A4F' : '#D94A3D', color: '#fff' }}>
                {isCorrect ? '✓ Correct' : '✕ Incorrect'}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.45, margin: 0 }}>
              {question.text}
            </p>
          </div>
          <button onClick={onClose} style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 999, border: '2px solid var(--p-ink)', background: 'var(--p-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)' }}>×</button>
        </div>

        {/* Tabs — only show if there's a solution */}
        {hasSolution && (
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--p-ink)', padding: '0 24px' }}>
            {(['answer', 'solution'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '12px 20px', border: 'none', borderBottom: tab === t ? '3px solid var(--p-primary)' : '3px solid transparent', background: 'transparent', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: tab === t ? 'var(--p-primary)' : 'var(--p-muted)', textTransform: 'capitalize', marginBottom: -2 }}>
                {t === 'answer' ? '📋 Answer review' : '🎬 Solution'}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {(!hasSolution || tab === 'answer') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Your answer */}
              <div style={{ padding: '16px 20px', border: `2px solid ${isCorrect ? '#2D6A4F' : '#D94A3D'}`, borderRadius: 14, background: isCorrect ? 'rgba(45,106,79,0.06)' : 'rgba(217,74,61,0.06)' }}>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--p-muted)', marginBottom: 6 }}>Your answer</div>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: 'var(--p-ink)' }}>
                  {resolveAnswer(userAnswer, question.options)}
                </div>
              </div>

              {/* Correct answer */}
              <div style={{ padding: '16px 20px', border: '2px solid #2D6A4F', borderRadius: 14, background: 'rgba(45,106,79,0.06)' }}>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--p-muted)', marginBottom: 6 }}>Correct answer</div>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: '#2D6A4F' }}>
                  {resolveAnswer(question.correctAnswer as string | string[], question.options)}
                </div>
              </div>

              {/* Options breakdown for MCQ */}
              {question.options && question.options.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--p-muted)', marginBottom: 10 }}>All options</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {question.options.map(opt => {
                      const chosen = Array.isArray(userAnswer) ? userAnswer.includes(opt.id) : userAnswer === opt.id;
                      const correct = opt.isCorrect;
                      return (
                        <div key={opt.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${correct ? '#2D6A4F' : chosen ? '#D94A3D' : 'var(--p-border,#e2e2e2)'}`, background: correct ? 'rgba(45,106,79,0.06)' : chosen ? 'rgba(217,74,61,0.06)' : 'transparent' }}>
                          <span style={{ width: 20, height: 20, borderRadius: 999, border: '1.5px solid var(--p-ink)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, background: correct ? '#2D6A4F' : chosen ? '#D94A3D' : 'transparent', color: (correct || chosen) ? '#fff' : 'var(--p-ink)' }}>
                            {correct ? '✓' : chosen ? '✕' : ''}
                          </span>
                          <span style={{ fontSize: 14, color: 'var(--p-ink)', flex: 1 }}>{opt.text}</span>
                          {correct && <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: '#2D6A4F', fontWeight: 700 }}>CORRECT</span>}
                          {!correct && chosen && <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: '#D94A3D', fontWeight: 700 }}>YOUR PICK</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasSolution && tab === 'solution' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {question.solutionVideoUrl && <VideoPlayer url={question.solutionVideoUrl} label="📹 Solution video" />}
              {question.solutionText && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 10 }}>📖 Explanation</div>
                  <div style={{ padding: '18px 20px', border: '2px solid var(--p-ink)', borderRadius: 14, background: 'var(--p-bg-alt)', boxShadow: '3px 3px 0 var(--p-ink)' }}>
                    <p style={{ fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{question.solutionText}</p>
                  </div>
                </div>
              )}
              {question.referenceVideoUrl && <VideoPlayer url={question.referenceVideoUrl} label="📚 Reference video" />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '2px solid var(--p-ink)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-ink)', color: 'var(--p-bg)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-muted)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

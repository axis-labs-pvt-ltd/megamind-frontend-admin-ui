'use client';

import { Question } from '@/types';
import { useEffect } from 'react';

interface Props {
  question: Question;
  onClose: () => void;
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.replace('/', '');
      return `https://player.vimeo.com/video/${id}`;
    }
    // Direct video file — use <video> tag instead
    return null;
  } catch {
    return null;
  }
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export function SolutionDialog({ question, onClose }: Props) {
  const videoUrl = question.solutionVideoUrl;
  const solutionText = question.solutionText;
  const hasContent = !!(videoUrl || solutionText);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const isDirect = videoUrl ? isDirectVideo(videoUrl) : false;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(26,21,20,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--p-bg)', border: '2px solid var(--p-ink)', borderRadius: 20,
        boxShadow: '8px 8px 0 var(--p-ink)', width: '100%', maxWidth: 760,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--p-ink)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 6 }}>Solution</div>
            <p style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.4, margin: 0 }}>
              {question.text}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 999, border: '2px solid var(--p-ink)', background: 'var(--p-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16, color: 'var(--p-ink)' }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {!hasContent ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--p-muted)', fontFamily: 'var(--font-mono,monospace)', fontSize: 13 }}>
              No solution available for this question.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Inline video player */}
              {videoUrl && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 10 }}>
                    Video explanation
                  </div>
                  {embedUrl ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', border: '2px solid var(--p-ink)' }}>
                      <iframe
                        src={embedUrl}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : isDirect ? (
                    <video
                      src={videoUrl}
                      controls
                      style={{ width: '100%', borderRadius: 12, border: '2px solid var(--p-ink)', background: '#000' }}
                    />
                  ) : (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: '3px 3px 0 var(--p-ink)' }}
                    >
                      ▶ Watch solution video →
                    </a>
                  )}
                </div>
              )}

              {/* Written explanation */}
              {solutionText && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--p-muted)', marginBottom: 10 }}>
                    Explanation
                  </div>
                  <div style={{ padding: '18px 20px', border: '2px solid var(--p-ink)', borderRadius: 14, background: 'var(--p-bg-alt)', boxShadow: '3px 3px 0 var(--p-ink)' }}>
                    <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 15, color: 'var(--p-ink)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {solutionText}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '2px solid var(--p-ink)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-ink)', color: 'var(--p-bg)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-muted)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

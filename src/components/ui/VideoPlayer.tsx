// Client Component - Download-protected video player using short-lived S3 pre-signed URLs
'use client';

import { getStreamUrl } from '@/services/api/moduleVideos';
import { useEffect, useRef, useState } from 'react';

interface Props {
  s3Key: string;
  title?: string;
  onClose?: () => void;
}

export function VideoPlayer({ s3Key, title, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc]         = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getStreamUrl(s3Key)
      .then(url => { if (!cancelled) { setSrc(url); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError('Could not load video.'); setLoading(false); } });

    // Refresh URL every 4.5 min (before 5-min expiry)
    const interval = setInterval(() => {
      getStreamUrl(s3Key)
        .then(url => { if (!cancelled && videoRef.current) { const t = videoRef.current.currentTime; setSrc(url); videoRef.current.currentTime = t; } })
        .catch(() => {});
    }, 4.5 * 60 * 1000);

    return () => { cancelled = true; clearInterval(interval); };
  }, [s3Key]);

  return (
    <div
      style={{ position: 'relative', background: '#000', borderRadius: 14, overflow: 'hidden' }}
      onContextMenu={e => e.preventDefault()}
    >
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: '#111', zIndex: 2 }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: 'var(--p-primary)', borderRadius: '50%', animation: 'vp-spin 0.8s linear infinite' }} />
        </div>
      )}
      {error && (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: '#aaa', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 14 }}>
          {error}
        </div>
      )}
      {src && (
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay={false}
          playsInline
          /* Disables the download button in supporting browsers */
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          style={{ width: '100%', display: 'block', maxHeight: '70vh' }}
          onContextMenu={e => e.preventDefault()}
        />
      )}
      <style>{`@keyframes vp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal wrapper — overlays the page with a backdrop                   */
/* ------------------------------------------------------------------ */
interface ModalProps extends Props { isOpen: boolean; }

export function VideoPlayerModal({ isOpen, s3Key, title, onClose }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(10,12,20,0.78)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div style={{ width: '100%', maxWidth: 860, borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', background: '#111' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title ?? 'Video'}
          </span>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 16, flexShrink: 0, marginLeft: 12 }}
          >✕</button>
        </div>
        <VideoPlayer s3Key={s3Key} title={title} onClose={onClose} />
      </div>
    </div>
  );
}

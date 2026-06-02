// Client Component — single swipeable flashcard
'use client';

import { FlashCard } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface Props {
  card: FlashCard;
  index: number;
  total: number;
  stackOffset: number; // 0 = top card, 1 = second, 2 = third
  coverColor: string;
  onSwipe: (dir: 'left' | 'right') => void;
}

export function SwipeCard({ card, index, total, stackOffset, coverColor, onSwipe }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const isTop = stackOffset === 0;

  const TYPE_LABEL: Record<string, string> = { text: '📝 TEXT', image: '🖼 IMAGE', video: '🎬 VIDEO' };

  const offsetY = stackOffset * 8;
  const scale = 1 - stackOffset * 0.04;
  const rot = stackOffset === 0 ? (dx / 20) : (stackOffset % 2 ? -1 : 1);

  const cardStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    border: '2px solid var(--p-ink)', borderRadius: 24,
    boxShadow: '6px 6px 0 var(--p-ink)',
    background: coverColor,
    display: 'flex', flexDirection: 'column',
    transition: dragging ? 'none' : 'transform .35s cubic-bezier(.7,0,.2,1), opacity .25s',
    userSelect: 'none', touchAction: 'pan-y',
    cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
    zIndex: 10 - stackOffset,
    overflow: 'hidden',
    transform: isTop
      ? `translate(${dx}px, ${dy * 0.4}px) rotate(${rot}deg)`
      : `translateY(${offsetY}px) scale(${scale}) rotate(${stackOffset % 2 ? -1 : 1}deg)`,
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isTop) return;
    setDragging(true); setWasDragged(false);
    startRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !isTop) return;
    const newDx = e.clientX - startRef.current.x;
    const newDy = e.clientY - startRef.current.y;
    if (Math.abs(newDx) > 6) setWasDragged(true);
    setDx(newDx); setDy(newDy);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dx > 100) { onSwipe('right'); }
    else if (dx < -100) { onSwipe('left'); }
    else { setDx(0); setDy(0); }
  };
  const handleClick = () => {
    if (isTop && !wasDragged) setFlipped(f => !f);
  };

  const knewOpacity = Math.max(0, Math.min(1, dx / 100));
  const reviewOpacity = Math.max(0, Math.min(1, -dx / 100));

  return (
    <div style={cardStyle}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      onClick={handleClick}>

      {/* KNEW IT stamp */}
      <div style={{ position: 'absolute', top: 24, right: 24, padding: '8px 18px', border: '3px solid #2D6A4F', borderRadius: 8, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 800, fontSize: 20, letterSpacing: '0.05em', color: '#2D6A4F', transform: 'rotate(12deg)', opacity: knewOpacity, pointerEvents: 'none', zIndex: 20 }}>
        KNEW IT
      </div>
      {/* REVIEW stamp */}
      <div style={{ position: 'absolute', top: 24, left: 24, padding: '8px 18px', border: '3px solid #D94A3D', borderRadius: 8, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 800, fontSize: 20, letterSpacing: '0.05em', color: '#D94A3D', transform: 'rotate(-12deg)', opacity: reviewOpacity, pointerEvents: 'none', zIndex: 20 }}>
        REVIEW
      </div>

      {/* Card header */}
      <div style={{ padding: '12px 18px', borderBottom: '2px solid var(--p-ink)', background: 'rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700 }}>{TYPE_LABEL[card.type]}</span>
        <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, opacity: 0.6 }}>{index + 1} / {total}</span>
      </div>

      {/* Front */}
      {!flipped && (
        <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center' }}>
          {card.type === 'image' && card.imageUrl && (
            <img src={card.imageUrl} alt="" style={{ maxWidth: '80%', maxHeight: 160, objectFit: 'contain', borderRadius: 12, border: '2px solid var(--p-ink)' }} />
          )}
          {card.type === 'image' && !card.imageUrl && <div style={{ fontSize: 80 }}>🖼</div>}
          {card.type === 'video' && (
            <div style={{ position: 'relative', width: 200, height: 140, background: 'var(--p-ink)', borderRadius: 14, display: 'grid', placeItems: 'center', border: '2px solid var(--p-ink)' }}>
              {card.videoUrl ? (
                <iframe src={card.videoUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }} allow="autoplay" />
              ) : (
                <div style={{ width: 56, height: 56, background: 'var(--p-secondary)', color: 'var(--p-ink)', borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 22, border: '2px solid var(--p-ink)' }}>▶</div>
              )}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 34, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--p-ink)' }}>{card.front}</div>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginTop: 'auto' }}>tap to reveal theory →</div>
        </div>
      )}

      {/* Back */}
      {flipped && (
        <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left', overflow: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 700, color: 'var(--p-muted)' }}>📖 THEORY</div>
          <div style={{ fontSize: 18, lineHeight: 1.55, fontWeight: 500, color: 'var(--p-ink)' }}>{card.back}</div>
          <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1.5px dashed var(--p-ink)', fontSize: 13, color: 'var(--p-muted)' }}>Did you know it?</div>
        </div>
      )}
    </div>
  );
}

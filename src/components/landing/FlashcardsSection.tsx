// Client Component - Flashcards landing section
'use client';

import Link from 'next/link';
import { useState } from 'react';

const SAMPLE_CARDS = [
  { subj: 'Chemistry', title: 'Periodic Table · Group I–III', cards: 48, price: 800, color: '#FFE4E4', emoji: '🧪', rot: '-3deg', tutor: 'Mr. Bandara', bestseller: true },
  { subj: 'Physics',   title: 'SI Units & Formulas',          cards: 60, price: 600, color: '#E4F0FF', emoji: '⚛️', rot: '0deg',  tutor: 'Ms. Fernando' },
  { subj: 'ICT',       title: 'OSI Layers · visual deck',     cards: 32, price: 1200, color: '#E4FFE9', emoji: '💻', rot: '3deg',  tutor: 'Mr. Silva', isNew: true },
];

const STATS = [
  { val: '18+',      lbl: 'Curated decks' },
  { val: 'Rs. 500+', lbl: 'From, one-time' },
  { val: '3',        lbl: 'Card types' },
];

export function FlashcardsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="flashcards" className="fc-landing-section" style={{ padding: '110px 0', background: 'var(--p-bg-alt)', borderTop: '2px solid var(--p-ink)', borderBottom: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }} className="fc-landing-head">

          {/* Left — copy */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-primary)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />
              New · Flashcards
            </span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,50px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--p-ink)', marginTop: 18, marginBottom: 0 }}>
              Swipe, flip,{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                remember.
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: -4, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%23E8541C' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
              </span>
            </h2>
            <p style={{ marginTop: 22, fontSize: 17, color: 'var(--p-ink-2)', maxWidth: 480, lineHeight: 1.6 }}>
              Curated decks from top Sri Lankan tutors. Plain text, images, even short videos —
              swipe left to review, right when you've nailed it.
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Link href="/flashcards" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none' }}>
                Browse decks →
              </Link>
              <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none' }}>
                Create a deck
              </Link>
            </div>

            {/* Stats */}
            <div className="fc-stats" style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.lbl}>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 34, color: 'var(--p-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — card stack (hidden on tablet/mobile) */}
          <div className="fc-card-stack" style={{ position: 'relative', height: 460, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {SAMPLE_CARDS.map((card, i) => {
              const offset = i - 1; // -1, 0, 1
              const isCenter = i === 1;
              const isHovered = hovered === i;
              const translateX = offset * 90;
              const translateY = isHovered ? (Math.abs(offset) * 18 - 14) : (Math.abs(offset) * 18);
              return (
                <Link
                  key={card.title}
                  href="/flashcards"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'absolute',
                    width: 270, height: 350,
                    background: card.color,
                    border: '2px solid var(--p-ink)',
                    borderRadius: 18,
                    boxShadow: isCenter ? '8px 8px 0 var(--p-ink)' : '4px 4px 0 var(--p-ink)',
                    transform: `translate(${translateX}px, ${translateY}px) rotate(${card.rot})`,
                    zIndex: isCenter ? 10 : (10 - Math.abs(offset)),
                    padding: 0,
                    overflow: 'hidden',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'transform .25s cubic-bezier(.7,0,.2,1), box-shadow .25s',
                    cursor: 'pointer',
                  }}>
                  {/* Card header */}
                  <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--p-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.04)' }}>
                    <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--p-ink)' }}>{card.subj.toUpperCase()}</span>
                    {card.bestseller && <span style={{ padding: '2px 8px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontSize: 9, background: 'var(--p-ink)', color: 'var(--p-bg)', fontFamily: 'var(--font-mono,monospace)' }}>★</span>}
                    {card.isNew && <span style={{ padding: '2px 8px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontSize: 9, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-mono,monospace)' }}>NEW</span>}
                  </div>
                  {/* Card body */}
                  <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 46px)' }}>
                    <div style={{ fontSize: 52, marginBottom: 12, alignSelf: 'center' }}>{card.emoji}</div>
                    <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 17, lineHeight: 1.3, color: 'var(--p-ink)', marginBottom: 6 }}>{card.title}</h3>
                    <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)', marginBottom: 16 }}>by {card.tutor}</div>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px dashed var(--p-ink)', paddingTop: 12 }}>
                      <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, color: 'var(--p-ink-2)' }}>{card.cards} cards</span>
                      <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 17, color: 'var(--p-ink)' }}>Rs. {card.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Swipe hint badge */}
            <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', background: 'var(--p-ink)', color: 'var(--p-bg)', padding: '8px 18px', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', border: '2px solid var(--p-ink)', display: 'flex', gap: 12, alignItems: 'center', whiteSpace: 'nowrap', zIndex: 20 }}>
              <span style={{ color: '#ff7b7b' }}>← REVIEW</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: '#7be0a8' }}>I KNEW IT →</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) { .fc-landing-head { grid-template-columns: 1fr !important; } .fc-card-stack { display: none !important; } }
        @media (max-width: 600px) { .fc-landing-section { padding: 60px 0 !important; } .fc-stats { gap: 20px !important; } }
      `}</style>
    </section>
  );
}

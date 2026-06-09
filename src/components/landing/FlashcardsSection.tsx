// Client Component - Flashcards landing section
'use client';

import { useT } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useState } from 'react';

const SAMPLE_CARDS = [
  { subj: 'Chemistry', title: 'Periodic Table · Group I–III', cards: 48, price: 800,  tint: 'var(--p-mint)',   ink: 'var(--p-ink-mint)',   emoji: '🧪', rot: '-3deg', tutor: 'Mr. Bandara',  bestseller: true },
  { subj: 'Physics',   title: 'SI Units & Formulas',          cards: 60, price: 600,  tint: 'var(--p-peach)',  ink: 'var(--p-ink-peach)',  emoji: '⚛️', rot: '0deg',  tutor: 'Ms. Fernando' },
  { subj: 'ICT',       title: 'OSI Layers · visual deck',     cards: 32, price: 1200, tint: 'var(--p-blue)',   ink: 'var(--p-ink-blue)',   emoji: '💻', rot: '3deg',  tutor: 'Mr. Silva',    isNew: true },
];

export function FlashcardsSection() {
  const t = useT();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="flashcards" className="fc-landing-section" style={{ padding: '84px 0', background: 'var(--p-bg-alt)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }} className="fc-landing-head">

          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              {t.flashcards.eyebrow}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.1, color: 'var(--p-ink)', marginBottom: 20 }}>
              {t.flashcards.heading}
            </h2>
            <p style={{ fontSize: 'clamp(15px,1.2vw,17px)', color: 'var(--p-ink-2)', maxWidth: 460, lineHeight: 1.65, marginBottom: 28 }}>
              {t.flashcards.body}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link href="/flashcards" style={btnPrimary}>{t.flashcards.browseCta}</Link>
              <Link href="/auth/signup" style={btnGhost}>{t.flashcards.createCta}</Link>
            </div>

            <div className="fc-stats" style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
              {t.flashcards.stats.map(s => (
                <div key={s.lbl}>
                  <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 34, color: 'var(--p-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 5 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — card stack */}
          <div className="fc-card-stack" style={{ position: 'relative', height: 460, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {SAMPLE_CARDS.map((card, i) => {
              const offset = i - 1;
              const isCenter = i === 1;
              const isHovered = hovered === i;
              const translateX = offset * 88;
              const translateY = isHovered ? (Math.abs(offset) * 18 - 14) : (Math.abs(offset) * 18);
              return (
                <Link key={card.title} href="/flashcards"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'absolute', width: 268, height: 344,
                    background: card.tint,
                    border: '1px solid var(--p-line)',
                    borderRadius: 20,
                    boxShadow: isCenter ? 'var(--p-shadow-lg)' : 'var(--p-shadow)',
                    transform: `translate(${translateX}px, ${translateY}px) rotate(${card.rot})`,
                    zIndex: isCenter ? 10 : (10 - Math.abs(offset)),
                    overflow: 'hidden', textDecoration: 'none', color: 'inherit',
                    transition: 'transform .25s cubic-bezier(.7,0,.2,1), box-shadow .25s',
                    cursor: 'pointer',
                  }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: card.ink }}>{card.subj}</span>
                    {card.bestseller && <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 9, background: 'var(--p-ink)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800 }}>★ Best</span>}
                    {card.isNew && <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 9, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800 }}>New</span>}
                  </div>
                  <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 40px)' }}>
                    <div style={{ fontSize: 52, marginBottom: 12, alignSelf: 'center', lineHeight: 1 }}>{card.emoji}</div>
                    <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 17, lineHeight: 1.3, color: 'var(--p-ink)', marginBottom: 6 }}>{card.title}</h3>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, color: 'var(--p-muted)', marginBottom: 16 }}>by {card.tutor}</div>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 12 }}>
                      <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, color: 'var(--p-ink-2)' }}>{card.cards} cards</span>
                      <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 18, color: 'var(--p-ink)' }}>Rs. {card.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Swipe hint */}
            <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', background: 'var(--p-ink)', color: '#fff', padding: '8px 18px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 12, fontWeight: 800, display: 'flex', gap: 12, alignItems: 'center', whiteSpace: 'nowrap', zIndex: 20, boxShadow: 'var(--p-shadow)' }}>
              <span style={{ color: '#ff8a8a' }}>{t.flashcards.swipeReview}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span style={{ color: '#7be0a8' }}>{t.flashcards.swipeKnew}</span>
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

const btnPrimary: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none' };
const btnGhost: React.CSSProperties  = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', color: 'var(--p-ink)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none' };

// Server Component - Student voices / testimonials
const TESTIMONIALS = [
  { name: 'Thisari P.', role: 'A/L · Bio stream · Kandy',   quote: 'The theory pop-ups saved me. Instead of scrolling YouTube for 20 min to understand one concept, Megamind explained it in the flow.',        score: 'A for Chemistry',       tint: 'var(--p-peach)', av: '👩' },
  { name: 'Kavindu R.', role: 'O/L · Colombo',               quote: 'I used to hate ICT. The AI noticed I was weak on networking and just kept giving me network questions until it clicked.',                        score: 'Grade 11 ICT · A',      tint: 'var(--p-blue)',  av: '🧑' },
  { name: 'Nethmi S.',  role: 'Uni entrance · Galle',         quote: "Buying single papers was perfect. I only needed physics mechanics practice and didn't want a full subscription.",                               score: 'Top 5% · physics mock', tint: 'var(--p-mint)',  av: '👨' },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: '84px 0', background: 'var(--p-bg)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* Header */}
        <div className="t-head">
          <div>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              Student voices
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 640, color: 'var(--p-ink)', margin: 0 }}>
              Built with{' '}
              <span style={{ color: 'var(--p-primary)', position: 'relative', display: 'inline-block' }}>
                Sri Lankan students
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 8, background: 'var(--p-primary)', opacity: 0.22, borderRadius: 6, zIndex: -1 }} />
              </span>
              , not for them.
            </h2>
          </div>

          {/* Avatar stack + rating */}
          <div className="t-rating">
            {/* Stacked avatars */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {(['var(--p-peach)', 'var(--p-blue)', 'var(--p-mint)'] as const).map((bg, i) => (
                <div key={i} style={{
                  width: 42, height: 42, borderRadius: 999,
                  background: bg, border: '3px solid #fff',
                  marginLeft: i === 0 ? 0 : -12,
                  display: 'grid', placeItems: 'center',
                  fontSize: 17, boxShadow: 'var(--p-shadow-sm)',
                }}>
                  {['👩‍🎓', '🧑‍🎓', '👨‍🎓'][i]}
                </div>
              ))}
            </div>
            {/* Stars + count */}
            <div>
              <div style={{ display: 'flex', gap: 2, fontSize: 16, color: '#F4B942' }}>★★★★★</div>
              <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', marginTop: 4, color: 'var(--p-muted)' }}>
                4.8 · 2,140 reviews
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="t-grid">
          {TESTIMONIALS.map((t, i) => {
            const isFeat = i === 1;
            return (
              <div key={i} className={`t-card${isFeat ? ' t-feat' : ''}`}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 2, fontSize: 15, color: isFeat ? 'rgba(255,255,255,0.9)' : '#F4B942', marginBottom: 16 }}>★★★★★</div>

                {/* Quote */}
                <p style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 17, lineHeight: 1.5, margin: '0 0 22px', flex: 1, color: isFeat ? '#fff' : 'var(--p-ink)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ width: 44, height: 44, borderRadius: 999, background: isFeat ? 'rgba(255,255,255,0.25)' : t.tint, display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                    {t.av}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, color: isFeat ? '#fff' : 'var(--p-ink)' }}>{t.name}</div>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12.5, color: isFeat ? 'rgba(255,255,255,0.8)' : 'var(--p-muted)' }}>{t.role}</div>
                  </div>
                </div>

                {/* Score */}
                <div style={{
                  marginTop: 16, paddingTop: 14,
                  borderTop: `1px solid ${isFeat ? 'rgba(255,255,255,0.3)' : 'var(--p-line)'}`,
                  fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13,
                  color: isFeat ? '#fff' : 'var(--p-ink-2)',
                }}>
                  ✨ {t.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .t-head {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 28px; margin-bottom: 40px; flex-wrap: wrap;
        }
        .t-rating { display: flex; gap: 18px; align-items: center; }

        .t-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        .t-card {
          padding: 26px; display: flex; flex-direction: column;
          background: #fff; border: 1px solid var(--p-line);
          border-radius: 20px; box-shadow: var(--p-shadow-sm);
        }
        .t-feat {
          background: var(--p-primary);
          border-color: transparent;
          box-shadow: var(--p-shadow-orange);
        }

        @media (max-width: 940px) { .t-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

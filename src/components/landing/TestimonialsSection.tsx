// Server Component - Student voices / testimonials
const TESTIMONIALS = [
  {
    name: 'Thisari P.',
    role: 'A/L · Bio stream · Kandy',
    quote: 'The theory pop-ups saved me. Instead of scrolling YouTube for 20 min to understand one concept, Megamind explained it in the flow.',
    score: 'A for Chemistry',
  },
  {
    name: 'Kavindu R.',
    role: 'O/L · Colombo',
    quote: 'I used to hate ICT. The AI noticed I was weak on networking and just kept giving me network questions until it clicked.',
    score: 'Grade 11 ICT · A',
  },
  {
    name: 'Nethmi S.',
    role: 'Uni entrance · Galle',
    quote: "Buying single papers was perfect. I only needed physics mechanics practice and didn't want a full subscription.",
    score: 'Top 5% · physics mock',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: '110px 0', background: 'var(--p-bg-alt)', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 30, marginBottom: 50, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />
              Student voices
            </span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,50px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 18, maxWidth: 720, color: 'var(--p-ink)' }}>
              Built <em>with</em>{' '}
              <span style={{ display: 'inline-block', position: 'relative' }}>
                Sri Lankan students
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%23E8541C' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
              </span>
              , not for them.
            </h2>
          </div>

          {/* Avatar stack + rating */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {['var(--p-card-a)', 'var(--p-card-c)', 'var(--p-card-d)'].map((bg, i) => (
                <div key={i} style={{
                  width: 48, height: 48, borderRadius: 999,
                  background: bg, border: '2px solid var(--p-ink)',
                  marginLeft: i === 0 ? 0 : -14,
                  display: 'grid', placeItems: 'center', fontSize: 20,
                }}>
                  {['🧑‍🎓', '👩‍🎓', '🎓'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 2, color: 'var(--p-secondary)', fontSize: 16 }}>★★★★★</div>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, marginTop: 4, color: 'var(--p-muted)' }}>4.8 · 2,140 reviews</div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="t-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              padding: 24, display: 'flex', flexDirection: 'column',
              border: '2px solid var(--p-ink)', borderRadius: 18,
              background: i === 1 ? 'var(--p-primary)' : 'var(--p-bg)',
              color: i === 1 ? 'var(--p-primary-ink)' : 'var(--p-ink)',
              boxShadow: '6px 6px 0 var(--p-ink)',
            }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, color: 'var(--p-secondary)', marginBottom: 16, fontSize: 14 }}>★★★★★</div>

              {/* Quote */}
              <p style={{ fontSize: 17, lineHeight: 1.5, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 500, marginBottom: 22, flex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 999,
                  border: `2px solid ${i === 1 ? 'var(--p-primary-ink)' : 'var(--p-ink)'}`,
                  background: ['var(--p-card-a)', 'var(--p-card-c)', 'var(--p-card-d)'][i],
                  flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 22,
                }}>
                  {['🧑‍🎓', '👩‍🎓', '🎓'][i]}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, opacity: 0.75 }}>{t.role}</div>
                </div>
              </div>

              {/* Achievement */}
              <div style={{
                marginTop: 16, paddingTop: 14,
                borderTop: `1.5px dashed ${i === 1 ? 'var(--p-primary-ink)' : 'var(--p-ink)'}`,
                fontSize: 13, fontFamily: 'var(--font-mono,monospace)',
                display: 'flex', alignItems: 'center', gap: 8, opacity: 0.9,
              }}>
                <span style={{ color: i === 1 ? 'var(--p-secondary)' : 'var(--p-primary)' }}>✦</span>
                {t.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media (max-width: 960px) { .t-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

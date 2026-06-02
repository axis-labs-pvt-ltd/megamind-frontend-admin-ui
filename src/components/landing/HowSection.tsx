// Server Component - How it works section
const STEPS = [
  { n: '01', title: 'Pick a subject',      body: 'Choose from ICT, Physics, Chemistry, Maths or English. Tell us your grade and your target.',             color: 'var(--p-peach)',  ink: 'var(--p-ink-peach)',  icon: '📚' },
  { n: '02', title: 'AI builds your quiz', body: "Our AI picks questions based on what you know, where you slipped, and what's next on your syllabus.",    color: 'var(--p-blue)',   ink: 'var(--p-ink-blue)',   icon: '✨', featured: true },
  { n: '03', title: 'Learn as you answer', body: 'Every question has a short theory snippet. Stuck? Tap it. Learn the concept in 30 seconds, then answer.', color: 'var(--p-mint)',   ink: 'var(--p-ink-mint)',   icon: '💡' },
  { n: '04', title: 'Skill graph updates', body: 'Your weak spots get revisited. Your strengths graduate to harder questions. It adapts every day.',         color: 'var(--p-yellow)', ink: 'var(--p-ink-yellow)', icon: '📈' },
];

export function HowSection() {
  return (
    <section id="how" style={{ padding: '84px 0', background: 'var(--p-ink)', position: 'relative' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 28, marginBottom: 56 }} className="how-head">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              How it works
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 780, color: '#fff' }}>
              A tutor that <span style={{ color: 'var(--p-primary)' }}>rebuilds itself</span> every time you answer.
            </h2>
          </div>
          <div style={{ maxWidth: 300, color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.6 }}>
            Megamind watches <em>how</em> you answer — speed, confidence, mistakes — and quietly
            rewrites tomorrow&apos;s quiz to close the gaps.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="how-grid">
          {STEPS.map(s => (
            <div key={s.n} style={{
              padding: 24, borderRadius: 20,
              background: s.featured ? 'var(--p-primary)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${s.featured ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: s.featured ? 'var(--p-shadow-orange)' : 'none',
              minHeight: 260, position: 'relative',
            }}>
              {s.featured && (
                <span style={{ position: 'absolute', top: -13, left: 18, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999, background: '#fff', color: 'var(--p-primary-dark)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', boxShadow: 'var(--p-shadow-sm)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)' }} /> the AI bit
                </span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', color: s.featured ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)' }}>{s.n}</span>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: s.color, display: 'grid', placeItems: 'center', fontSize: 24, boxShadow: 'var(--p-shadow-sm)' }}>{s.icon}</div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 22, fontWeight: 800, marginBottom: 10, color: '#fff' }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: s.featured ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.65)' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) { .how-grid { grid-template-columns: repeat(2, 1fr) !important; } .how-head { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .how-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

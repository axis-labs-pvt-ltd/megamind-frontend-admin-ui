// Server Component - How it works section
const STEPS = [
  { n: '01', title: 'Pick a subject',      body: 'Choose from ICT, Physics, Chemistry, Maths or English. Tell us your grade and your target.',             color: 'var(--p-peach)',  ink: 'var(--p-ink-peach)',  icon: '📚' },
  { n: '02', title: 'AI builds your quiz', body: "Our AI picks questions based on what you know, where you slipped, and what's next on your syllabus.",    color: 'var(--p-blue)',   ink: 'var(--p-ink-blue)',   icon: '✨', featured: true },
  { n: '03', title: 'Learn as you answer', body: 'Every question has a short theory snippet. Stuck? Tap it. Learn the concept in 30 seconds, then answer.', color: 'var(--p-mint)',   ink: 'var(--p-ink-mint)',   icon: '💡' },
  { n: '04', title: 'Skill graph updates', body: 'Your weak spots get revisited. Your strengths graduate to harder questions. It adapts every day.',         color: 'var(--p-yellow)', ink: 'var(--p-ink-yellow)', icon: '📈' },
];

export function HowSection() {
  return (
    <section id="how" style={{ padding: '84px 0', background: 'var(--p-bg-alt)', position: 'relative' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 28, marginBottom: 56 }} className="how-head">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              How it works
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 780, color: 'var(--p-ink)' }}>
              A tutor that <span style={{ color: 'var(--p-primary)' }}>rebuilds itself</span> every time you answer.
            </h2>
          </div>
          <div style={{ maxWidth: 300, color: 'var(--p-ink-2)', fontSize: 15, lineHeight: 1.6 }}>
            Megamind watches <em>how</em> you answer — speed, confidence, mistakes — and quietly
            rewrites tomorrow&apos;s quiz to close the gaps.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="how-grid">
          {STEPS.map(s => (
            <div key={s.n} className="how-card" style={{
              padding: 24, borderRadius: 'var(--p-radius)',
              background: s.featured ? 'var(--p-primary)' : 'var(--p-bg)',
              border: `1px solid ${s.featured ? 'transparent' : 'var(--p-line)'}`,
              boxShadow: s.featured ? 'var(--p-shadow-orange)' : 'var(--p-shadow)',
              minHeight: 230, position: 'relative',
            }}>
              {s.featured && (
                <span style={{ position: 'absolute', top: -13, left: 18, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'var(--p-ink)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  the AI bit
                </span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 15, color: s.featured ? 'rgba(255,255,255,0.7)' : 'var(--p-muted)' }}>{s.n}</span>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: s.featured ? 'rgba(255,255,255,0.2)' : s.color, display: 'grid', placeItems: 'center', fontSize: 25 }}>{s.icon}</div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 21, fontWeight: 800, marginBottom: 8, color: s.featured ? '#fff' : 'var(--p-ink)' }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: s.featured ? 'rgba(255,255,255,0.92)' : 'var(--p-ink-2)' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .how-card { transition: transform .15s, box-shadow .15s; }
        .how-card:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-lg) !important; }
        @media (max-width: 960px) { .how-grid { grid-template-columns: repeat(2, 1fr) !important; } .how-head { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .how-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

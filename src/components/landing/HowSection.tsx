// Server Component - How it works section (dark)
const STEPS = [
  { n: '01', title: 'Pick a subject', body: 'Choose from ICT, Physics, Chemistry, Maths or English. Tell us your grade and your target.', color: 'var(--p-card-a)', icon: '📚' },
  { n: '02', title: 'AI builds your quiz', body: "Our AI picks questions based on what you know, where you slipped, and what's next on your syllabus.", color: 'var(--p-card-c)', icon: '✨', featured: true },
  { n: '03', title: 'Learn as you answer', body: 'Every question has a short theory snippet. Stuck? Tap it. Learn the concept in 30 seconds, then answer.', color: 'var(--p-card-d)', icon: '💡' },
  { n: '04', title: 'Skill graph updates', body: 'Your weak spots get revisited. Your strengths graduate to harder questions. It adapts every day.', color: 'var(--p-card-b)', icon: '📈' },
];

export function HowSection() {
  return (
    <section id="how" style={{ padding: '110px 0', background: 'var(--p-ink)', color: 'var(--p-bg)', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 28, marginBottom: 56 }} className="how-head">
          <div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-bg-alt)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--p-secondary)', display: 'inline-block' }} />
              How it works
            </span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,50px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 18, maxWidth: 820, color: 'var(--p-bg)' }}>
              A tutor that <span style={{ color: 'var(--p-secondary)' }}>rebuilds itself</span> every time you answer.
            </h2>
          </div>
          <div style={{ maxWidth: 320, color: 'var(--p-bg-alt)', fontSize: 15 }}>
            Megamind watches <em>how</em> you answer — speed, confidence, mistakes — and quietly
            rewrites tomorrow&apos;s quiz to close the gaps.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="how-grid">
          {STEPS.map((s) => (
            <div key={s.n} style={{
              padding: 24, position: 'relative',
              background: s.featured ? s.color : 'var(--p-ink-2)',
              color: s.featured ? 'var(--p-ink)' : 'var(--p-bg)',
              border: `2px solid ${s.featured ? 'var(--p-ink)' : 'var(--p-bg)'}`,
              borderRadius: 18,
              boxShadow: '6px 6px 0 var(--p-secondary)',
              minHeight: 260,
            }}>
              {s.featured && (
                <span style={{
                  position: 'absolute', top: -14, left: 20,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999,
                  fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  background: 'var(--p-secondary)', color: 'var(--p-ink)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-ink)' }} /> the AI bit
                </span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{s.n}</div>
                <div style={{
                  fontSize: 26, width: 46, height: 46, borderRadius: 12,
                  background: s.featured ? 'var(--p-ink)' : 'var(--p-secondary)',
                  color: s.featured ? 'var(--p-secondary)' : 'var(--p-ink)',
                  border: s.featured ? '2px solid var(--p-ink)' : '2px solid var(--p-bg)',
                  display: 'grid', placeItems: 'center', transform: 'rotate(-4deg)',
                }}>{s.icon}</div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>{s.body}</p>
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

// Client Component - Subjects grid section with hover effects
'use client';

const SUBJECTS = [
  { id: 'ict',     name: 'ICT',         color: 'var(--p-card-c)', modules: 12, emoji: '💻', topics: ['Networks', 'Programming', 'Databases', 'Web tech'] },
  { id: 'physics', name: 'Physics',     color: 'var(--p-card-a)', modules: 9,  emoji: '⚛️', topics: ['Mechanics', 'Waves', 'Electricity', 'Modern'] },
  { id: 'chem',    name: 'Chemistry',   color: 'var(--p-card-d)', modules: 8,  emoji: '🧪', topics: ['Organic', 'Inorganic', 'Physical', 'Analysis'] },
  { id: 'math',    name: 'Mathematics', color: 'var(--p-card-e)', modules: 14, emoji: '📐', topics: ['Algebra', 'Calculus', 'Stats', 'Vectors'] },
  { id: 'english', name: 'English',     color: 'var(--p-card-b)', modules: 7,  emoji: '📝', topics: ['Grammar', 'Essays', 'Reading', 'Listening'] },
];

export function SubjectsSection() {
  return (
    <section id="subjects" style={{ padding: '110px 0', background: 'var(--p-bg-alt)', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 50, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />
              Featured subjects
            </span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,50px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 18, maxWidth: 720, color: 'var(--p-ink)' }}>
              Five subjects. Fifty modules. One adaptive engine.
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }} className="subjects-grid">
          {SUBJECTS.map((s, i) => (
            <div key={s.id} style={{
              padding: 22, border: '2px solid var(--p-ink)', borderRadius: 18,
              background: s.color, boxShadow: '6px 6px 0 var(--p-ink)',
              position: 'relative', display: 'flex', flexDirection: 'column',
              minHeight: 240, cursor: 'pointer',
              transition: 'transform .15s ease, box-shadow .15s ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-3px,-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '9px 9px 0 var(--p-ink)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 var(--p-ink)'; }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--p-bg)', border: '2px solid var(--p-ink)', display: 'grid', placeItems: 'center', fontSize: 24, transform: 'rotate(-6deg)' }}>
                  {s.emoji}
                </div>
                <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, opacity: 0.75, color: 'var(--p-ink)' }}>{s.modules} modules</span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 22, fontWeight: 700, marginBottom: 4, color: 'var(--p-ink)' }}>{s.name}</h3>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink-2)', marginBottom: 12 }}>O/L · A/L</div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, flex: 1, color: 'var(--p-ink-2)' }}>
                {s.topics.map(t => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--p-ink)', flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, color: 'var(--p-ink)' }}>start →</span>
                {(i === 0 || i === 2) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 9, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--p-primary)', color: 'var(--p-primary-ink)' }}>
                    popular
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1060px) { .subjects-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 700px) { .subjects-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 440px) { .subjects-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

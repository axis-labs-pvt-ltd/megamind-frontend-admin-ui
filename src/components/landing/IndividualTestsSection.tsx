// Server Component - Individual test purchase marketplace preview
import Link from 'next/link';
const TESTS = [
  {
    subject: 'Physics',
    grade: 'A/L · 2023 Paper',
    title: 'Mechanics & Waves',
    questions: 40,
    time: '90 min',
    difficulty: 'Hard',
    price: '1,500',
    color: 'var(--p-card-a)',
    emoji: '⚛️',
    tags: ['Mechanics', 'Waves', 'Electricity'],
    attempts: '2.4k',
  },
  {
    subject: 'ICT',
    grade: 'O/L · Model Paper',
    title: 'Full Syllabus Mock',
    questions: 50,
    time: '120 min',
    difficulty: 'Medium',
    price: '1,000',
    color: 'var(--p-card-c)',
    emoji: '💻',
    tags: ['Networks', 'Databases', 'Web'],
    attempts: '5.1k',
    popular: true,
  },
  {
    subject: 'Chemistry',
    grade: 'A/L · 2022 Paper',
    title: 'Organic Chemistry',
    questions: 35,
    time: '75 min',
    difficulty: 'Hard',
    price: '1,500',
    color: 'var(--p-card-d)',
    emoji: '🧪',
    tags: ['Organic', 'Reactions', 'Analysis'],
    attempts: '1.8k',
  },
  {
    subject: 'Mathematics',
    grade: 'O/L · Model Paper',
    title: 'Algebra & Calculus',
    questions: 30,
    time: '60 min',
    difficulty: 'Medium',
    price: '1,000',
    color: 'var(--p-card-e)',
    emoji: '📐',
    tags: ['Algebra', 'Calculus', 'Vectors'],
    attempts: '3.2k',
  },
  {
    subject: 'English',
    grade: 'O/L · Practice Set',
    title: 'Reading & Grammar',
    questions: 45,
    time: '60 min',
    difficulty: 'Easy',
    price: '1,000',
    color: 'var(--p-card-b)',
    emoji: '📝',
    tags: ['Grammar', 'Reading', 'Essays'],
    attempts: '4.7k',
  },
  {
    subject: 'Physics',
    grade: 'A/L · Model Paper',
    title: 'Modern Physics',
    questions: 30,
    time: '60 min',
    difficulty: 'Hard',
    price: '2,000',
    color: 'var(--p-card-a)',
    emoji: '⚛️',
    tags: ['Quantum', 'Nuclear', 'Relativity'],
    attempts: '980',
  },
];

const DIFF_COLOR: Record<string, string> = {
  Easy:   'var(--p-card-d)',
  Medium: 'var(--p-card-a)',
  Hard:   'var(--p-card-b)',
};

export function IndividualTestsSection() {
  return (
    <section id="tests" style={{ padding: '110px 0', background: 'var(--p-bg)', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 50, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />
              Test marketplace
            </span>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,50px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 18, maxWidth: 680, color: 'var(--p-ink)' }}>
              No subscription? Buy a{' '}
              <span style={{ color: 'var(--p-primary)' }}>single test</span>{' '}
              and keep it forever.
            </h2>
            <p style={{ marginTop: 16, color: 'var(--p-ink-2)', fontSize: 16, maxWidth: 560 }}>
              Past papers, model tests and subject packs — from Rs.&nbsp;1,000. Yours permanently, AI feedback included.
            </p>
          </div>
          <Link href="/marketplace" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '13px 20px', border: '2px solid var(--p-ink)', borderRadius: 999,
            background: 'var(--p-bg)', color: 'var(--p-ink)',
            fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14,
            boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            View all tests →
          </Link>
        </div>

        {/* Test cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="tests-grid">
          {TESTS.map((t, i) => (
            <div key={i} style={{
              border: '2px solid var(--p-ink)', borderRadius: 18,
              background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              position: 'relative',
            }}>
              {t.popular && (
                <span style={{
                  position: 'absolute', top: -1, right: 20,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', border: '1.5px solid var(--p-ink)',
                  borderTop: 'none', borderRadius: '0 0 10px 10px',
                  fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: 'var(--p-primary)', color: 'var(--p-primary-ink)',
                }}>★ popular</span>
              )}

              {/* Coloured header band */}
              <div style={{ background: t.color, borderBottom: '2px solid var(--p-ink)', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--p-bg)', border: '2px solid var(--p-ink)', display: 'grid', placeItems: 'center', fontSize: 22, transform: 'rotate(-5deg)' }}>
                    {t.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, color: 'var(--p-ink)' }}>{t.subject}</div>
                    <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--p-ink-2)', marginTop: 2 }}>{t.grade}</div>
                  </div>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999,
                  fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 600,
                  background: DIFF_COLOR[t.difficulty], color: 'var(--p-ink)',
                }}>
                  {t.difficulty}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)', marginBottom: 12 }}>{t.title}</h3>

                {/* Meta row */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                  {[
                    ['📋', `${t.questions} questions`],
                    ['⏱', t.time],
                    ['👥', `${t.attempts} attempts`],
                  ].map(([icon, label]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>
                      <span>{icon}</span>{label}
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{
                      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                      border: '1.5px solid var(--p-ink)', borderRadius: 999,
                      fontFamily: 'var(--font-mono,monospace)', fontSize: 10,
                      background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '14px 20px', borderTop: '2px dashed var(--p-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>Rs. {t.price}</div>
                  <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginTop: 2 }}>one-time · keep forever</div>
                </div>
                <button style={{
                  padding: '11px 18px', border: '2px solid var(--p-ink)', borderRadius: 999,
                  background: 'var(--p-primary)', color: 'var(--p-primary-ink)',
                  fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)',
                }}>
                  Buy now →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div style={{ marginTop: 40, padding: '24px 32px', border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)' }}>Need the full library?</div>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginTop: 4 }}>Scholar plan gives you unlimited access for Rs. 1,490/month</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none' }}>See plans</a>
            <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none' }}>Start free →</a>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 960px) { .tests-grid { grid-template-columns: repeat(2,1fr) !important; } }
               @media (max-width: 600px) { .tests-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

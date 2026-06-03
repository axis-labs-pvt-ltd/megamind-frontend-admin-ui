// Server Component - Subjects grid section
const SUBJECTS = [
  { id: 'ict',     name: 'ICT',         tint: 'var(--p-blue)',   ink: 'var(--p-ink-blue)',   emoji: '💻', modules: 12, topics: ['Networks', 'Programming', 'Databases', 'Web tech'],   tutor: 'Mr. Silva',     popular: true },
  { id: 'physics', name: 'Physics',     tint: 'var(--p-peach)',  ink: 'var(--p-ink-peach)',  emoji: '⚛️', modules: 9,  topics: ['Mechanics', 'Waves', 'Electricity', 'Modern'],           tutor: 'Ms. Fernando' },
  { id: 'chem',    name: 'Chemistry',   tint: 'var(--p-mint)',   ink: 'var(--p-ink-mint)',   emoji: '🧪', modules: 8,  topics: ['Organic', 'Inorganic', 'Physical', 'Analysis'],           tutor: 'Mr. Bandara',   popular: true },
  { id: 'math',    name: 'Mathematics', tint: 'var(--p-lav)',    ink: 'var(--p-ink-lav)',    emoji: '📐', modules: 14, topics: ['Algebra', 'Calculus', 'Stats', 'Vectors'],                tutor: 'Mr. Perera' },
  { id: 'english', name: 'English',     tint: 'var(--p-pink)',   ink: 'var(--p-ink-pink)',   emoji: '📚', modules: 7,  topics: ['Grammar', 'Essays', 'Reading', 'Listening'],              tutor: 'Ms. Jayasing' },
];

export function SubjectsSection() {
  return (
    <section id="subjects" style={{ padding: '84px 0', background: 'var(--p-bg-alt)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* Section head */}
        <div className="subj-head">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              Explore courses
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 680, color: 'var(--p-ink)', margin: 0 }}>
              Five subjects.{' '}
              <span style={{ color: 'var(--p-primary)', position: 'relative', display: 'inline-block' }}>
                Fifty modules.
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 8, background: 'var(--p-primary)', opacity: 0.22, borderRadius: 6, zIndex: -1 }} />
              </span>{' '}
              One adaptive engine.
            </h2>
          </div>
          <a href="#" className="subj-ghost-btn">See all subjects →</a>
        </div>

        {/* 3-col grid + CTA tile */}
        <div className="subj-grid">
          {SUBJECTS.map(s => (
            <article key={s.id} className="card subj-card">

              {/* Coloured banner */}
              <div className="subj-banner" style={{ background: s.tint }}>
                <div className="subj-badge">{s.emoji}</div>
                {/* Tutor photo placeholder */}
                <div className="subj-photo" />
                {s.popular && <span className="subj-pop" style={{ color: 'var(--p-primary-dark)' }}>★ Popular</span>}
              </div>

              {/* Card body */}
              <div className="subj-body">
                <div className="subj-row">
                  <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 20, color: 'var(--p-ink)', margin: 0 }}>{s.name}</h3>
                  <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>{s.modules} modules</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: s.ink, marginBottom: 14, marginTop: 4 }}>
                  O/L · A/L · by {s.tutor}
                </div>
                <ul className="subj-topics">
                  {s.topics.map(t => (
                    <li key={t}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.ink, flexShrink: 0 }} />
                      {t}
                    </li>
                  ))}
                </ul>
                <a href="#quiz" className="subj-explore-btn" style={{ background: 'var(--p-primary)', boxShadow: 'var(--p-shadow-orange)' }}>
                  Explore →
                </a>
              </div>
            </article>
          ))}

          {/* 6th — CTA tile */}
          <article className="card subj-cta">
            <div className="subj-cta-ic">🎓</div>
            <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 22, color: 'var(--p-ink)', marginBottom: 8 }}>Not sure where to start?</h3>
            <p style={{ fontSize: 14.5, color: 'var(--p-ink-2)', marginBottom: 18, lineHeight: 1.6 }}>
              Take a 2-minute diagnostic and we&apos;ll build your first quiz for you.
            </p>
            <a href="#quiz" className="subj-explore-btn" style={{ background: 'var(--p-primary)', boxShadow: 'var(--p-shadow-orange)', justifyContent: 'center' }}>
              Take diagnostic →
            </a>
          </article>
        </div>
      </div>

      <style>{`
        .subj-head {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 20px; margin-bottom: 40px; flex-wrap: wrap;
        }
        .subj-ghost-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border: 1.5px solid var(--p-line-2);
          border-radius: 12px; background: #fff; color: var(--p-ink-2);
          font-family: var(--font-display,Nunito,sans-serif); font-weight: 700; font-size: 14px;
          text-decoration: none; box-shadow: var(--p-shadow-sm);
          white-space: nowrap; transition: border-color .15s, color .15s;
        }
        .subj-ghost-btn:hover { border-color: var(--p-primary); color: var(--p-primary); }

        .subj-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        .subj-card {
          overflow: hidden; display: flex; flex-direction: column;
          border: 1px solid var(--p-line); border-radius: 20px;
          background: #fff; box-shadow: var(--p-shadow-sm);
          transition: transform .15s, box-shadow .15s;
        }
        .subj-card:hover { transform: translateY(-5px); box-shadow: var(--p-shadow-lg); }

        .subj-banner {
          position: relative; height: 132px; padding: 16px;
        }
        .subj-badge {
          width: 46px; height: 46px; border-radius: 12px;
          background: rgba(255,255,255,0.75);
          display: grid; place-items: center; font-size: 24px;
          box-shadow: var(--p-shadow-sm);
        }
        .subj-photo {
          position: absolute; right: 14px; bottom: -28px;
          width: 96px; height: 110px; border-radius: 14px;
          border: 3px solid #fff; box-shadow: var(--p-shadow);
          background:
            repeating-linear-gradient(135deg, rgba(30,34,48,0.07) 0 2px, transparent 2px 13px),
            var(--p-bg-alt);
        }
        .subj-pop {
          position: absolute; top: 14px; right: 14px;
          background: #fff;
          font-family: var(--font-display,Nunito,sans-serif); font-weight: 800; font-size: 11.5px;
          padding: 5px 11px; border-radius: 999px; box-shadow: var(--p-shadow-sm);
        }

        .subj-body {
          padding: 42px 22px 22px; display: flex; flex-direction: column; flex: 1;
        }
        .subj-row {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 4px;
        }
        .subj-topics {
          list-style: none; padding: 0; margin: 0 0 20px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 9px;
        }
        .subj-topics li {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: var(--p-ink-2); font-weight: 600;
          font-family: var(--font-body,Mulish,sans-serif);
        }

        .subj-explore-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 18px; border: none; border-radius: 12px;
          color: #fff;
          font-family: var(--font-display,Nunito,sans-serif); font-weight: 800; font-size: 14px;
          text-decoration: none; text-align: center; justify-content: center;
          transition: transform .15s, box-shadow .15s;
        }
        .subj-explore-btn:hover { transform: translateY(-2px); }

        .subj-cta {
          padding: 28px; display: flex; flex-direction: column; justify-content: center;
          background: var(--p-bg-warm);
          border: 1.5px dashed var(--p-line-2) !important;
          border-radius: 20px !important;
          box-shadow: none !important;
        }
        .subj-cta-ic {
          width: 56px; height: 56px; border-radius: 16px;
          background: #fff; display: grid; place-items: center;
          font-size: 30px; box-shadow: var(--p-shadow-sm); margin-bottom: 16px;
        }

        @media (max-width: 960px) { .subj-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .subj-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

// Client Component - Subjects grid section (loads from DB)
'use client';

import { useT } from '@/contexts/LanguageContext';
import { useSubjects } from '@/hooks/queries/useSubjects';
import Link from 'next/link';

const TINTS = [
  { bg: 'var(--p-blue)',   ink: 'var(--p-ink-blue)' },
  { bg: 'var(--p-peach)',  ink: 'var(--p-ink-peach)' },
  { bg: 'var(--p-mint)',   ink: 'var(--p-ink-mint)' },
  { bg: 'var(--p-lav)',    ink: 'var(--p-ink-lav)' },
  { bg: 'var(--p-yellow)', ink: 'var(--p-ink-yellow)' },
  { bg: 'var(--p-pink)',   ink: 'var(--p-ink-pink)' },
];

function getEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('ict') || n.includes('computer')) return '💻';
  if (n.includes('physics')) return '⚛️';
  if (n.includes('chemistry')) return '🧪';
  if (n.includes('math')) return '📐';
  if (n.includes('english')) return '📚';
  if (n.includes('biology')) return '🌿';
  if (n.includes('history')) return '📜';
  if (n.includes('geography')) return '🌍';
  return '📋';
}

export function SubjectsSection() {
  const t = useT();
  const { data: subjects = [], isLoading } = useSubjects();

  return (
    <section id="subjects" style={{ padding: '84px 0', background: 'var(--p-bg-alt)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* Section head */}
        <div className="subj-head">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              {t.subjects.eyebrow}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 680, color: 'var(--p-ink)', margin: 0 }}>
              {t.subjects.heading}
            </h2>
          </div>
          <a href="#quiz" className="subj-ghost-btn">See all subjects →</a>
        </div>

        {isLoading ? (
          /* Loading skeleton */
          <div className="subj-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', height: 340, opacity: 0.5 + i * 0.08 }} className="subj-skeleton" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          /* CTA tile only */
          <div className="subj-grid">
            <CtaTile />
          </div>
        ) : (
          <div className="subj-grid">
            {subjects.map((s, i) => {
              const { bg, ink } = TINTS[i % TINTS.length];
              const emoji = getEmoji(s.name);
              return (
                <article key={s.id} className="card subj-card">
                  <div className="subj-banner" style={{ background: bg }}>
                    <div className="subj-badge">{emoji}</div>
                    <div className="subj-photo" />
                  </div>

                  <div className="subj-body">
                    <div className="subj-row">
                      <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 20, color: 'var(--p-ink)', margin: 0 }}>{s.name}</h3>
                      <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>{s.modules.length} modules</span>
                    </div>
                    {s.description && (
                      <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--p-ink-2)', marginBottom: 14, marginTop: 4, lineHeight: 1.5 }}>
                        {s.description.slice(0, 80)}{s.description.length > 80 ? '…' : ''}
                      </div>
                    )}
                    {s.modules.length > 0 && (
                      <ul className="subj-topics">
                        {s.modules.slice(0, 4).map(m => (
                          <li key={m.id}>
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: ink, flexShrink: 0 }} />
                            {m.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link href={`/subjects/${s.id}`} className="subj-explore-btn" style={{ background: 'var(--p-primary)', boxShadow: 'var(--p-shadow-orange)' }}>
                      Explore →
                    </Link>
                  </div>
                </article>
              );
            })}

            {/* 6th slot — CTA tile */}
            {subjects.length % 3 !== 0 || subjects.length < 6 ? null : <CtaTile />}
            {subjects.length % 3 === 0 && subjects.length >= 6 ? null : subjects.length < 6 ? <CtaTile /> : null}
          </div>
        )}
      </div>

      <style>{`
        .subj-head { display:flex; justify-content:space-between; align-items:flex-end; gap:20px; margin-bottom:40px; flex-wrap:wrap; }
        .subj-ghost-btn { display:inline-flex; align-items:center; gap:8px; padding:9px 18px; border:1.5px solid var(--p-line-2); border-radius:12px; background:#fff; color:var(--p-ink-2); font-family:var(--font-display,Nunito,sans-serif); font-weight:700; font-size:14px; text-decoration:none; box-shadow:var(--p-shadow-sm); white-space:nowrap; transition:border-color .15s,color .15s; }
        .subj-ghost-btn:hover { border-color:var(--p-primary); color:var(--p-primary); }
        .subj-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .subj-card { overflow:hidden; display:flex; flex-direction:column; border:1px solid var(--p-line); border-radius:20px; background:#fff; box-shadow:var(--p-shadow-sm); transition:transform .15s,box-shadow .15s; }
        .subj-card:hover { transform:translateY(-5px); box-shadow:var(--p-shadow-lg); }
        .subj-banner { position:relative; height:130px; padding:16px; }
        .subj-badge { width:46px; height:46px; border-radius:12px; background:rgba(255,255,255,0.75); display:grid; place-items:center; font-size:24px; box-shadow:var(--p-shadow-sm); }
        .subj-photo { position:absolute; right:14px; bottom:-24px; width:78px; height:94px; border-radius:14px; border:3px solid #fff; box-shadow:var(--p-shadow); background:repeating-linear-gradient(135deg,rgba(30,34,48,0.07) 0 2px,transparent 2px 13px),var(--p-bg-alt); }
        .subj-body { padding:36px 22px 22px; display:flex; flex-direction:column; flex:1; }
        .subj-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px; }
        .subj-topics { list-style:none; padding:0; margin:0 0 20px; display:grid; grid-template-columns:1fr 1fr; gap:9px; }
        .subj-topics li { display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--p-ink-2); font-weight:600; font-family:var(--font-body,Mulish,sans-serif); }
        .subj-explore-btn { display:flex; align-items:center; gap:8px; padding:11px 18px; border:none; border-radius:12px; color:#fff; font-family:var(--font-display,Nunito,sans-serif); font-weight:800; font-size:14px; text-decoration:none; justify-content:center; transition:transform .15s; margin-top:auto; }
        .subj-explore-btn:hover { transform:translateY(-2px); }
        .subj-cta { padding:28px; display:flex; flex-direction:column; justify-content:center; background:var(--p-bg-warm); border:1.5px dashed var(--p-line-2) !important; border-radius:20px !important; box-shadow:none !important; }
        .subj-cta-ic { width:56px; height:56px; border-radius:16px; background:#fff; display:grid; place-items:center; font-size:30px; box-shadow:var(--p-shadow-sm); margin-bottom:16px; }
        .subj-skeleton { animation:sk-pulse 1.6s ease-in-out infinite; }
        @keyframes sk-pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @media (max-width:960px) { .subj-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:560px) { .subj-grid { grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}

function CtaTile() {
  return (
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
  );
}

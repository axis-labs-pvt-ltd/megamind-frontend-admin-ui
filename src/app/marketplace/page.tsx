'use client';

import Link from 'next/link';
import { useState } from 'react';

const TESTS = [
  { subj: 'Physics',     title: 'A/L Mechanics · Full paper',        qs: 50, time: '90 min',  price: 1500, tag: 'A/L', color: 'var(--p-card-a)', bestseller: true,  rating: 4.9, reviews: 184 },
  { subj: 'Chemistry',   title: 'Organic Chem · Past paper set',      qs: 40, time: '75 min',  price: 1200, tag: 'A/L', color: 'var(--p-card-d)', rating: 4.8, reviews: 122 },
  { subj: 'ICT',         title: 'Database Management · Module test',  qs: 30, time: '45 min',  price: 1000, tag: 'O/L', color: 'var(--p-card-c)', rating: 4.7, reviews: 96  },
  { subj: 'Mathematics', title: 'Calculus · Diagnostic',              qs: 25, time: '60 min',  price: 1000, tag: 'A/L', color: 'var(--p-card-e)', isNew: true,       rating: 4.9, reviews: 41  },
  { subj: 'English',     title: 'Grammar & Essay · Paper',            qs: 35, time: '60 min',  price: 1200, tag: 'O/L', color: 'var(--p-card-b)', rating: 4.6, reviews: 78  },
  { subj: 'Physics',     title: 'Waves & Oscillations',               qs: 30, time: '50 min',  price: 1200, tag: 'A/L', color: 'var(--p-card-a)', rating: 4.8, reviews: 64  },
  { subj: 'Chemistry',   title: 'Periodic Table mastery',             qs: 25, time: '40 min',  price: 1000, tag: 'O/L', color: 'var(--p-card-d)', rating: 4.5, reviews: 52  },
  { subj: 'ICT',         title: 'Programming fundamentals',           qs: 35, time: '55 min',  price: 1200, tag: 'O/L', color: 'var(--p-card-c)', rating: 4.7, reviews: 88  },
  { subj: 'Mathematics', title: 'Combined Maths · Pure',              qs: 60, time: '120 min', price: 2000, tag: 'A/L', color: 'var(--p-card-e)', bestseller: true,  rating: 5.0, reviews: 156 },
  { subj: 'English',     title: 'Reading Comprehension · Set A',      qs: 30, time: '45 min',  price: 1000, tag: 'O/L', color: 'var(--p-card-b)', rating: 4.6, reviews: 61  },
  { subj: 'Physics',     title: 'Modern Physics · Nuclear',           qs: 30, time: '60 min',  price: 1500, tag: 'A/L', color: 'var(--p-card-a)', rating: 4.8, reviews: 49  },
  { subj: 'Mathematics', title: 'Statistics & Probability',           qs: 35, time: '70 min',  price: 1200, tag: 'A/L', color: 'var(--p-card-e)', isNew: true,       rating: 4.7, reviews: 28  },
];

const SUBJECTS = ['All', 'Physics', 'Chemistry', 'ICT', 'Mathematics', 'English'];
const GRADES   = ['All grades', 'O/L', 'A/L', 'Uni entrance'];
const SORTS    = ['Most popular', 'Newest', 'Price ↑', 'Price ↓'];

export default function MarketplacePage() {
  const [search,  setSearch]  = useState('');
  const [subject, setSubject] = useState('All');
  const [grade,   setGrade]   = useState('All grades');
  const [sort,    setSort]    = useState('Most popular');

  const filtered = TESTS.filter(t => {
    const matchSubj  = subject === 'All' || t.subj === subject;
    const matchGrade = grade   === 'All grades' || t.tag === grade;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.subj.toLowerCase().includes(search.toLowerCase());
    return matchSubj && matchGrade && matchSearch;
  }).sort((a, b) => {
    if (sort === 'Price ↑') return a.price - b.price;
    if (sort === 'Price ↓') return b.price - a.price;
    if (sort === 'Newest')  return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return b.reviews - a.reviews;
  });

  const countFor = (s: string) => s === 'All' ? TESTS.length : TESTS.filter(t => t.subj === s).length;

  return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', fontSize: 18, fontWeight: 700, transform: 'rotate(-8deg)', fontFamily: 'var(--font-display,sans-serif)' }}>M</span>
            <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/auth/login" style={{ padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' }}>Log in</Link>
            <Link href="/auth/signup" style={{ padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none' }}>Start free →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '64px 0 0', borderBottom: '2px solid var(--p-ink)', background: 'var(--p-bg)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

          {/* Breadcrumb */}
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span>Test store</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 40, alignItems: 'center', marginBottom: 40 }} className="mp-hero-grid">
            <div>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />
                Buy single tests
              </span>
              <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,4.5vw,64px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 16, marginBottom: 20, color: 'var(--p-ink)' }}>
                No subscription?{' '}
                <span style={{ display: 'inline-block', position: 'relative' }}>
                  No problem.
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='%232D6A4F' stroke-width='3' stroke-linecap='round'/></svg>\") center/100% 100% no-repeat" }} />
                </span>
              </h1>
              <p style={{ fontSize: 17, color: 'var(--p-ink-2)', maxWidth: 540, lineHeight: 1.6 }}>
                One-time purchase. Yours forever. Pick a test, pay Rs.&nbsp;1,000–2,000, and review your answers and AI feedback anytime.
              </p>
            </div>

            {/* Bundle promo card */}
            <div style={{ padding: '22px 26px', border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-secondary)', boxShadow: '6px 6px 0 var(--p-ink)', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 44, lineHeight: 1 }}>🎁</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)', marginBottom: 6 }}>Bundle 3, save 15%</div>
                <div style={{ fontSize: 13, color: 'var(--p-ink-2)' }}>Use code <b style={{ fontFamily: 'var(--font-mono,monospace)', background: 'var(--p-ink)', color: 'var(--p-bg)', padding: '1px 6px', borderRadius: 4 }}>MIND3</b> at checkout.</div>
              </div>
            </div>
          </div>

          {/* Search & filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr auto auto auto', gap: 12, paddingBottom: 32, alignItems: 'center' }} className="mp-filters">
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--p-muted)', pointerEvents: 'none' }} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tests, topics, syllabus…"
                style={{ width: '100%', padding: '12px 16px 12px 44px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, background: 'var(--p-bg)', color: 'var(--p-ink)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {[
              { value: grade,   onChange: setGrade,   options: GRADES },
              { value: sort,    onChange: setSort,    options: SORTS  },
            ].map(({ value, onChange, options }) => (
              <select key={options[0]} value={value} onChange={e => onChange(e.target.value)} style={{ padding: '12px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'inherit', fontSize: 13, background: 'var(--p-bg)', color: 'var(--p-ink)', cursor: 'pointer', outline: 'none' }}>
                {options.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </div>
      </section>

      {/* Listing */}
      <section style={{ padding: '44px 0 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

          {/* Subject chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setSubject(s)} style={{
                padding: '8px 16px', border: '2px solid var(--p-ink)', borderRadius: 999,
                background: subject === s ? 'var(--p-ink)' : 'var(--p-bg)',
                color: subject === s ? 'var(--p-bg)' : 'var(--p-ink)',
                fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', boxShadow: subject === s ? '3px 3px 0 var(--p-primary)' : 'none',
              }}>
                {s} <span style={{ opacity: 0.65, marginLeft: 4 }}>· {countFor(s)}</span>
              </button>
            ))}
          </div>

          {/* Result count */}
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginBottom: 20 }}>
            {filtered.length} test{filtered.length !== 1 ? 's' : ''} found
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--p-muted)', fontFamily: 'var(--font-mono,monospace)' }}>
              No tests match your search.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="mp-grid">
              {filtered.map((t, i) => (
                <div key={i} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                  {/* Coloured header */}
                  <div style={{ background: t.color, padding: '18px 22px', borderBottom: '2px solid var(--p-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 700, color: 'var(--p-ink)', letterSpacing: '0.08em' }}>{t.subj.toUpperCase()}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {t.bestseller && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 9, fontWeight: 600, background: 'var(--p-ink)', color: 'var(--p-bg)' }}>★ bestseller</span>
                      )}
                      {t.isNew && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 9, fontWeight: 600, background: 'var(--p-primary)', color: 'var(--p-primary-ink)' }}>new</span>
                      )}
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 9, background: 'var(--p-bg)', color: 'var(--p-ink)' }}>{t.tag}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 19, fontWeight: 700, lineHeight: 1.3, marginBottom: 10, color: 'var(--p-ink)' }}>{t.title}</h3>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 13 }}>
                      <span style={{ color: 'var(--p-secondary)', letterSpacing: 1 }}>★★★★★</span>
                      <span style={{ fontWeight: 700, color: 'var(--p-ink)' }}>{t.rating}</span>
                      <span style={{ color: 'var(--p-muted)' }}>· {t.reviews} reviews</span>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: 18, marginBottom: 18, fontSize: 13, color: 'var(--p-ink-2)' }}>
                      <span>📋 {t.qs} questions</span>
                      <span>⏱ {t.time}</span>
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Price row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px dashed var(--p-ink)', paddingTop: 16 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginBottom: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>One-time</div>
                        <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 24, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>
                          Rs. {t.price.toLocaleString()}
                        </div>
                      </div>
                      <button style={{ padding: '11px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)' }}>
                        Buy →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <button style={{ padding: '14px 32px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '4px 4px 0 var(--p-ink)' }}>
              Load more tests →
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .mp-hero-grid { grid-template-columns: 1fr !important; }
          .mp-filters   { grid-template-columns: 1fr 1fr !important; }
          .mp-grid      { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .mp-filters { grid-template-columns: 1fr !important; }
          .mp-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

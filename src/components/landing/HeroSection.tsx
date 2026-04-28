// Server Component - Landing page hero
import Image from 'next/image';
import Link from 'next/link';

function StatItem({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--p-ink)' }}>
        {big}
      </div>
      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

const wavyUnderline = (color = 'var(--p-primary)') =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'><path d='M0 5 Q 15 0 30 5 T 60 5 T 90 5 T 120 5' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='3' stroke-linecap='round'/></svg>") center/100% 100% no-repeat`;

export function HeroSection() {
  return (
    <section style={{ padding: '80px 0', background: 'var(--p-bg)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'center' }} className="hero-grid">

          {/* Left */}
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 26 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', border: '1.5px solid var(--p-ink)', borderRadius: 999,
                fontFamily: 'var(--font-mono, monospace)', fontSize: 11, fontWeight: 500,
                letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--p-bg)', color: 'var(--p-ink)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)' }} />
                AI-powered · built for SL students
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700,
              fontSize: 'clamp(44px,6.2vw,88px)', letterSpacing: '-0.02em', lineHeight: 1.05,
              color: 'var(--p-ink)', marginBottom: 22,
            }}>
              Learn while<br />
              you{' '}
              <span style={{ display: 'inline-block', position: 'relative' }}>
                quiz.
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 10, background: wavyUnderline() }} />
              </span>
              {' '}✦
            </h1>

            <p style={{ fontSize: 19, color: 'var(--p-ink-2)', maxWidth: 540, marginBottom: 32, lineHeight: 1.55 }}>
              Every question on Megamind comes with a short theory snippet — so you&apos;re not guessing,
              you&apos;re understanding. Built for O/L, A/L and university entrance prep in Physics,
              Chemistry, ICT, Maths and English.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="#quiz" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 22px', border: '2px solid var(--p-ink)', borderRadius: 999,
                background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontWeight: 600,
                fontFamily: 'var(--font-display, sans-serif)', fontSize: 15,
                boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none',
              }}>Try a free quiz →</a>
              <Link href="/my-tests" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 22px', border: '2px solid var(--p-ink)', borderRadius: 999,
                background: 'var(--p-bg)', color: 'var(--p-ink)', fontWeight: 600,
                fontFamily: 'var(--font-display, sans-serif)', fontSize: 15,
                boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none',
              }}>Browse tests · from Rs. 1,000</Link>
            </div>

            <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
              <StatItem big="12,400+" label="Students learning" />
              <StatItem big="38" label="Modules live" />
              <StatItem big="4.8 ★" label="Avg. rating" />
            </div>
          </div>

          {/* Right — collage */}
          <div style={{ position: 'relative', minHeight: 560 }}>
            {/* Main hero image */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '78%', height: 420,
              border: '2px solid var(--p-ink)', borderRadius: 18, boxShadow: '6px 6px 0 var(--p-ink)',
              overflow: 'hidden', background: 'var(--p-card-a)',
            }}>
              <Image
                src="/hero-student.jpg"
                alt="Megamind student"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>

            {/* Floating quiz card */}
            <div style={{
              position: 'absolute', left: 0, top: 80, width: 260,
              padding: 16, border: '2px solid var(--p-ink)', borderRadius: 18,
              background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>ICT · module 03</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: 'var(--p-bg)', color: 'var(--p-ink)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-accent)' }} />AI pick
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, marginBottom: 12, lineHeight: 1.3, color: 'var(--p-ink)' }}>
                Which OSI layer handles routing?
              </div>
              {['Data link', 'Network', 'Transport', 'Session'].map((o, i) => (
                <div key={o} style={{
                  padding: '8px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 8,
                  fontSize: 12, fontWeight: 500, marginBottom: 6,
                  background: i === 1 ? 'var(--p-primary)' : 'var(--p-bg)',
                  color: i === 1 ? 'var(--p-primary-ink)' : 'var(--p-ink)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid currentColor', display: 'grid', placeItems: 'center', fontSize: 9, fontFamily: 'var(--font-mono,monospace)' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {o}
                </div>
              ))}
            </div>

            {/* Floating theory card */}
            <div style={{
              position: 'absolute', right: 20, bottom: 20, width: 280, padding: 16,
              background: 'var(--p-secondary)', border: '2px solid var(--p-ink)', borderRadius: 18, boxShadow: '4px 4px 0 var(--p-ink)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-ink)', marginBottom: 6 }}>📖 mini theory</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--p-ink)' }}>
                The <b>Network layer</b> (Layer 3) handles logical addressing and routing between networks. IP lives here.
              </div>
            </div>

            {/* Badge sticker */}
            <div style={{
              position: 'absolute', top: 8, right: 8,
              width: 100, height: 100, borderRadius: 999,
              background: 'var(--p-accent)', color: 'var(--p-primary-ink)',
              border: '2px solid var(--p-ink)', boxShadow: '3px 3px 0 var(--p-ink)',
              display: 'grid', placeItems: 'center', textAlign: 'center',
              fontFamily: 'var(--font-mono,monospace)', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', lineHeight: 1.2, transform: 'rotate(8deg)',
            }}>14-day<br />free<br />trial</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

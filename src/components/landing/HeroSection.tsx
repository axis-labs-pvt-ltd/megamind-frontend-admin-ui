// Server Component - Landing page hero
import Image from 'next/image';
import Link from 'next/link';

function StatItem({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display, Nunito, sans-serif)', fontSize: 'clamp(30px,4vw,46px)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--p-ink)' }}>
        {big}
      </div>
      <div style={{ fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero-section" style={{ padding: '84px 0', background: 'var(--p-bg)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'center' }} className="hero-grid">

          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 26, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              AI-powered · built for SL students
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 800,
              fontSize: 'clamp(40px,5.5vw,72px)', letterSpacing: '-0.015em', lineHeight: 1.06,
              color: 'var(--p-ink)', marginBottom: 22,
            }}>
              Learn while<br />
              you{' '}
              <span style={{ color: 'var(--p-primary)', position: 'relative', whiteSpace: 'nowrap' }}>
                quiz.
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 8, background: 'var(--p-primary)', opacity: 0.22, borderRadius: 6, zIndex: -1 }} />
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(16px,1.4vw,19px)', color: 'var(--p-ink-2)', maxWidth: 540, marginBottom: 32, lineHeight: 1.65 }}>
              Every question on Megamind comes with a short theory snippet — so you&apos;re not guessing,
              you&apos;re understanding. Built for O/L, A/L and university entrance prep in Physics,
              Chemistry, ICT, Maths and English.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="#quiz" style={btnPrimary}>Try a free quiz →</a>
              <Link href="/my-tests" style={btnGhost}>Browse tests · from Rs. 1,000</Link>
            </div>

            <div className="hero-stats" style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <StatItem big="12,400+" label="Students learning" />
              <StatItem big="38" label="Modules live" />
              <StatItem big="4.8 ★" label="Avg. rating" />
            </div>
          </div>

          {/* Right — collage */}
          <div className="hero-right" style={{ position: 'relative', minHeight: 520 }}>
            {/* Main hero image */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '78%', height: 400,
              border: '1px solid var(--p-line)', borderRadius: 24,
              boxShadow: 'var(--p-shadow-lg)', overflow: 'hidden',
              background: 'var(--p-peach)',
            }}>
              <Image src="/hero-student.jpg" alt="Megamind student" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
            </div>

            {/* Floating quiz card */}
            <div style={{
              position: 'absolute', left: 0, top: 72, width: 260,
              padding: 18, border: '1px solid var(--p-line)', borderRadius: 18,
              background: '#fff', boxShadow: 'var(--p-shadow)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>ICT · module 03</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, background: 'var(--p-primary-soft)', color: 'var(--p-primary-dark)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)' }} />AI pick
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, marginBottom: 12, lineHeight: 1.3, color: 'var(--p-ink)' }}>
                Which OSI layer handles routing?
              </div>
              {['Data link', 'Network', 'Transport', 'Session'].map((o, i) => (
                <div key={o} style={{
                  padding: '9px 12px', border: '1.5px solid', borderRadius: 10,
                  borderColor: i === 1 ? 'var(--p-primary)' : 'var(--p-line-2)',
                  fontSize: 12, fontWeight: 600, marginBottom: 6,
                  background: i === 1 ? 'var(--p-primary-soft)' : '#fff',
                  color: i === 1 ? 'var(--p-primary-dark)' : 'var(--p-ink)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 22, height: 22, borderRadius: 7, background: i === 1 ? 'var(--p-primary)' : 'var(--p-bg-alt)', color: i === 1 ? '#fff' : 'var(--p-ink-2)', display: 'grid', placeItems: 'center', fontSize: 10, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {o}
                </div>
              ))}
            </div>

            {/* Floating theory card */}
            <div style={{
              position: 'absolute', right: 18, bottom: 18, width: 268,
              padding: 18, background: 'var(--p-bg-warm)',
              border: '1px solid var(--p-line)', borderRadius: 18,
              boxShadow: 'var(--p-shadow)',
            }}>
              <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-primary)', marginBottom: 8 }}>📖 Mini theory</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--p-ink-2)' }}>
                The <b style={{ color: 'var(--p-ink)' }}>Network layer</b> (Layer 3) handles logical addressing and routing. IP lives here.
              </div>
            </div>

            {/* Badge chip */}
            <div style={{
              position: 'absolute', top: 14, right: 14,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999,
              background: 'var(--p-primary-soft)', color: 'var(--p-primary-dark)',
              fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12,
              boxShadow: 'var(--p-shadow-sm)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--p-primary)' }} />
              14-day free trial
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid  { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
        }
        @media (max-width: 600px) {
          .hero-section  { padding: 56px 0 !important; }
          .hero-stats    { gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}

const btnPrimary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 9,
  padding: '13px 24px', border: 'none', borderRadius: 12,
  background: 'var(--p-primary)', color: '#fff',
  fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 800, fontSize: 15,
  boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none',
  transition: 'transform .15s, box-shadow .15s',
};
const btnGhost: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 9,
  padding: '13px 24px', border: '1.5px solid var(--p-line-2)', borderRadius: 12,
  background: '#fff', color: 'var(--p-ink)',
  fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 800, fontSize: 15,
  boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none',
};

// Client Component - Landing page footer
'use client';

export function LandingFooter() {
  const cols = [
    { h: 'Learn',   l: ['Subjects', 'Sample quiz', 'How it works', 'Free trial'] },
    { h: 'Shop',    l: ['Test marketplace', 'Pricing', 'Gift a plan', 'Discounts'] },
    { h: 'Company', l: ['About', 'Careers', 'Press', 'Contact'] },
    { h: 'Help',    l: ['FAQ', 'Support', 'Terms', 'Privacy'] },
  ];

  return (
    <footer style={{ background: 'var(--p-ink)', color: 'var(--p-bg)', padding: '90px 0 40px', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* CTA Banner */}
        <div style={{ background: 'var(--p-secondary)', color: 'var(--p-ink)', border: '2px solid var(--p-bg)', borderRadius: 28, padding: '52px 44px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'center', marginBottom: 70 }} className="foot-cta">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(26px,3vw,42px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 20, maxWidth: 480, color: 'var(--p-ink)' }}>
              Ready to actually understand this stuff?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--p-ink-2)', maxWidth: 440, marginBottom: 26 }}>
              Join 12,400+ Sri Lankan students already learning smarter. Start free — no credit card.
            </p>
            <form style={{ display: 'flex', gap: 10, maxWidth: 420 }} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.lk" style={{ flex: 1, padding: '13px 17px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, background: 'var(--p-bg)', color: 'var(--p-ink)' }} />
              <button type="submit" style={{ padding: '13px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)', whiteSpace: 'nowrap' }}>Sign up →</button>
            </form>
          </div>
          <div style={{ position: 'relative', height: 180 }}>
            <div style={{ position: 'absolute', right: 0, top: 0, width: 150, height: 150, borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', border: '2px solid var(--p-ink)', boxShadow: '6px 6px 0 var(--p-ink)', display: 'grid', placeItems: 'center', textAlign: 'center', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, lineHeight: 1.1, padding: 18, transform: 'rotate(-6deg)' }}>
              Your exam.<br />Easier.
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 56 }} className="foot-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em', marginBottom: 14, color: 'var(--p-bg)' }}>
              <span style={{ width: 38, height: 38, background: 'var(--p-primary)', border: '2px solid var(--p-bg)', borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', transform: 'rotate(-8deg)', fontSize: 20 }}>M</span>
              megamind<span style={{ color: 'var(--p-secondary)' }}>.</span>
            </div>
            <p style={{ maxWidth: 300, color: 'var(--p-bg-alt)', fontSize: 13, lineHeight: 1.55 }}>
              AI-powered learning built in Sri Lanka, for Sri Lankan students.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--p-bg-alt)', marginBottom: 14 }}>{col.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.l.map(x => <li key={x}><a href="#" style={{ color: 'var(--p-bg)', textDecoration: 'none', fontSize: 13 }}>{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '2px solid var(--p-ink-2)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>© 2026 Megamind Lanka (Pvt) Ltd · Colombo</div>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>made with ❤ in 🇱🇰</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .foot-cta { grid-template-columns: 1fr !important; }
          .foot-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  );
}

// Client Component - Landing page footer
'use client';

export function LandingFooter() {
  const cols = [
    { h: 'Learn',   l: ['Subjects', 'Sample quiz', 'How it works', 'Free trial'] },
    { h: 'Shop',    l: ['Test marketplace', 'Flashcards', 'Pricing', 'Gift a plan'] },
    { h: 'Company', l: ['About', 'Careers', 'Press', 'Contact'] },
    { h: 'Help',    l: ['FAQ', 'Support', 'Terms', 'Privacy'] },
  ];

  return (
    <footer style={{ background: 'var(--p-ink)', color: '#fff', padding: '80px 0 36px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* CTA Banner */}
        <div style={{ background: 'var(--p-primary)', borderRadius: 24, padding: '48px 44px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'center', marginBottom: 64, boxShadow: 'var(--p-shadow-orange)' }} className="foot-cta">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(24px,2.8vw,38px)', letterSpacing: '-0.015em', lineHeight: 1.1, marginBottom: 18, color: '#fff' }}>
              Ready to actually understand this stuff?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)', maxWidth: 440, marginBottom: 24, lineHeight: 1.65 }}>
              Join 12,400+ Sri Lankan students already learning smarter. Start free — no credit card.
            </p>
            <form style={{ display: 'flex', gap: 10, maxWidth: 420 }} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.lk" style={{ flex: 1, padding: '13px 17px', border: 'none', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, background: 'rgba(255,255,255,0.18)', color: '#fff', outline: 'none' }} />
              <button type="submit" style={{ padding: '13px 20px', border: 'none', borderRadius: 12, background: '#fff', color: 'var(--p-primary-dark)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: 'var(--p-shadow-sm)' }}>Sign up →</button>
            </form>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 160, height: 160, borderRadius: 999, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'grid', placeItems: 'center', textAlign: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 22, lineHeight: 1.2, padding: 20, color: '#fff', transform: 'rotate(-6deg)' }}>
              Your exam.<br />Easier.
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 52 }} className="foot-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', marginBottom: 14, color: '#fff' }}>
              <span style={{ width: 34, height: 34, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 18, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
              megamind
            </div>
            <p style={{ maxWidth: 280, color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.65 }}>
              AI-powered learning built in Sri Lanka, for Sri Lankan students.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>{col.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.l.map(x => <li key={x}><a href="#" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>© 2026 Megamind Lanka (Pvt) Ltd · Colombo</div>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>made with ❤ in 🇱🇰</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .foot-cta  { grid-template-columns: 1fr !important; }
          .foot-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  );
}

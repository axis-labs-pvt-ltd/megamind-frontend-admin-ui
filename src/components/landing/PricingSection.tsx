// Server Component - Pricing plans section
const PLANS = [
  { name: 'Free',    price: '0',     unit: 'forever',   desc: 'Taste the product. No credit card.',              features: ['2 subjects', '5 quizzes / week', 'Basic theory snippets', 'Community support'],                                         cta: 'Start free →',   highlight: false },
  { name: 'Scholar', price: '1,490', unit: 'per month', desc: 'For the student going all-in on their exam.',      features: ['All 5 subjects', 'Unlimited AI quizzes', 'Full theory library', 'Weak-spot analytics', 'Priority support'],           cta: 'Go Scholar →',   highlight: true,  badge: 'most popular' },
  { name: 'Family',  price: '2,990', unit: 'per month', desc: 'Two siblings, two syllabi, one bill.',             features: ['Everything in Scholar', '2 student accounts', 'Parent dashboard', 'Progress reports', 'Shared test library'],           cta: 'Pick Family →',  highlight: false },
];

export function PricingSection() {
  return (
    <section id="pricing" style={{ padding: '110px 0', background: 'var(--p-bg)', borderTop: '2px solid var(--p-ink)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p-ink-2)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 2, background: 'var(--p-primary)', display: 'inline-block' }} />Pricing
          </span>
          <h2 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,50px)', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 18, maxWidth: 780, color: 'var(--p-ink)' }}>
            Pay monthly. Cancel anytime. Or buy a single test.
          </h2>
          <p style={{ marginTop: 16, color: 'var(--p-ink-2)', maxWidth: 560, fontSize: 16 }}>
            Full access to all 5 subjects from Rs. 1,490/month. Or grab individual tests from Rs. 1,000.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }} className="pricing-grid">
          {PLANS.map(p => (
            <div key={p.name} style={{
              padding: 28,
              background: p.highlight ? 'var(--p-primary)' : 'var(--p-bg)',
              color: p.highlight ? 'var(--p-primary-ink)' : 'var(--p-ink)',
              border: '2px solid var(--p-ink)', borderRadius: 18,
              position: 'relative',
              transform: p.highlight ? 'translateY(-8px)' : 'none',
              boxShadow: p.highlight ? '10px 10px 0 var(--p-ink)' : '6px 6px 0 var(--p-ink)',
              display: 'flex', flexDirection: 'column',
            }}>
              {p.badge && (
                <span style={{ position: 'absolute', top: -14, right: 24, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--p-ink)', color: 'var(--p-bg)' }}>★ {p.badge}</span>
              )}
              <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 26, fontWeight: 700, marginBottom: 16 }}>{p.name}</h3>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em' }}>Rs. {p.price}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, opacity: 0.7 }}>{p.unit}</div>
              <p style={{ fontSize: 14, marginBottom: 20, opacity: p.highlight ? 0.85 : 1, color: p.highlight ? 'var(--p-primary-ink)' : 'var(--p-ink-2)' }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M5 12l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{ padding: '14px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: p.highlight ? 'var(--p-ink)' : 'var(--p-primary)', color: p.highlight ? 'var(--p-bg)' : 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 960px) { .pricing-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

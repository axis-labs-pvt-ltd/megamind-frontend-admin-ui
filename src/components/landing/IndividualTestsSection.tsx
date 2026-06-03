// Server Component - Individual tests section (fetches real tests from Supabase)
import { supabase } from '@/lib/supabase';
import { Test } from '@/types';
import Link from 'next/link';

const TINTS = [
  { bg: 'var(--p-peach)',  ink: 'var(--p-ink-peach)' },
  { bg: 'var(--p-blue)',   ink: 'var(--p-ink-blue)' },
  { bg: 'var(--p-mint)',   ink: 'var(--p-ink-mint)' },
  { bg: 'var(--p-lav)',    ink: 'var(--p-ink-lav)' },
  { bg: 'var(--p-yellow)', ink: 'var(--p-ink-yellow)' },
  { bg: 'var(--p-pink)',   ink: 'var(--p-ink-pink)' },
];

function getQuestionCount(test: Test) {
  return test.type === 'static'
    ? test.questionIds.length
    : test.rules.reduce((s, r) => s + r.questionCount, 0);
}

function getPrice(count: number) {
  if (count <= 20) return 1000;
  if (count <= 40) return 1500;
  return 2000;
}

function getEmoji(tags: string[]) {
  const t = tags.join(' ').toLowerCase();
  if (t.includes('physics'))   return '⚛️';
  if (t.includes('chemistry')) return '🧪';
  if (t.includes('math'))      return '📐';
  if (t.includes('ict') || t.includes('computer')) return '💻';
  if (t.includes('english'))   return '📝';
  if (t.includes('biology'))   return '🌿';
  return '📋';
}

async function fetchLandingTests(): Promise<Test[]> {
  const { data, error } = await supabase
    .from('tests')
    .select('*, test_questions(question_id, sort_order), test_dynamic_rules(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error || !data) return [];

  return data.map((row: any) => {
    const base = {
      id: row.id, title: row.title, description: row.description ?? '',
      timeLimit: row.time_limit, passingScore: row.passing_score,
      isActive: row.is_active, tags: row.tags ?? [],
      coverImage: row.cover_image ?? '', createdAt: new Date(row.created_at),
      estimatedDuration: row.estimated_duration,
    };
    if (row.type === 'static') return { ...base, type: 'static' as const, questionIds: (row.test_questions ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((q: any) => q.question_id) };
    return { ...base, type: 'dynamic' as const, rules: (row.test_dynamic_rules ?? []).map((r: any) => ({ moduleId: r.module_id, questionCount: r.question_count, difficulty: r.difficulty })) };
  });
}

export async function IndividualTestsSection() {
  const tests = await fetchLandingTests();

  return (
    <section id="tests" style={{ padding: '84px 0', background: 'var(--p-bg)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 44, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
              <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />
              Test marketplace
            </div>
            <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 680, color: 'var(--p-ink)', marginBottom: 14 }}>
              No subscription? Buy a <span style={{ color: 'var(--p-primary)' }}>single test</span> and keep it forever.
            </h2>
            <p style={{ color: 'var(--p-ink-2)', fontSize: 16, maxWidth: 560, lineHeight: 1.65 }}>
              Past papers, model tests and subject packs — from Rs.&nbsp;1,000. Yours permanently, AI feedback included.
            </p>
          </div>
          <Link href="/marketplace" style={btnGhost}>View all tests →</Link>
        </div>

        {tests.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--p-muted)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontSize: 15 }}>
            No tests available yet. Check back soon.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="tests-grid">
            {tests.map((t, i) => {
              const qCount   = getQuestionCount(t);
              const price    = getPrice(qCount);
              const { bg, ink } = TINTS[i % TINTS.length];
              const emoji    = getEmoji(t.tags ?? []);
              const subject  = t.tags?.[0] ?? 'General';

              return (
                <div key={t.id} className="test-card-hover" style={{ border: '1px solid var(--p-line)', borderRadius: 20, background: '#fff', boxShadow: 'var(--p-shadow-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform .15s, box-shadow .15s' }}>

                  {/* Tinted band */}
                  <div style={{ background: bg, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 13, background: '#fff', display: 'grid', placeItems: 'center', fontSize: 22, boxShadow: 'var(--p-shadow-sm)' }}>{emoji}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, color: ink }}>{subject}</div>
                        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: ink, opacity: 0.8, marginTop: 2 }}>
                          {t.type === 'dynamic' ? 'AI adaptive' : 'Fixed paper'}
                        </div>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, background: 'rgba(255,255,255,0.7)', color: ink }}>
                      {t.type === 'dynamic' ? 'Adaptive' : 'Fixed'}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 18, color: 'var(--p-ink)', marginBottom: 12, lineHeight: 1.3 }}>{t.title}</h3>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                      {[['📋', `${qCount} questions`], ['⏱', `${t.timeLimit} min`]].map(([icon, label]) => (
                        <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 12, color: 'var(--p-muted)' }}>
                          <span>{icon}</span>{label}
                        </div>
                      ))}
                    </div>
                    {t.tags && t.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                        {t.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{ display: 'inline-flex', padding: '3px 11px', borderRadius: 999, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11, background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '14px 20px', borderTop: '1px solid var(--p-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, color: 'var(--p-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>Rs. {price.toLocaleString()}</div>
                      <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 11, color: 'var(--p-muted)', marginTop: 3 }}>one-time · keep forever</div>
                    </div>
                    <Link href={`/marketplace?testId=${t.id}`} style={{ padding: '11px 18px', border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none', display: 'inline-block' }}>
                      Buy now →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 36, padding: '24px 32px', border: '1px solid var(--p-line)', borderRadius: 20, background: 'var(--p-bg-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 18, color: 'var(--p-ink)' }}>Need the full library?</div>
            <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 600, fontSize: 13, color: 'var(--p-muted)', marginTop: 4 }}>Scholar plan gives you unlimited access for Rs. 1,490/month</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#pricing" style={btnGhost}>See plans</a>
            <Link href="/auth/signup" style={btnPrimary}>Start free →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .test-card-hover:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-lg); }
        @media (max-width: 960px) { .tests-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .tests-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

const btnPrimary: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: 'none', borderRadius: 12, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none' };
const btnGhost: React.CSSProperties  = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '1.5px solid var(--p-line-2)', borderRadius: 12, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none', whiteSpace: 'nowrap' };

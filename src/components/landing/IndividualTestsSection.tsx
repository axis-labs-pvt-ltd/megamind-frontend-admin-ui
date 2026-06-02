// Server Component - Individual tests section (fetches real tests from Supabase)
import { supabase } from '@/lib/supabase';
import { Test } from '@/types';
import Link from 'next/link';

const BAND_COLORS = ['var(--p-card-a)', 'var(--p-card-c)', 'var(--p-card-d)', 'var(--p-card-e)', 'var(--p-card-b)'];
const DIFF_COLOR: Record<string, string> = { easy: 'var(--p-card-d)', medium: 'var(--p-card-a)', hard: 'var(--p-card-b)' };

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
  if (t.includes('physics'))     return '⚛️';
  if (t.includes('chemistry'))   return '🧪';
  if (t.includes('math'))        return '📐';
  if (t.includes('ict') || t.includes('computer')) return '💻';
  if (t.includes('english'))     return '📝';
  if (t.includes('biology'))     return '🌿';
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
              No subscription? Buy a <span style={{ color: 'var(--p-primary)' }}>single test</span> and keep it forever.
            </h2>
            <p style={{ marginTop: 16, color: 'var(--p-ink-2)', fontSize: 16, maxWidth: 560 }}>
              Past papers, model tests and subject packs — from Rs.&nbsp;1,000. Yours permanently, AI feedback included.
            </p>
          </div>
          <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            View all tests →
          </Link>
        </div>

        {/* Cards */}
        {tests.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--p-muted)', fontFamily: 'var(--font-mono,monospace)', fontSize: 13 }}>
            No tests available yet. Check back soon.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="tests-grid">
            {tests.map((t, i) => {
              const qCount = getQuestionCount(t);
              const price  = getPrice(qCount);
              const color  = BAND_COLORS[i % BAND_COLORS.length];
              const emoji  = getEmoji(t.tags ?? []);
              const subject = t.tags?.[0] ?? 'General';

              return (
                <div key={t.id} style={{ border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                  {/* Coloured band */}
                  <div style={{ background: color, borderBottom: '2px solid var(--p-ink)', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--p-bg)', border: '2px solid var(--p-ink)', display: 'grid', placeItems: 'center', fontSize: 22, transform: 'rotate(-5deg)' }}>
                        {emoji}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, color: 'var(--p-ink)' }}>{subject}</div>
                        <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--p-ink-2)', marginTop: 2 }}>
                          {t.type === 'dynamic' ? 'AI adaptive' : 'Fixed paper'}
                        </div>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, fontWeight: 600, background: DIFF_COLOR.medium, color: 'var(--p-ink)' }}>
                      {t.type === 'dynamic' ? 'Adaptive' : 'Fixed'}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 18, color: 'var(--p-ink)', marginBottom: 12 }}>{t.title}</h3>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                      {[['📋', `${qCount} questions`], ['⏱', `${t.timeLimit} min`]].map(([icon, label]) => (
                        <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono,monospace)', fontSize: 11, color: 'var(--p-muted)' }}>
                          <span>{icon}</span>{label}
                        </div>
                      ))}
                    </div>
                    {t.tags && t.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                        {t.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', border: '1.5px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: 'var(--p-bg-alt)', color: 'var(--p-ink-2)' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '14px 20px', borderTop: '2px dashed var(--p-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, color: 'var(--p-ink)', letterSpacing: '-0.02em' }}>Rs. {price.toLocaleString()}</div>
                      <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 10, color: 'var(--p-muted)', marginTop: 2 }}>one-time · keep forever</div>
                    </div>
                    <Link href={`/marketplace?testId=${t.id}`} style={{ padding: '11px 18px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none', display: 'inline-block' }}>
                      Buy now →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 40, padding: '24px 32px', border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: 'var(--p-ink)' }}>Need the full library?</div>
            <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginTop: 4 }}>Scholar plan gives you unlimited access for Rs. 1,490/month</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none' }}>See plans</a>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 14, boxShadow: '3px 3px 0 var(--p-ink)', textDecoration: 'none' }}>Start free →</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) { .tests-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .tests-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

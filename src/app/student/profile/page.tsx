'use client';

import { useAuth } from '@/contexts/authcontext';
import { useMyPurchases, useSessionDetails, useStudentAttempts } from '@/hooks/queries/usePurchases';
import { QuizResultScreen } from '@/app/tests/take-test/components/QuizResultScreen';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { TestHistory } from '@/types';
import { KpiStrip } from './components/KpiStrip';
import { PerformancePanel } from './components/PerformancePanel';
import { RecentActivity } from './components/RecentActivity';
import { FlashcardDecks } from './components/FlashcardDecks';
import { ProfileSettings } from './components/ProfileSettings';

type Tab = 'overview' | 'performance' | 'purchases' | 'settings';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',    label: 'Overview' },
  { id: 'performance', label: 'Performance' },
  { id: 'purchases',   label: 'Purchases' },
  { id: 'settings',    label: 'Settings' },
];

function ProfileContent() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [viewing, setViewing] = useState<TestHistory | null>(null);

  const { data: purchases = [], isLoading: purchLoading } = useMyPurchases();
  const { data: history = [],   isLoading: histLoading  } = useStudentAttempts(user?.id);
  const { data: sessionDetails, isLoading: detailsLoading } = useSessionDetails(viewing?.id ?? null);

  useEffect(() => { if (!authLoading && !user) router.push('/auth/signin'); }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const loading  = purchLoading || histLoading;
  const scores   = history.map((a: any) => a.score ?? 0);
  const avgScore = scores.length ? Math.round(scores.reduce((s: number, v: number) => s + v, 0) / scores.length) : 0;
  const xp       = history.reduce((s: number, a: any) => s + (a.correctAnswers ?? 0) * 15, 0);
  const initials = (profile?.full_name || user.email || '?').slice(0, 2).toUpperCase();
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  if (viewing) {
    if (detailsLoading) return <div style={{ minHeight: '100vh', background: 'var(--p-bg-alt)', display: 'grid', placeItems: 'center' }}><div style={{ fontSize: 48 }}>⏳</div></div>;
    if (sessionDetails) return (
      <QuizResultScreen
        test={{ id: '', title: viewing.testTitle, type: 'static', questionIds: [], timeLimit: 0, passingScore: viewing.passingScore, isActive: true, createdAt: new Date(), description: '' }}
        result={{ score: viewing.score, correctAnswers: viewing.correctAnswers, totalQuestions: viewing.totalQuestions, timeSpent: viewing.timeSpent }}
        questions={sessionDetails.questions} answers={sessionDetails.answers}
        onRetake={() => setViewing(null)} onBack={() => setViewing(null)} />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg-alt)' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(160%) blur(10px)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '13px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 17, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
            megamind
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/marketplace" style={ghostNavBtn}>Tests</Link>
            <Link href="/flashcards"  style={ghostNavBtn}>Flashcards</Link>
          </div>
        </div>
      </nav>

      {/* Hero — page-hero style */}
      <section style={{ background: 'var(--p-bg-alt)', borderBottom: '1px solid var(--p-line)', padding: '44px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-muted)', marginBottom: 24, display: 'flex', gap: 6 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span><span>My profile</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 28, alignItems: 'center' }} className="prof-hero">
            {/* Avatar */}
            <div style={{ width: 104, height: 104, borderRadius: 999, background: 'var(--p-peach)', color: 'var(--p-ink-peach)', boxShadow: 'var(--p-shadow)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 40, flexShrink: 0, overflow: 'hidden' }}>
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 999 }} /> : initials}
            </div>
            {/* Identity */}
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: 999, background: 'var(--p-primary-soft)', color: 'var(--p-primary-dark)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--p-primary)' }} />{profile?.role ?? 'student'}
                </span>
                <span style={{ padding: '4px 12px', borderRadius: 999, background: 'var(--p-bg)', border: '1px solid var(--p-line-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 11 }}>🔥 {history.length} tests done</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(30px,4vw,52px)', letterSpacing: '-0.015em', color: 'var(--p-ink)', lineHeight: 1.08, marginBottom: 10 }}>
                {profile?.full_name || 'Student'}
              </h1>
              <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: 14, fontWeight: 600, color: 'var(--p-muted)' }}>
                <span>{user.email}</span>
                <span>Joined {joinedDate}</span>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button onClick={() => setTab('settings')} style={ghostBtn}>⚙ Settings</button>
              <button onClick={async () => { await logout(); router.push('/'); }} style={primaryBtn}>Sign out</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: '50px 0 100px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--p-line)', marginBottom: 36, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '12px 20px', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, color: tab === t.id ? 'var(--p-primary)' : 'var(--p-ink-2)', cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: tab === t.id ? '3px solid var(--p-primary)' : '3px solid transparent', marginBottom: -1, transition: 'color .15s' }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && <>
            <KpiStrip quizzes={history.length} avgScore={avgScore} xp={xp} testsOwned={purchases.length} loading={loading} />
            <PerformancePanel attempts={history as any} loading={histLoading} />
            {/* AI insight */}
            <div style={{ padding: 30, borderRadius: 20, background: 'linear-gradient(150deg,var(--p-hero-a),var(--p-hero-b) 55%,var(--p-hero-c))', color: '#fff', boxShadow: 'var(--p-shadow-orange)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center', marginBottom: 40 }} className="ai-row">
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: '#fff' }} />AI TUTOR WEEKLY NOTE
                </span>
                <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 22, marginBottom: 10, lineHeight: 1.2, color: '#fff' }}>
                  {avgScore >= 80 ? "You're on a great streak — keep pushing harder topics." : avgScore >= 60 ? "Good progress — target your weak topics with focused practice." : "Let's build momentum — short daily sessions make a big difference."}
                </h3>
                <p style={{ opacity: 0.9, maxWidth: 720, fontSize: 14, lineHeight: 1.6 }}>
                  Your average score is <strong>{avgScore}%</strong> across {history.length} tests. {history.length > 0 ? 'Keep up the consistency and aim for 2–3 tests per week.' : 'Start with a short test to build your performance profile.'}
                </p>
              </div>
              <Link href="/marketplace" style={{ padding: '13px 22px', border: 'none', borderRadius: 12, background: '#fff', color: 'var(--p-primary)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: 'var(--p-shadow-sm)', flexShrink: 0 }}>
                Start practice →
              </Link>
            </div>
            <RecentActivity history={history as any} purchases={purchases} loading={loading} onReview={setViewing} />
            <FlashcardDecks />
          </>}

          {tab === 'performance' && <PerformancePanel attempts={history as any} loading={histLoading} />}
          {tab === 'purchases'   && <RecentActivity history={history as any} purchases={purchases} loading={loading} onReview={setViewing} />}
          {tab === 'settings'    && <ProfileSettings userId={user.id} email={user.email ?? ''} initialName={profile?.full_name ?? ''} initialPhone={profile?.phone ?? ''} initialAddress={profile?.address ?? ''} />}
        </div>
      </section>

      <style>{`
        @media(max-width:960px){ .prof-hero{grid-template-columns:1fr!important;} .ai-row{grid-template-columns:1fr!important;} }
        @media(max-width:600px){
          .prof-hero-section { padding: 28px 0 !important; }
        }
      `}</style>
    </div>
  );
}

export default function StudentProfilePage() {
  return <Suspense><ProfileContent /></Suspense>;
}

const ghostNavBtn: React.CSSProperties = { padding: '9px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, boxShadow: 'var(--p-shadow-sm)', textDecoration: 'none' };
const ghostBtn: React.CSSProperties   = { padding: '9px 16px', border: '1.5px solid var(--p-line-2)', borderRadius: 10, background: '#fff', color: 'var(--p-ink-2)', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, boxShadow: 'var(--p-shadow-sm)', cursor: 'pointer' };
const primaryBtn: React.CSSProperties = { padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, boxShadow: 'var(--p-shadow-orange)', cursor: 'pointer' };

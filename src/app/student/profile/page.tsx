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

  // Full-screen result review overlay
  if (viewing) {
    if (detailsLoading) return <div style={{ minHeight: '100vh', background: 'var(--p-bg)', display: 'grid', placeItems: 'center' }}><div style={{ fontSize: 48 }}>⏳</div></div>;
    if (sessionDetails) return (
      <QuizResultScreen
        test={{ id: '', title: viewing.testTitle, type: 'static', questionIds: [], timeLimit: 0, passingScore: viewing.passingScore, isActive: true, createdAt: new Date(), description: '' }}
        result={{ score: viewing.score, correctAnswers: viewing.correctAnswers, totalQuestions: viewing.totalQuestions, timeSpent: viewing.timeSpent }}
        questions={sessionDetails.questions} answers={sessionDetails.answers}
        onRetake={() => setViewing(null)} onBack={() => setViewing(null)} />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg)' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '13px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', border: '2px solid var(--p-ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--p-primary-ink)', fontSize: 18, fontWeight: 700, transform: 'rotate(-8deg)', fontFamily: 'var(--font-display,sans-serif)' }}>M</span>
            <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>megamind<span style={{ color: 'var(--p-primary)' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/marketplace" style={ghostBtn}>Tests</Link>
            <Link href="/flashcards"  style={ghostBtn}>Flashcards</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="prof-hero-section" style={{ background: 'var(--p-bg)', borderBottom: '2px solid var(--p-ink)', padding: '44px 0' }}>
        <div className="prof-hero-inner" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12, color: 'var(--p-muted)', marginBottom: 24, display: 'flex', gap: 6 }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link> / <span>My profile</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 28, alignItems: 'center' }} className="prof-hero">
            {/* Avatar */}
            <div style={{ width: 110, height: 110, borderRadius: 999, background: 'var(--p-card-a)', border: '2px solid var(--p-ink)', boxShadow: '6px 6px 0 var(--p-ink)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 44, transform: 'rotate(-4deg)', color: 'var(--p-ink)', flexShrink: 0, overflow: 'hidden' }}>
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 999 }} /> : initials}
            </div>
            {/* Identity */}
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-secondary)', fontFamily: 'var(--font-mono,monospace)', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--p-primary)' }} />{profile?.role ?? 'student'}
                </span>
                <span style={{ padding: '4px 12px', border: '2px solid var(--p-ink)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 11 }}>🔥 {history.length} tests done</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 'clamp(30px,4vw,56px)', letterSpacing: '-0.02em', color: 'var(--p-ink)', lineHeight: 1.05, marginBottom: 10 }}>
                {profile?.full_name || 'Student'}
              </h1>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', color: 'var(--p-ink-2)', fontSize: 14 }}>
                <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12 }}>{user.email}</span>
                <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: 12 }}>Joined {joinedDate}</span>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button onClick={() => setTab('settings')} style={ghostBtn}>⚙ Settings</button>
              <button onClick={async () => { await logout(); router.push('/'); }} style={{ ...ghostBtn, background: 'var(--p-ink)', color: 'var(--p-bg)', boxShadow: '2px 2px 0 var(--p-ink-2)' }}>Sign out</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="prof-main-section" style={{ padding: '50px 0 100px' }}>
        <div className="prof-main-inner" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--p-ink)', marginBottom: 36, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '12px 20px', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 15, color: tab === t.id ? 'var(--p-ink)' : 'var(--p-ink-2)', cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: tab === t.id ? '3px solid var(--p-primary)' : '3px solid transparent', marginBottom: -2 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && <>
            <KpiStrip quizzes={history.length} avgScore={avgScore} xp={xp} testsOwned={purchases.length} loading={loading} />
            <PerformancePanel attempts={history as any} loading={histLoading} />
            {/* AI insight */}
            <div style={{ padding: 28, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-ink)', color: 'var(--p-bg)', boxShadow: '5px 5px 0 rgba(0,0,0,0.3)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center', marginBottom: 40, flexWrap: 'wrap' }} className="ai-row">
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', border: '1.5px solid var(--p-bg)', borderRadius: 999, fontFamily: 'var(--font-mono,monospace)', fontSize: 10, background: 'var(--p-accent,#6D28D9)', color: '#fff', marginBottom: 14, fontWeight: 700 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: '#fff' }} />AI TUTOR WEEKLY NOTE
                </span>
                <h3 style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 22, marginBottom: 10, lineHeight: 1.2 }}>
                  {avgScore >= 80 ? "You're on a great streak — keep pushing harder topics." : avgScore >= 60 ? "Good progress — target your weak topics with focused practice." : "Let's build momentum — short daily sessions make a big difference."}
                </h3>
                <p style={{ opacity: 0.85, maxWidth: 720, fontSize: 14, lineHeight: 1.6 }}>
                  Your average score is <strong>{avgScore}%</strong> across {history.length} tests. {history.length > 0 ? 'Keep up the consistency and aim for 2–3 tests per week.' : 'Start with a short test to build your performance profile.'}
                </p>
              </div>
              <Link href="/marketplace" style={{ padding: '13px 22px', border: '2px solid var(--p-bg)', borderRadius: 999, background: 'var(--p-secondary)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '3px 3px 0 rgba(0,0,0,0.3)', flexShrink: 0 }}>
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
          .prof-hero-inner { padding: 0 14px !important; }
          .prof-main-inner { padding: 0 14px !important; }
          .prof-main-section { padding: 28px 0 60px !important; }
          .prof-h1 { font-size: clamp(24px,7vw,44px) !important; }
        }
      `}</style>
    </div>
  );
}

export default function StudentProfilePage() {
  return <Suspense><ProfileContent /></Suspense>;
}

const ghostBtn: React.CSSProperties = { padding: '9px 16px', border: '2px solid var(--p-ink)', borderRadius: 999, background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 600, fontSize: 13, boxShadow: '2px 2px 0 var(--p-ink)', textDecoration: 'none', cursor: 'pointer' };

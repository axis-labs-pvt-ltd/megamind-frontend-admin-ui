// Client Component - Student module page: videos + related tests
'use client';

import { useAuth } from '@/contexts/authcontext';
import { useModuleVideos } from '@/hooks/queries/useModuleVideos';
import { useSubjectById } from '@/hooks/queries/useSubjects';
import { useActiveTests } from '@/hooks/queries/useTests';
import { VideoPlayerModal } from '@/components/ui/VideoPlayer';
import { ModuleVideo } from '@/services/api/moduleVideos';
import { Test } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const TINTS = [
  { bg: 'var(--p-blue)',   ink: 'var(--p-ink-blue)' },
  { bg: 'var(--p-peach)',  ink: 'var(--p-ink-peach)' },
  { bg: 'var(--p-mint)',   ink: 'var(--p-ink-mint)' },
  { bg: 'var(--p-lav)',    ink: 'var(--p-ink-lav)' },
  { bg: 'var(--p-yellow)', ink: 'var(--p-ink-yellow)' },
  { bg: 'var(--p-pink)',   ink: 'var(--p-ink-pink)' },
];

function formatDuration(sec: number | null): string {
  if (!sec) return '';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function VideoThumbnailCard({ video, index, onClick }: { video: ModuleVideo; index: number; onClick: () => void }) {
  const { bg, ink } = TINTS[index % TINTS.length];
  return (
    <button onClick={onClick} className="vid-card" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--p-line)', borderRadius: 18, background: '#fff', boxShadow: 'var(--p-shadow-sm)', overflow: 'hidden', textAlign: 'left', cursor: 'pointer', width: '100%', padding: 0 }}>
      {/* Thumbnail area */}
      <div style={{ position: 'relative', background: bg, height: 148, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Play button */}
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 18px rgba(0,0,0,0.18)', transition: 'transform .15s' }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill={ink} style={{ marginLeft: 3 }}><path d="M5 3l14 9-14 9V3z"/></svg>
        </div>
        {/* Duration badge */}
        {video.durationSeconds && (
          <span style={{ position: 'absolute', bottom: 8, right: 10, background: 'rgba(0,0,0,0.65)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>
            {formatDuration(video.durationSeconds)}
          </span>
        )}
        {/* Index badge */}
        <span style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(255,255,255,0.85)', color: ink, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 11, padding: '3px 9px', borderRadius: 20 }}>
          #{index + 1}
        </span>
      </div>
      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 15, lineHeight: 1.35, color: 'var(--p-ink)', marginBottom: 6 }}>{video.title}</h3>
        {video.description && (
          <p style={{ fontSize: 12.5, color: 'var(--p-muted)', lineHeight: 1.5 }}>
            {video.description.slice(0, 80)}{video.description.length > 80 ? '…' : ''}
          </p>
        )}
      </div>
    </button>
  );
}

function TestCard({ t, i }: { t: Test; i: number }) {
  const { bg, ink } = TINTS[i % TINTS.length];
  const qCount = t.type === 'static' ? t.questionIds.length : t.rules.reduce((s, r) => s + r.questionCount, 0);
  const price = qCount <= 20 ? 1000 : qCount <= 40 ? 1500 : 2000;
  return (
    <div style={{ border: '1px solid var(--p-line)', borderRadius: 18, background: '#fff', boxShadow: 'var(--p-shadow-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: bg, padding: '13px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: ink }}>{t.type === 'dynamic' ? 'AI Adaptive' : 'Fixed paper'}</span>
        <span style={{ background: 'rgba(255,255,255,0.8)', color: ink, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 10, padding: '3px 9px', borderRadius: 999 }}>{t.timeLimit} min</span>
      </div>
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 16, lineHeight: 1.3, marginBottom: 8, color: 'var(--p-ink)' }}>{t.title}</h3>
        <div style={{ fontSize: 12.5, color: 'var(--p-muted)', marginBottom: 14 }}>📋 {qCount} questions</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--p-line)', paddingTop: 14 }}>
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 19, color: 'var(--p-ink)' }}>Rs. {price.toLocaleString()}</div>
          <Link href={`/marketplace?testId=${t.id}`} style={{ padding: '9px 16px', border: 'none', borderRadius: 10, background: 'var(--p-primary)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 12, boxShadow: 'var(--p-shadow-orange)', textDecoration: 'none' }}>Buy →</Link>
        </div>
      </div>
    </div>
  );
}

export default function ModulePage() {
  const { subjectId, moduleId } = useParams<{ subjectId: string; moduleId: string }>();
  const { user } = useAuth();
  const { data: subject, isLoading: subjectLoading } = useSubjectById(subjectId);
  const { data: videos = [], isLoading: videosLoading } = useModuleVideos(moduleId);
  const { data: allTests = [] } = useActiveTests();
  const [playing, setPlaying] = useState<ModuleVideo | null>(null);

  const module = subject?.modules.find(m => m.id === moduleId);
  const moduleIndex = subject?.modules.findIndex(m => m.id === moduleId) ?? 0;
  const { bg: moduleBg, ink: moduleInk } = TINTS[moduleIndex % TINTS.length];

  const relatedTests = useMemo(
    () => allTests.filter(t => (t.tags ?? []).some(tag => tag.toLowerCase() === subject?.name.toLowerCase())).slice(0, 6),
    [allTests, subject?.name]
  );

  if (subjectLoading) return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', color: 'var(--p-muted)' }}>Loading…</div>
  );

  if (!subject || !module) return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg)', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
        <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 18, color: 'var(--p-ink)', marginBottom: 12 }}>Module not found</div>
        <Link href={`/subjects/${subjectId}`} style={{ color: 'var(--p-primary)', fontWeight: 700, textDecoration: 'none' }}>← Back to {subject?.name ?? 'subject'}</Link>
      </div>
    </div>
  );

  const num = String(moduleIndex + 1).padStart(2, '0');
  const qCount = subject.questionCounts[moduleId] ?? 0;

  return (
    <div style={{ background: 'var(--p-bg)', minHeight: '100vh' }}>

      {/* Sticky nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(160%) blur(10px)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--p-ink)' }}>
            <span style={{ width: 32, height: 32, background: 'var(--p-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 17, fontWeight: 900, boxShadow: 'var(--p-shadow-orange)' }}>M</span>
            megamind
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            {user ? (
              <><Link href="/my-tests" style={ghostBtn}>My Tests</Link><Link href="/student/profile" style={primaryBtn}>Profile →</Link></>
            ) : (
              <><Link href="/auth/signin" style={ghostBtn}>Log in</Link><Link href="/auth/signup" style={primaryBtn}>Start free →</Link></>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '44px 0 50px', background: 'var(--p-bg-alt)', borderBottom: '1px solid var(--p-line)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          {/* Breadcrumbs */}
          <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 13, color: 'var(--p-muted)', marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href={`/subjects/${subjectId}`} style={{ color: 'var(--p-primary)', textDecoration: 'none' }}>{subject.name}</Link>
            <span>/</span>
            <span>{module.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ width: 58, height: 58, borderRadius: 15, background: moduleBg, color: moduleInk, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 20, flexShrink: 0, boxShadow: 'var(--p-shadow-sm)' }}>{num}</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(26px,4vw,44px)', letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--p-ink)', marginBottom: 10 }}>
                {module.name}
              </h1>
              {module.description && (
                <p style={{ fontSize: 'clamp(14px,1.1vw,17px)', color: 'var(--p-ink-2)', lineHeight: 1.65, maxWidth: 640, marginBottom: 18 }}>
                  {module.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  [`${videos.length}`, 'Videos'],
                  [qCount > 0 ? String(qCount) : '—', 'Questions'],
                  ['0%', 'Progress'],
                ].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 900, fontSize: 26, color: lbl === 'Progress' ? 'var(--p-primary)' : 'var(--p-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--p-muted)', marginTop: 4 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos section */}
      <section style={{ padding: '52px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
                <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Lecture videos
              </div>
              <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(22px,2.8vw,34px)', letterSpacing: '-0.015em', color: 'var(--p-ink)', margin: 0 }}>
                {videos.length} video{videos.length !== 1 ? 's' : ''}
              </h2>
            </div>
          </div>

          {videosLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="vid-grid">
              {[1,2,3].map(i => <div key={i} style={{ height: 220, borderRadius: 18, background: 'var(--p-bg-alt)', animation: 'sk-pulse 1.6s ease-in-out infinite' }} />)}
            </div>
          ) : videos.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center', border: '2px dashed var(--p-line-2)', borderRadius: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
              <div style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 18, color: 'var(--p-ink)', marginBottom: 8 }}>Videos coming soon</div>
              <div style={{ fontSize: 14, color: 'var(--p-muted)' }}>Lecture videos for this module will be added shortly.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="vid-grid">
              {videos.map((v, i) => (
                <VideoThumbnailCard key={v.id} video={v} index={i} onClick={() => setPlaying(v)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related tests */}
      {relatedTests.length > 0 && (
        <section style={{ padding: '0 0 60px', borderTop: '1px solid var(--p-line)', background: 'var(--p-bg-alt)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '52px 28px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-primary)' }}>
                  <span style={{ width: 18, height: 3, borderRadius: 3, background: 'var(--p-primary)' }} />Practice tests
                </div>
                <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(22px,2.8vw,34px)', letterSpacing: '-0.015em', color: 'var(--p-ink)', margin: 0 }}>
                  {subject.name} test papers
                </h2>
              </div>
              <Link href={`/marketplace?subject=${encodeURIComponent(subject.name)}`} style={ghostBtn}>Browse all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="tests-grid">
              {relatedTests.map((t, i) => <TestCard key={t.id} t={t} i={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Sign-up CTA */}
      {!user && (
        <section style={{ padding: '52px 28px', background: 'var(--p-bg-warm)', borderTop: '1px solid var(--p-line)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 800, fontSize: 'clamp(20px,3vw,30px)', color: 'var(--p-ink)', marginBottom: 10 }}>
            Track your progress in {subject.name}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--p-ink-2)', marginBottom: 22, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 22px' }}>
            Create a free account to bookmark videos, track completion and get AI feedback on practice tests.
          </p>
          <Link href="/auth/signup" style={{ ...primaryBtn, fontSize: 15, padding: '13px 26px' }}>Start for free →</Link>
        </section>
      )}

      {/* Video player modal */}
      {playing && (
        <VideoPlayerModal
          isOpen
          s3Key={playing.s3Key}
          title={playing.title}
          onClose={() => setPlaying(null)}
        />
      )}

      <style>{`
        .vid-card:hover .vid-card-play { transform: scale(1.1); }
        .vid-card { transition: transform .15s, box-shadow .15s; }
        .vid-card:hover { transform: translateY(-4px); box-shadow: var(--p-shadow-lg); }
        @keyframes sk-pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @media (max-width:960px) { .vid-grid,.tests-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media (max-width:560px) { .vid-grid,.tests-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}

const ghostBtn: React.CSSProperties   = { display:'inline-flex', alignItems:'center', gap:8, padding:'9px 16px', border:'1.5px solid var(--p-line-2)', borderRadius:10, background:'#fff', color:'var(--p-ink-2)', fontFamily:'var(--font-display,Nunito,sans-serif)', fontWeight:700, fontSize:13, boxShadow:'var(--p-shadow-sm)', textDecoration:'none' };
const primaryBtn: React.CSSProperties = { display:'inline-flex', alignItems:'center', gap:8, padding:'9px 16px', border:'none', borderRadius:10, background:'var(--p-primary)', color:'#fff', fontFamily:'var(--font-display,Nunito,sans-serif)', fontWeight:800, fontSize:13, boxShadow:'var(--p-shadow-orange)', textDecoration:'none' };

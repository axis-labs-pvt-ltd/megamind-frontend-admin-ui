// Sub-components for TestCard
import { Test } from '@/types';
import { Clock, Edit, FileText, Play, Settings, Users } from 'lucide-react';

const clampStyle: React.CSSProperties = { overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' };

export const getDifficultyLevel = (test: Test) => {
  const q = test.type === 'static' ? test.questionIds.length : test.rules.reduce((s, r) => s + r.questionCount, 0);
  if (q <= 5) return 'Beginner';
  if (q <= 15) return 'Intermediate';
  return 'Advanced';
};

export const getQuestionCount = (test: Test) =>
  test.type === 'static' ? test.questionIds.length : test.rules.reduce((s, r) => s + r.questionCount, 0);

const diffBadge: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: 'var(--accent-green)', color: '#fff' },
  Intermediate: { bg: 'var(--accent-yellow)', color: '#1a1a1a' },
  Advanced:     { bg: 'var(--accent-red)', color: '#fff' },
};

const typeColor: Record<string, string> = {
  static:  'var(--accent-blue)',
  dynamic: 'var(--accent-purple)',
};

interface ActionProps { onConfigure?: () => void; onEdit?: () => void; }

/* ── Cover image variant ── */
export const TestCardCover = ({ test, onConfigure, onEdit }: { test: Test } & ActionProps) => (
  <div style={{ position: 'relative', height: 160, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
    <img src={test.coverImage} alt={test.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%)' }} />
    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
      <TypeBadge type={test.type} />
      <DiffBadge test={test} />
    </div>
    <HoverActions onConfigure={onConfigure} onEdit={onEdit} />
    <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', lineHeight: 1.2 }}>{test.title}</div>
      {test.description && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', marginTop: 4, ...clampStyle }}>{test.description}</div>}
    </div>
  </div>
);

/* ── No-cover header ── */
export const TestCardHeaderNoImage = ({ test, onConfigure, onEdit }: { test: Test } & ActionProps) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
        <TypeBadge type={test.type} />
        <DiffBadge test={test} />
      </div>
      <HoverActions onConfigure={onConfigure} onEdit={onEdit} />
    </div>
    <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 6 }}>{test.title}</div>
    {test.description && (
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, ...clampStyle }}>{test.description}</div>
    )}
  </div>
);

/* ── Stats row ── */
export const TestCardStats = ({ test, attemptCount = 0 }: { test: Test; attemptCount?: number }) => {
  const q = getQuestionCount(test);
  const items = [
    { icon: <FileText size={14} />, value: q,              label: 'Questions' },
    { icon: <Clock size={14} />,    value: test.timeLimit,  label: 'Minutes'  },
    { icon: <Users size={14} />,    value: attemptCount,    label: 'Attempts' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 8 }}>
      {items.map(it => (
        <div key={it.label} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' as const }}>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{it.icon}</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{it.value}</div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'var(--text-secondary)', marginTop: 1 }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ── Tags ── */
export const TestCardTags = ({ tags }: { tags?: string[] }) => {
  if (!tags?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
      {tags.slice(0, 4).map((tag, i) => (
        <span key={i} style={{ padding: '3px 10px', borderRadius: 999, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>
          #{tag}
        </span>
      ))}
      {tags.length > 4 && (
        <span style={{ padding: '3px 10px', borderRadius: 999, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-secondary)' }}>
          +{tags.length - 4}
        </span>
      )}
    </div>
  );
};

/* ── Passing score ── */
export const TestCardPassingScore = ({ passingScore }: { passingScore: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${passingScore}%`, background: 'var(--accent-blue)', borderRadius: 999 }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)', minWidth: 38, textAlign: 'right' as const }}>{passingScore}% pass</span>
  </div>
);

/* ── Actions ── */
export const TestCardActions = ({ test, onStart }: { test: Test; onStart?: () => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: test.isActive ? 'var(--accent-green)/10' : 'rgba(239,68,68,.1)',
      color: test.isActive ? 'var(--accent-green)' : 'var(--accent-red)',
      border: `1px solid ${test.isActive ? 'var(--accent-green)' : 'var(--accent-red)'}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: test.isActive ? 'var(--accent-green)' : 'var(--accent-red)', flexShrink: 0 }} />
      {test.isActive ? 'Active' : 'Inactive'}
    </span>
    <button
      onClick={e => { e.stopPropagation(); onStart?.(); }}
      disabled={!test.isActive}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 18px',
        borderRadius: 10,
        border: '1.5px solid var(--border-primary)',
        background: test.isActive ? 'var(--accent-blue)' : 'var(--bg-secondary)',
        color: test.isActive ? '#fff' : 'var(--text-secondary)',
        fontSize: 13, fontWeight: 600,
        cursor: test.isActive ? 'pointer' : 'not-allowed',
        opacity: test.isActive ? 1 : 0.6,
        transition: 'opacity .15s',
      }}
    >
      <Play size={13} fill="currentColor" />
      Start
    </button>
  </div>
);

/* ── Internal helpers ── */
function TypeBadge({ type }: { type: string }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: typeColor[type] || 'var(--accent-blue)', color: '#fff', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
      {type}
    </span>
  );
}

function DiffBadge({ test }: { test: Test }) {
  const level = getDifficultyLevel(test);
  const { bg, color } = diffBadge[level] ?? diffBadge.Beginner;
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: bg, color, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
      {level}
    </span>
  );
}

function HoverActions({ onConfigure, onEdit }: ActionProps) {
  if (!onConfigure && !onEdit) return null;
  return (
    <div className="group-hover-actions" style={{ display: 'flex', gap: 4 }}>
      {onConfigure && (
        <button onClick={e => { e.stopPropagation(); onConfigure(); }} style={iconBtn}>
          <Settings size={13} />
        </button>
      )}
      {onEdit && (
        <button onClick={e => { e.stopPropagation(); onEdit(); }} style={iconBtn}>
          <Edit size={13} />
        </button>
      )}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 8,
  border: '1.5px solid var(--border-primary)',
  background: 'var(--bg-card)',
  color: 'var(--text-secondary)',
  cursor: 'pointer', display: 'grid', placeItems: 'center',
};

// Client Component - Test card (marketplace style)
'use client';

import { Test } from '@/types';
import React from 'react';
import { getQuestionCount } from './TestCard.components';

interface TestCardProps {
  test: Test;
  attemptCount?: number;
  onStart?: () => void;
  onEdit?: () => void;
  onConfigure?: () => void;
}

// Cycle through pastel bands so the grid looks colourful
const BAND_COLORS = [
  'var(--p-card-d)', // green
  'var(--p-card-c)', // blue
  'var(--p-card-a)', // amber
  'var(--p-card-b)', // pink
  'var(--p-card-e)', // purple
];

let _idx = 0;
const colorCache = new Map<string, string>();
function bandColor(id: string) {
  if (!colorCache.has(id)) colorCache.set(id, BAND_COLORS[_idx++ % BAND_COLORS.length]);
  return colorCache.get(id)!;
}

export const TestCard: React.FC<TestCardProps> = ({
  test, attemptCount = 0, onStart,
}) => {
  const qCount = getQuestionCount(test);
  const color  = bandColor(test.id);

  return (
    <div
      style={{
        border: '2px solid var(--border-primary)',
        borderRadius: 16,
        background: 'var(--bg-card)',
        boxShadow: '5px 5px 0 var(--border-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translate(-2px,-2px)';
        el.style.boxShadow = '7px 7px 0 var(--border-primary)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
        el.style.boxShadow = '5px 5px 0 var(--border-primary)';
      }}
    >
      {/* ── Coloured header band ── */}
      <div style={{
        background: color,
        padding: '14px 18px',
        borderBottom: '2px solid var(--border-primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {test.tags?.[0] ?? 'General'} · {test.type}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {test.type === 'dynamic' && (
            <span style={badgeStyle('var(--accent-purple)', '#fff')}>AI</span>
          )}
          <span style={badgeStyle('var(--bg-card)', 'var(--text-primary)')}>
            {test.passingScore}% pass
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>

        {/* Title */}
        <h3 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)', margin: 0 }}>
          {test.title}
        </h3>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>📋 {qCount} questions</span>
          <span>⏱ {test.timeLimit} min</span>
          <span>👥 {attemptCount} attempts</span>
        </div>

        {/* Tags */}
        {test.tags && test.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {test.tags.slice(0, 4).map((tag, i) => (
              <span key={i} style={{ padding: '3px 10px', borderRadius: 999, border: '1.5px solid var(--border-primary)', background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                #{tag}
              </span>
            ))}
            {test.tags.length > 4 && (
              <span style={{ padding: '3px 10px', borderRadius: 999, border: '1.5px solid var(--border-primary)', background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-secondary)' }}>
                +{test.tags.length - 4}
              </span>
            )}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* ── Dashed separator + action row ── */}
        <div style={{ borderTop: '1.5px dashed var(--border-primary)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 600,
            color: test.isActive ? 'var(--accent-green)' : 'var(--accent-red)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: test.isActive ? 'var(--accent-green)' : 'var(--accent-red)', flexShrink: 0 }} />
            {test.isActive ? 'Active' : 'Inactive'}
          </span>

          <button
            onClick={e => { e.stopPropagation(); onStart?.(); }}
            disabled={!test.isActive}
            style={{
              padding: '9px 18px',
              border: '2px solid var(--border-primary)',
              borderRadius: 999,
              background: test.isActive ? 'var(--accent-blue)' : 'var(--bg-secondary)',
              color: test.isActive ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 600,
              fontSize: 13,
              cursor: test.isActive ? 'pointer' : 'not-allowed',
              opacity: test.isActive ? 1 : 0.55,
              boxShadow: test.isActive ? '3px 3px 0 var(--border-primary)' : 'none',
            }}
          >
            ▶ Start →
          </button>
        </div>
      </div>
    </div>
  );
};

function badgeStyle(bg: string, color: string): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px',
    border: '1.5px solid var(--border-primary)',
    borderRadius: 999,
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: 10, fontWeight: 600,
    background: bg, color,
  };
}

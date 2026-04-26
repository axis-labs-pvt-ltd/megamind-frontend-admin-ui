// Client Component - Test card
'use client';

import { Test } from '@/types';
import React from 'react';
import {
  TestCardActions,
  TestCardCover,
  TestCardHeaderNoImage,
  TestCardPassingScore,
  TestCardStats,
  TestCardTags,
} from './TestCard.components';

interface TestCardProps {
  test: Test;
  attemptCount?: number;
  onStart?: () => void;
  onEdit?: () => void;
  onConfigure?: () => void;
  className?: string;
}

export const TestCard: React.FC<TestCardProps> = ({
  test, attemptCount = 0, onStart, onEdit, onConfigure,
}) => (
  <div
    className="group"
    style={{
      border: '1.5px solid var(--border-primary)',
      borderRadius: 14,
      background: 'var(--bg-card)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform .18s, box-shadow .18s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.1)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = '';
      (e.currentTarget as HTMLElement).style.boxShadow = '';
    }}
  >
    {test.coverImage && (
      <TestCardCover test={test} onConfigure={onConfigure} onEdit={onEdit} />
    )}

    <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
      {!test.coverImage && (
        <TestCardHeaderNoImage test={test} onConfigure={onConfigure} onEdit={onEdit} />
      )}
      <TestCardStats test={test} attemptCount={attemptCount} />
      <TestCardTags tags={test.tags} />
      <TestCardPassingScore passingScore={test.passingScore} />
      <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12, marginTop: 'auto' }}>
        <TestCardActions test={test} onStart={onStart} />
      </div>
    </div>
  </div>
);

'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Test } from '@/types';
import React from 'react';
import {
  TestCardActions,
  TestCardCover,
  TestCardHeaderNoImage,
  TestCardPassingScore,
  TestCardStats,
  TestCardTags
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
  test,
  attemptCount = 0,
  onStart,
  onEdit,
  onConfigure,
  className = '',
}) => {
  const handleStart = () => {
    onStart?.();
  };

  return (
    <Card className={cn(`group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-0 shadow-md overflow-hidden`, className)} hover>
      <div className="space-y-0">
        {/* Cover Image */}
        {test.coverImage && (
          <TestCardCover 
            test={test} 
            onConfigure={onConfigure} 
            onEdit={onEdit} 
          />
        )}

        {/* Content */}
        <div className="p-3 md:p-6 space-y-3 md:space-y-4">
          {/* Header (if no cover image) */}
          {!test.coverImage && (
            <TestCardHeaderNoImage 
              test={test}
              onConfigure={onConfigure}
              onEdit={onEdit}
            />
          )}

          {/* Stats Grid */}
          <TestCardStats test={test} attemptCount={attemptCount} />

          {/* Tags */}
          <TestCardTags tags={test.tags} />

          {/* Passing Score */}
          <TestCardPassingScore passingScore={test.passingScore} />

          {/* Status & Action */}
          <TestCardActions test={test} onStart={handleStart} />
        </div>
      </div>
    </Card>
  );
};

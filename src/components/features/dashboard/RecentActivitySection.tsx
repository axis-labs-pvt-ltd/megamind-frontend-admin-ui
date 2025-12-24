import React from 'react';
import { LearningGoals } from './LearningGoals';
import { RecentResults } from './RecentResults';

interface RecentActivitySectionProps {
  recentAttempts: Array<{
    testTitle: string;
    score: number;
    completedAt: Date;
  }>;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ recentAttempts }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Test Results */}
      <RecentResults attempts={recentAttempts} />

      {/* Learning Goals */}
      <LearningGoals />
    </div>
  );
};

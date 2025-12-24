
import React from 'react';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { DifficultyAnalysis } from './DifficultyAnalysis';
import { PerformanceCharts } from './PerformanceCharts';
import { PerformanceOverview } from './PerformanceOverview';
import { RecentActivitySection } from './RecentActivitySection';
import { useDashboardData } from './useDashboardData';

interface AdvancedDashboardStatsProps {
  stats: {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    totalTimeSpent: number;
    recentAttempts: Array<{
      testTitle: string;
      score: number;
      completedAt: Date;
    }>;
  };
}

export const AdvancedDashboardStats: React.FC<AdvancedDashboardStatsProps> = ({ stats }) => {
  // Get mock chart data
  const {
    performanceOverTime,
    subjectPerformance,
    difficultyBreakdown,
    weeklyActivity,
    monthlyProgress
  } = useDashboardData();

  return (
    <div className="space-y-8">
      {/* Key Performance Indicators */}
      <PerformanceOverview
        totalAttempts={stats.totalAttempts}
        averageScore={stats.averageScore}
        bestScore={stats.bestScore}
        totalTimeSpent={stats.totalTimeSpent}
      />

      {/* Advanced Analytics */}
      <AdvancedAnalytics />

      {/* Charts Section */}
      <PerformanceCharts
        performanceOverTime={performanceOverTime}
        subjectPerformance={subjectPerformance}
        monthlyProgress={monthlyProgress}
        weeklyActivity={weeklyActivity}
      />

      {/* Difficulty Analysis */}
      <DifficultyAnalysis difficultyBreakdown={difficultyBreakdown} />

      {/* Recent Activity & Goals */}
      <RecentActivitySection recentAttempts={stats.recentAttempts} />
    </div>
  );
};

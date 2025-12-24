import { DashboardStatCard } from '@/components/features/dashboard/DashboardStatCard';
import { Clock, Target, TrendingUp } from 'lucide-react';

interface DashboardQuickStatsProps {
  stats: {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    totalTimeSpent: number;
  };
}

export const DashboardQuickStats = ({ stats }: DashboardQuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <DashboardStatCard
        icon={Target}
        color="blue"
        label="Total Tests"
        value={stats.totalAttempts}
        subtitle="+2 this week"
        subtitleColor="text-green-600"
        delay={100}
      />
      <DashboardStatCard
        icon={TrendingUp}
        color="green"
        label="Average Score"
        value={`${stats.averageScore}%`}
        subtitle="+5% improvement"
        subtitleColor="text-green-600"
        delay={200}
      />
      <DashboardStatCard
        icon={Target}
        color="yellow"
        label="Best Score"
        value={`${stats.bestScore}%`}
        subtitle="Perfect score!"
        subtitleColor="text-blue-600"
        delay={300}
      />
      <DashboardStatCard
        icon={Clock}
        color="purple"
        label="Study Time"
        value={`${Math.floor(stats.totalTimeSpent / 60)}h ${stats.totalTimeSpent % 60}m`}
        subtitle="This month"
        subtitleColor="text-purple-600"
        delay={400}
      />
    </div>
  );
};

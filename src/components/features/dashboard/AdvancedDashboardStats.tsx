'use client';

import { PerformanceChart } from '@/components/features/analytics/PerformanceChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Activity,
    AlertCircle,
    Award,
    Brain,
    Calendar,
    CheckCircle,
    Clock,
    Star,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react';
import React from 'react';
import { StatCard } from './StatCard';

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
  // Generate mock data for charts
  const performanceOverTime = [
    { name: 'Week 1', value: 65 },
    { name: 'Week 2', value: 72 },
    { name: 'Week 3', value: 78 },
    { name: 'Week 4', value: 85 },
    { name: 'Week 5', value: 82 },
    { name: 'Week 6', value: 88 },
    { name: 'Week 7', value: 92 },
    { name: 'Week 8', value: 89 }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', value: 85 },
    { subject: 'Physics', value: 78 },
    { subject: 'Computer Science', value: 92 },
    { subject: 'Chemistry', value: 76 },
    { subject: 'Biology', value: 82 },
    { subject: 'English', value: 88 }
  ];

  const difficultyBreakdown = [
    { name: 'Easy', value: 45, color: '#10b981' },
    { name: 'Medium', value: 35, color: '#f59e0b' },
    { name: 'Hard', value: 20, color: '#ef4444' }
  ];

  const weeklyActivity = [
    { name: 'Mon', value: 3 },
    { name: 'Tue', value: 5 },
    { name: 'Wed', value: 2 },
    { name: 'Thu', value: 7 },
    { name: 'Fri', value: 4 },
    { name: 'Sat', value: 6 },
    { name: 'Sun', value: 1 }
  ];

  const monthlyProgress = [
    { name: 'Jan', value: 75 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 82 },
    { name: 'Apr', value: 85 },
    { name: 'May', value: 88 },
    { name: 'Jun', value: 91 }
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const getPerformanceLevel = (score: number): { level: string; color: 'blue' | 'green' | 'yellow' | 'red' } => {
    if (score >= 90) return { level: 'Excellent', color: 'green' };
    if (score >= 80) return { level: 'Good', color: 'blue' };
    if (score >= 70) return { level: 'Average', color: 'yellow' };
    return { level: 'Needs Improvement', color: 'red' };
  };

  const performanceLevel = getPerformanceLevel(stats.averageScore);

  return (
    <div className="space-y-8">
      {/* Key Performance Indicators */}
      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tests Taken"
            value={stats.totalAttempts}
            subtitle="All time"
            icon={Target}
            trend={{ value: 15, direction: 'up', period: 'vs last month' }}
            color="blue"
          />
          
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            subtitle={performanceLevel.level}
            icon={TrendingUp}
            trend={{ value: 8, direction: 'up', period: 'vs last month' }}
            color={performanceLevel.color}
          />
          
          <StatCard
            title="Best Performance"
            value={`${stats.bestScore}%`}
            subtitle="Personal record"
            icon={Award}
            trend={{ value: 5, direction: 'up', period: 'new record' }}
            color="yellow"
          />
          
          <StatCard
            title="Study Time"
            value={formatTime(stats.totalTimeSpent)}
            subtitle="This month"
            icon={Clock}
            trend={{ value: 22, direction: 'up', period: 'vs last month' }}
            color="purple"
          />
        </div>
      </div>

      {/* Advanced Analytics */}
      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Detailed Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Consistency Score"
            value="87%"
            subtitle="Performance stability"
            icon={Activity}
            trend={{ value: 3, direction: 'up', period: 'improving' }}
            color="indigo"
          />
          
          <StatCard
            title="Learning Velocity"
            value="12.5"
            subtitle="Points per week"
            icon={Zap}
            trend={{ value: 18, direction: 'up', period: 'accelerating' }}
            color="green"
          />
          
          <StatCard
            title="Completion Rate"
            value="94%"
            subtitle="Tests finished"
            icon={CheckCircle}
            trend={{ value: 2, direction: 'up', period: 'excellent' }}
            color="green"
          />
          
          <StatCard
            title="Focus Areas"
            value="3"
            subtitle="Need attention"
            icon={AlertCircle}
            trend={{ value: 1, direction: 'down', period: 'improving' }}
            color="red"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Over Time */}
        <PerformanceChart
          type="line"
          data={performanceOverTime}
          title="Performance Trend"
          description="Your score progression over the last 8 weeks"
          height={300}
          colors={['#3b82f6']}
        />

        {/* Subject Performance Radar */}
        <PerformanceChart
          type="radar"
          data={subjectPerformance}
          title="Subject Mastery"
          description="Performance breakdown by subject area"
          height={300}
          colors={['#8b5cf6']}
        />

        {/* Monthly Progress */}
        <PerformanceChart
          type="bar"
          data={monthlyProgress}
          title="Monthly Progress"
          description="Average scores by month"
          height={300}
          colors={['#10b981']}
        />

        {/* Weekly Activity */}
        <PerformanceChart
          type="bar"
          data={weeklyActivity}
          title="Weekly Activity"
          description="Tests taken per day this week"
          height={300}
          colors={['#f59e0b']}
        />
      </div>

      {/* Difficulty Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PerformanceChart
            type="pie"
            data={difficultyBreakdown}
            title="Question Difficulty"
            description="Distribution of attempted questions"
            height={250}
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
        </div>

        {/* Performance Insights */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-[var(--accent-green)]/5 rounded-lg border border-[var(--accent-green)]/20">
                <div className="p-1 bg-[var(--accent-green)]/10 rounded-full">
                  <TrendingUp className="h-4 w-4 text-[var(--accent-green)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Strong Improvement</p>
                  <p className="text-sm text-[var(--text-secondary)]">Your scores have improved by 15% over the last month. Keep up the excellent work!</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-[var(--accent-blue)]/5 rounded-lg border border-[var(--accent-blue)]/20">
                <div className="p-1 bg-[var(--accent-blue)]/10 rounded-full">
                  <Brain className="h-4 w-4 text-[var(--accent-blue)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Subject Strength</p>
                  <p className="text-sm text-[var(--text-secondary)]">Computer Science is your strongest subject with 92% average score.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-[var(--accent-yellow)]/5 rounded-lg border border-[var(--accent-yellow)]/20">
                <div className="p-1 bg-[var(--accent-yellow)]/10 rounded-full">
                  <Target className="h-4 w-4 text-[var(--accent-yellow)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Focus Area</p>
                  <p className="text-sm text-[var(--text-secondary)]">Consider spending more time on Physics to improve your 78% average.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-[var(--accent-purple)]/5 rounded-lg border border-[var(--accent-purple)]/20">
                <div className="p-1 bg-[var(--accent-purple)]/10 rounded-full">
                  <Star className="h-4 w-4 text-[var(--accent-purple)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Achievement Unlocked</p>
                  <p className="text-sm text-[var(--text-secondary)]">You&apos;ve maintained a 90%+ score streak for 3 consecutive tests!</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Test Results */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Test Results</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {stats.recentAttempts.map((attempt, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    attempt.score >= 90 ? 'bg-green-500' :
                    attempt.score >= 80 ? 'bg-blue-500' :
                    attempt.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{attempt.testTitle}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={attempt.score >= 80 ? 'success' : attempt.score >= 60 ? 'warning' : 'danger'}
                    size="md"
                  >
                    {attempt.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Goals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Learning Goals</h3>
            <Button variant="ghost" size="sm">Manage</Button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Monthly Test Target</span>
                <span className="text-sm text-[var(--text-secondary)]">8/10</span>
              </div>
              <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Average Score Goal</span>
                <span className="text-sm text-[var(--text-secondary)]">87/90%</span>
              </div>
              <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '97%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Study Streak</span>
                <span className="text-sm text-[var(--text-secondary)]">12/14 days</span>
              </div>
              <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                <Calendar className="h-4 w-4" />
                <span>Next milestone: Complete 2 more tests this week</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

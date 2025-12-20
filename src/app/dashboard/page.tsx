'use client';

import { AdvancedDashboardStats } from '@/components/features/dashboard/AdvancedDashboardStats';
import { DashboardStatCard } from '@/components/features/dashboard/DashboardStatCard';
import { TestCard } from '@/components/features/tests/TestCard';
import { Button } from '@/components/ui/button';
import { mockTestAttempts, mockTests } from '@/lib/mock-data';
import { Clock, Plus, Target, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const stats = {
    totalAttempts: mockTestAttempts.length,
    averageScore: Math.round(mockTestAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / mockTestAttempts.length),
    bestScore: Math.max(...mockTestAttempts.map(attempt => attempt.score)),
    totalTimeSpent: mockTestAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0),
    recentAttempts: mockTestAttempts.slice(-3).map(attempt => ({
      testTitle: mockTests.find(test => test.id === attempt.testId)?.title || 'Unknown Test',
      score: attempt.score,
      completedAt: attempt.completedAt
    }))
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white animate-slide-down shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Welcome back, John! 🎯</h2>
              <p className="text-blue-100 text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
                Ready to continue your learning journey? You&apos;ve completed {stats.totalAttempts} tests with an average score of {stats.averageScore}%.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/tests')}
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Take a Test
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/analytics')}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  View Analytics
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
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

      {/* Stats Overview */}
      <div className="animate-scale-in animation-delay-500">
        <AdvancedDashboardStats stats={stats} />
      </div>

      {/* Available Tests */}
      <div className="animate-slide-up animation-delay-700">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Available Tests</h3>
            <p className="text-[var(--text-secondary)] mt-1">Continue your learning with these recommended tests</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/tests')}
            className="hover:bg-[var(--accent-blue)]/10 hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
          >
            View All Tests
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockTests.slice(0, 3).map((test) => (
            <TestCard
              key={test.id}
              test={test}
              attemptCount={mockTestAttempts.filter(attempt => attempt.testId === test.id).length}
              onStart={() => router.push('/tests/take-test')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

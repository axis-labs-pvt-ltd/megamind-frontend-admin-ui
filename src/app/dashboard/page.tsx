'use client';

import { AdvancedDashboardStats } from '@/components/features/dashboard/AdvancedDashboardStats';
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
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white animate-slide-down shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-3">Welcome back, John! 🎯</h2>
              <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                Ready to continue your learning journey? You&apos;ve completed {stats.totalAttempts} tests with an average score of {stats.averageScore}%.
              </p>
              <div className="flex items-center space-x-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-slide-up animation-delay-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
              <p className="text-xs text-green-600 font-medium">+2 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-slide-up animation-delay-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              <p className="text-xs text-green-600 font-medium">+5% improvement</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-slide-up animation-delay-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bestScore}%</p>
              <p className="text-xs text-blue-600 font-medium">Perfect score!</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-slide-up animation-delay-400">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(stats.totalTimeSpent / 60)}h {stats.totalTimeSpent % 60}m</p>
              <p className="text-xs text-purple-600 font-medium">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="animate-scale-in animation-delay-500">
        <AdvancedDashboardStats stats={stats} />
      </div>

      {/* Available Tests */}
      <div className="animate-slide-up animation-delay-700">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Available Tests</h3>
            <p className="text-gray-600 mt-1">Continue your learning with these recommended tests</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/tests')}
            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
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

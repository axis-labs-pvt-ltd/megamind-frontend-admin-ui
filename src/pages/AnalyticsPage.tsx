import { Award, Clock, Target, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { Badge } from '../components/atoms/Badge';
import { Card } from '../components/atoms/Card';
import { mockTestAttempts, mockTests } from '../data/mockData';

interface AnalyticsPageProps {
  onPageChange: (page: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onPageChange }) => {
  const totalAttempts = mockTestAttempts.length;
  const averageScore = Math.round(mockTestAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts);
  const totalTimeSpent = mockTestAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
  const passedTests = mockTestAttempts.filter(attempt => attempt.score >= 70).length;

  const testPerformance = mockTests.map(test => {
    const attempts = mockTestAttempts.filter(attempt => attempt.testId === test.id);
    return {
      test,
      attempts: attempts.length,
      averageScore: attempts.length > 0 ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : 0,
      bestScore: attempts.length > 0 ? Math.max(...attempts.map(attempt => attempt.score)) : 0,
      lastAttempt: attempts.length > 0 ? attempts[attempts.length - 1].completedAt : null
    };
  });

  const recentTrends = [
    { period: 'This Week', score: 85, change: 5, trend: 'up' },
    { period: 'This Month', score: 78, change: -2, trend: 'down' },
    { period: 'Last Month', score: 82, change: 8, trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your progress and performance over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 animate-slide-up animation-delay-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-slide-up animation-delay-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-slide-up animation-delay-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tests Passed</p>
              <p className="text-2xl font-bold text-gray-900">{passedTests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-slide-up animation-delay-400">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">{totalTimeSpent}m</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <div className="space-y-4">
          {recentTrends.map((trend, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <p className="font-medium text-gray-900">{trend.period}</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={trend.score >= 80 ? 'success' : trend.score >= 60 ? 'warning' : 'danger'}>
                  {trend.score}%
                </Badge>
                <div className={`flex items-center space-x-1 ${
                  trend.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trend.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{trend.change}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Test Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Performance</h3>
        <div className="space-y-4">
          {testPerformance.map((perf, index) => (
            <div 
              key={index} 
              className="p-4 border rounded-lg animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{perf.test.title}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" size="sm">
                    {perf.attempts} attempts
                  </Badge>
                  <Badge variant={perf.averageScore >= 80 ? 'success' : perf.averageScore >= 60 ? 'warning' : 'danger'}>
                    {perf.averageScore}% avg
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Average Score</p>
                  <p className="font-medium">{perf.averageScore}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Best Score</p>
                  <p className="font-medium">{perf.bestScore}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Attempts</p>
                  <p className="font-medium">{perf.attempts}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Attempt</p>
                  <p className="font-medium">
                    {perf.lastAttempt ? perf.lastAttempt.toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
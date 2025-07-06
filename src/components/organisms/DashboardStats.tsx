import React from 'react';
import { ScoreCard } from '../molecules/ScoreCard';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';

interface DashboardStatsProps {
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

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bestScore}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.recentAttempts.map((attempt, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{attempt.testTitle}</p>
                <p className="text-sm text-gray-500">
                  {attempt.completedAt.toLocaleDateString()}
                </p>
              </div>
              <Badge 
                variant={attempt.score >= 80 ? 'success' : attempt.score >= 60 ? 'warning' : 'danger'}
                size="md"
              >
                {attempt.score}%
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
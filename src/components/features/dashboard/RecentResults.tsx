import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';

interface RecentResultsProps {
  attempts: Array<{
    testTitle: string;
    score: number;
    completedAt: Date;
  }>;
}

export const RecentResults: React.FC<RecentResultsProps> = ({ attempts }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Test Results</h3>
        <Button variant="ghost" size="sm">View All</Button>
      </div>
      <div className="space-y-3">
        {attempts.map((attempt, index) => (
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
  );
};

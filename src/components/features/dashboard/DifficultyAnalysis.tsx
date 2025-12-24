import { PerformanceChart } from '@/components/features/analytics/PerformanceChart';
import { Card } from '@/components/ui/card';
import { Brain, Star, Target, TrendingUp } from 'lucide-react';
import React from 'react';
import { InsightItem } from './InsightItem';

interface DifficultyAnalysisProps {
  difficultyBreakdown: Array<{ name: string; value: number; color: string }>;
}

export const DifficultyAnalysis: React.FC<DifficultyAnalysisProps> = ({ difficultyBreakdown }) => {
  return (
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
            <InsightItem
              icon={TrendingUp}
              title="Strong Improvement"
              description="Your scores have improved by 15% over the last month. Keep up the excellent work!"
              variant="green"
            />

            <InsightItem
              icon={Brain}
              title="Subject Strength"
              description="Computer Science is your strongest subject with 92% average score."
              variant="blue"
            />

            <InsightItem
              icon={Target}
              title="Focus Area"
              description="Consider spending more time on Physics to improve your 78% average."
              variant="yellow"
            />

            <InsightItem
              icon={Star}
              title="Achievement Unlocked"
              description="You've maintained a 90%+ score streak for 3 consecutive tests!"
              variant="purple"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

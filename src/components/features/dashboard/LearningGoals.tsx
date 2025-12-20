import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import React from 'react';
import { GoalProgress } from './GoalProgress';

export const LearningGoals: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Learning Goals</h3>
        <Button variant="ghost" size="sm">Manage</Button>
      </div>
      <div className="space-y-4">
        <GoalProgress 
          label="Monthly Test Target"
          valueLabel="8/10"
          percentage={80}
          colorClass="bg-blue-500"
        />
        
        <GoalProgress 
          label="Average Score Goal"
          valueLabel="87/90%"
          percentage={97}
          colorClass="bg-green-500"
        />

        <GoalProgress 
          label="Study Streak"
          valueLabel="12/14 days"
          percentage={86}
          colorClass="bg-purple-500"
        />

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
            <Calendar className="h-4 w-4" />
            <span>Next milestone: Complete 2 more tests this week</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

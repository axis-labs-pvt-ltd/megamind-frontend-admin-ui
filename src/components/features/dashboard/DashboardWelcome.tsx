import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';

interface DashboardWelcomeProps {
  stats: {
    totalAttempts: number;
    averageScore: number;
  };
  onTakeTest: () => void;
  onViewAnalytics: () => void;
}

export const DashboardWelcome = ({ stats, onTakeTest, onViewAnalytics }: DashboardWelcomeProps) => {
  return (
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
                onClick={onTakeTest}
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Take a Test
              </Button>
              <Button
                variant="ghost"
                onClick={onViewAnalytics}
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
  );
};

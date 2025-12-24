'use client';

import { AdvancedDashboardStats } from '@/components/features/dashboard/AdvancedDashboardStats';
import { AvailableTestsList } from '@/components/features/dashboard/AvailableTestsList';
import { DashboardQuickStats } from '@/components/features/dashboard/DashboardQuickStats';
import { DashboardWelcome } from '@/components/features/dashboard/DashboardWelcome';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const stats = useDashboardStats();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <DashboardWelcome 
        stats={stats} 
        onTakeTest={() => router.push('/tests')} 
        onViewAnalytics={() => router.push('/analytics')} 
      />

      {/* Quick Stats */}
      <DashboardQuickStats stats={stats} />

      {/* Stats Overview */}
      <div className="animate-scale-in animation-delay-500">
        <AdvancedDashboardStats stats={stats} />
      </div>

      {/* Available Tests */}
      <AvailableTestsList />
    </div>
  );
}

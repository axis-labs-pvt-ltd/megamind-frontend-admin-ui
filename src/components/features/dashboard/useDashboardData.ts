/**
 * Hook to generate mock dashboard data
 * TODO: Replace with actual API calls when backend is ready
 */
export const useDashboardData = () => {
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

  return {
    performanceOverTime,
    subjectPerformance,
    difficultyBreakdown,
    weeklyActivity,
    monthlyProgress
  };
};

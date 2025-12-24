/**
 * Utility functions for dashboard statistics
 */

/**
 * Formats minutes into a human-readable time string
 */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
};

/**
 * Determines performance level based on score
 */
export const getPerformanceLevel = (
  score: number
): { level: string; color: 'blue' | 'green' | 'yellow' | 'red' } => {
  if (score >= 90) return { level: 'Excellent', color: 'green' };
  if (score >= 80) return { level: 'Good', color: 'blue' };
  if (score >= 70) return { level: 'Average', color: 'yellow' };
  return { level: 'Needs Improvement', color: 'red' };
};

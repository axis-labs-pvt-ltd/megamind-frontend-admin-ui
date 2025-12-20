'use client';

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, className }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Clock className={cn(
        "h-4 w-4",
        isCritical ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-gray-500'
      )} />
      <span className={cn(
        "font-mono text-sm font-medium",
        isCritical ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-gray-700'
      )}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

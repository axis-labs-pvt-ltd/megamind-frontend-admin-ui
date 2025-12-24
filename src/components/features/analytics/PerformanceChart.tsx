'use client';

import { Card } from '@/components/ui/card';
import React from 'react';
import { BarChartRenderer } from './charts/BarChartRenderer';
import { LineChartRenderer } from './charts/LineChartRenderer';
import { PieChartRenderer } from './charts/PieChartRenderer';
import { RadarChartRenderer } from './charts/RadarChartRenderer';

interface ChartData {
  name?: string;
  value: number;
  subject?: string;
  [key: string]: string | number | undefined;
}

interface PerformanceChartProps {
  type: 'line' | 'bar' | 'pie' | 'radar';
  data: ChartData[];
  title: string;
  description?: string;
  height?: number;
  colors?: string[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  type,
  data,
  title,
  description,
  height = 300,
  colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <LineChartRenderer data={data} height={height} colors={colors} />;
      case 'bar':
        return <BarChartRenderer data={data} height={height} colors={colors} />;
      case 'pie':
        return <PieChartRenderer data={data} height={height} colors={colors} />;
      case 'radar':
        return <RadarChartRenderer data={data} height={height} colors={colors} />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {renderChart()}
    </Card>
  );
};

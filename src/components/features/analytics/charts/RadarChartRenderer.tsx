import React from 'react';
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface RadarChartRendererProps {
  data: any[];
  height: number;
  colors: string[];
}

export const RadarChartRenderer: React.FC<RadarChartRendererProps> = ({ data, height, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fontSize: 10, fill: '#64748b' }}
          tickCount={6}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke={colors[0]}
          fill={colors[0]}
          fillOpacity={0.1}
          strokeWidth={2}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

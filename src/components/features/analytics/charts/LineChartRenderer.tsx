import React from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface LineChartRendererProps {
  data: any[];
  height: number;
  colors: string[];
}

export const LineChartRenderer: React.FC<LineChartRendererProps> = ({ data, height, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={colors[0]}
          strokeWidth={3}
          dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

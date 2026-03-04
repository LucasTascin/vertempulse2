import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { clsx } from 'clsx';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color, height = 40 }) => {
  const chartData = data.map((val, i) => ({ i, val }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line 
            type="monotone" 
            dataKey="val" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

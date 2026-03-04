import React, { useRef, useState, useEffect } from 'react';
import { LineChart, Line, YAxis } from 'recharts';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color, height = 40 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const chartData = data.map((val, i) => ({ i, val }));

  return (
    <div ref={containerRef} style={{ height, width: '100%', position: 'relative' }}>
      {width > 0 && (
        <LineChart width={width} height={height} data={chartData}>
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
      )}
    </div>
  );
};

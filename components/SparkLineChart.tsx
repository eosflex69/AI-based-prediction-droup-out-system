
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SparkLineChartProps {
  data: { [key: string]: any }[];
  dataKey: string;
}

const SparkLineChart: React.FC<SparkLineChartProps> = ({ data, dataKey }) => {
  const min = Math.min(...data.map(d => d[dataKey]));
  const max = Math.max(...data.map(d => d[dataKey]));
  
  const isTrendingUp = data.length > 1 && data[data.length - 1][dataKey] > data[0][dataKey];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <YAxis domain={[min - 5, max + 5]} hide={true} />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={isTrendingUp ? '#22c55e' : '#ef4444'} 
          strokeWidth={2} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLineChart;

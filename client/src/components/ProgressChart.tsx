import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ProgressPoint, fetchProgressHistory } from '../api/progress';

export function ProgressChart() {
  const [data, setData] = useState<ProgressPoint[]>([]);

  useEffect(() => {
    fetchProgressHistory().then(setData).catch(console.error);
  }, []);

  if (!data.length) return <div>Loading progress…</div>;
  console.log('ProgressChart data:', data);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey='date' />
          <YAxis
            yAxisId='left'
            label={{ value: 'Active Days', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId='right'
            orientation='right'
            label={{ value: 'Chapters', angle: -90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId='left'
            type='monotone'
            dataKey='ndays_act'
            name='Active Days'
          />
          <Line
            yAxisId='right'
            type='monotone'
            dataKey='nchapters'
            name='Chapters Completed'
            stroke='#8884d8'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { StudentRiskProfile } from '../types';
import { RISK_THRESHOLDS } from '../constants';

const RiskRadarChart: React.FC<{ student: StudentRiskProfile }> = ({ student }) => {
  
  const attendanceScore = (100 - student.avgAttendance);
  const testScore = (100 - student.avgTestScore);
  const feesScore = student.isFeeDue ? 100 : 0;
  
  const data = [
    { subject: 'Poor Attendance', A: attendanceScore, fullMark: 100 },
    { subject: 'Low Scores', A: testScore, fullMark: 100 },
    { subject: 'Fees Due', A: feesScore, fullMark: 100 },
  ];
  
  const riskColor = RISK_THRESHOLDS[student.riskLabel].radarColor;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name={String(student.student_id)} dataKey="A" stroke={riskColor} fill={riskColor} fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RiskRadarChart;

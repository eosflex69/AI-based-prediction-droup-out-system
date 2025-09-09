
import React from 'react';
import { StudentRiskProfile } from '../types';
import StudentTable from './StudentTable';
import { UsersIcon, TrendingUpIcon, AlertTriangleIcon, ActivityIcon } from './icons/DashboardIcons';

interface DashboardProps {
  metrics: {
    totalStudents: number;
    avgRisk: number;
    criticalCount: number;
    atRiskCount: number;
    monitorCount: number;
  };
  students: StudentRiskProfile[];
  onStudentSelect: (student: StudentRiskProfile) => void;
  selectedStudentId?: number | null;
}

const MetricCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 flex items-center">
        <div className={`rounded-full p-3 mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-dark-text">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ metrics, students, onStudentSelect, selectedStudentId }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <MetricCard icon={<UsersIcon />} title="Total Students" value={metrics.totalStudents} color="bg-blue-100 text-blue-600" />
        <MetricCard icon={<ActivityIcon />} title="Avg. Risk Score" value={`${metrics.avgRisk}%`} color="bg-purple-100 text-purple-600" />
        <MetricCard icon={<AlertTriangleIcon />} title="Critical" value={metrics.criticalCount} color="bg-red-100 text-red-600" />
        <MetricCard icon={<TrendingUpIcon />} title="At Risk" value={metrics.atRiskCount} color="bg-orange-100 text-orange-600" />
        <MetricCard icon={<TrendingUpIcon />} title="Monitor" value={metrics.monitorCount} color="bg-yellow-100 text-yellow-600" />
      </div>

      <StudentTable students={students} onStudentSelect={onStudentSelect} selectedStudentId={selectedStudentId}/>
    </div>
  );
};

export default Dashboard;


import React, { useState, useMemo } from 'react';
import { StudentRiskProfile, RiskLabel } from '../types';
import { RISK_THRESHOLDS } from '../constants';
import { ChevronUpIcon, ChevronDownIcon } from './icons/SortIcons';

type SortKey = keyof StudentRiskProfile | 'student_id';
type SortDirection = 'asc' | 'desc';

const StudentTable: React.FC<{
  students: StudentRiskProfile[];
  onStudentSelect: (student: StudentRiskProfile) => void;
  selectedStudentId?: number | null;
}> = ({ students, onStudentSelect, selectedStudentId }) => {
  const [sortKey, setSortKey] = useState<SortKey>('riskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortableHeader: React.FC<{ headerKey: SortKey; children: React.ReactNode }> = ({ headerKey, children }) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(headerKey)}
    >
      <div className="flex items-center">
        {children}
        {sortKey === headerKey && (
          <span className="ml-1">
            {sortDirection === 'desc' ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </span>
        )}
      </div>
    </th>
  );

  const getTrajectoryIcon = (trajectory: 'Improving' | 'Worsening' | 'Flat') => {
    if (trajectory === 'Improving') return <span className="text-green-500">▲</span>;
    if (trajectory === 'Worsening') return <span className="text-red-500">▼</span>;
    return <span className="text-slate-500">▬</span>;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
        <h3 className="text-xl font-bold text-dark-text p-2">Student Overview</h3>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <SortableHeader headerKey="student_id">Student ID</SortableHeader>
            <SortableHeader headerKey="riskScore">Risk Score</SortableHeader>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk Level</th>
            <SortableHeader headerKey="avgAttendance">Avg. Attendance</SortableHeader>
            <SortableHeader headerKey="avgTestScore">Avg. Test Score</SortableHeader>
            <SortableHeader headerKey="trajectory">Trajectory</SortableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {sortedStudents.map((student) => {
            const riskConfig = RISK_THRESHOLDS[student.riskLabel as RiskLabel];
            return (
              <tr 
                key={student.student_id} 
                onClick={() => onStudentSelect(student)}
                className={`cursor-pointer hover:bg-slate-100 transition-colors duration-200 ${selectedStudentId === student.student_id ? 'bg-blue-50' : ''}`}
                >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue">{student.student_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{student.riskScore}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${riskConfig.color}`}>
                    {student.riskLabel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.avgAttendance.toFixed(1)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.avgTestScore.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {getTrajectoryIcon(student.trajectory)} {student.trajectory}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;

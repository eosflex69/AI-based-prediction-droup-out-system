
import { RiskLabel } from './types';

export const RISK_THRESHOLDS: Record<RiskLabel, { min: number, max: number, color: string, radarColor: string }> = {
  'On Track': { min: 0, max: 30, color: 'bg-green-100 text-green-800', radarColor: 'rgba(107, 191, 89, 0.6)' },
  'Monitor': { min: 31, max: 50, color: 'bg-yellow-100 text-yellow-800', radarColor: 'rgba(255, 215, 0, 0.6)' },
  'At Risk': { min: 51, max: 70, color: 'bg-orange-100 text-orange-800', radarColor: 'rgba(255, 165, 0, 0.6)' },
  'Critical Intervention': { min: 71, max: 100, color: 'bg-red-100 text-red-800', radarColor: 'rgba(214, 64, 69, 0.6)' },
};

export const getRiskLabel = (score: number): RiskLabel => {
  if (score <= 30) return 'On Track';
  if (score <= 50) return 'Monitor';
  if (score <= 70) return 'At Risk';
  return 'Critical Intervention';
};

export const SAMPLE_ATTENDANCE_CSV = `student_id,month,attendance_percent
101,1,95
101,2,92
101,3,94
101,4,96
101,5,91
101,6,93
102,1,85
102,2,82
102,3,78
102,4,75
102,5,70
102,6,68
103,1,98
103,2,99
103,3,97
103,4,98
103,5,96
103,6,99
104,1,75
104,2,76
104,3,80
104,4,82
104,5,85
104,6,88
105,1,60
105,2,55
105,3,62
105,4,58
105,5,50
105,6,45
`;

export const SAMPLE_TESTS_CSV = `student_id,test_date,subject,score
101,2023-01-15,Math,88
101,2023-02-20,Science,92
101,2023-03-18,History,85
101,2023-04-22,Math,90
101,2023-05-19,Science,94
101,2023-06-21,History,89
102,2023-01-15,Math,72
102,2023-02-20,Science,68
102,2023-03-18,History,75
102,2023-04-22,Math,65
102,2023-05-19,Science,60
102,2023-06-21,History,62
103,2023-01-15,Math,95
103,2023-02-20,Science,98
103,2023-03-18,History,96
103,2023-04-22,Math,97
103,2023-05-19,Science,99
103,2023-06-21,History,98
104,2023-01-15,Math,65
104,2023-02-20,Science,70
104,2023-03-18,History,72
104,2023-04-22,Math,75
104,2023-05-19,Science,78
104,2023-06-21,History,80
105,2023-01-15,Math,55
105,2023-02-20,Science,50
105,2023-03-18,History,45
105,2023-04-22,Math,48
105,2023-05-19,Science,42
105,2023-06-21,History,38
`;

export const SAMPLE_FEES_CSV = `student_id,month,fee_status
101,1,Paid
101,2,Paid
101,3,Paid
101,4,Paid
101,5,Paid
101,6,Paid
102,1,Paid
102,2,Paid
102,3,Due
102,4,Due
102,5,Due
102,6,Due
103,1,Paid
103,2,Paid
103,3,Paid
103,4,Paid
103,5,Paid
103,6,Paid
104,1,Paid
104,2,Paid
104,3,Paid
104,4,Paid
104,5,Paid
104,6,Paid
105,1,Paid
105,2,Due
105,3,Paid
105,4,Due
105,5,Due
105,6,Due
`;

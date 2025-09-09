
export interface AttendanceRecord {
  student_id: number;
  month: number;
  attendance_percent: number;
}

export interface TestRecord {
  student_id: number;
  test_date: string; // YYYY-MM-DD
  subject: string;
  score: number;
}

export interface FeeRecord {
  student_id: number;
  month: number;
  fee_status: 'Paid' | 'Due';
}

export interface StudentRiskProfile {
  student_id: number;
  riskScore: number;
  riskLabel: 'On Track' | 'Monitor' | 'At Risk' | 'Critical Intervention';
  riskFactors: string[];
  trajectory: 'Improving' | 'Worsening' | 'Flat';
  avgAttendance: number;
  attendanceTrend: number;
  avgTestScore: number;
  scoreTrend: number;
  isFeeDue: boolean;
  isAnomaly: boolean;
  anomalyReason: string;
  attendanceHistory: { month: number, value: number }[];
  testScoreHistory: { date: string, value: number }[];
  riskHistory: number[];
}

export type RiskLabel = 'On Track' | 'Monitor' | 'At Risk' | 'Critical Intervention';

export interface AppSettings {
  useMLAnomaly: boolean;
}

export interface GeminiAnomalyResponse {
  is_anomaly: boolean;
  reason: string;
}

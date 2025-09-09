
import { AttendanceRecord, TestRecord, FeeRecord, StudentRiskProfile } from '../types';
import { getRiskLabel } from '../constants';
import { detectAnomaly } from './geminiService';

const calculateTrend = (data: number[]): number => {
    if (data.length < 2) return 0;
    const recentData = data.slice(-3);
    if (recentData.length < 2) return 0;
    const olderAvg = recentData.length > 2 ? (recentData[0]) : recentData[0];
    const newerAvg = recentData[recentData.length -1];
    return newerAvg - olderAvg;
};

const calculateHistoricalRisk = (
    attendanceHistory: {month: number, value: number}[],
    testScoreHistory: {date: string, value: number}[],
    feeHistory: {month: number, isDue: boolean}[]
): number[] => {
    const allMonths = [...new Set(attendanceHistory.map(a => a.month).concat(feeHistory.map(f => f.month)))].sort((a,b)=> a-b);
    
    return allMonths.map(month => {
        const relevantAttendance = attendanceHistory.filter(a => a.month <= month);
        const relevantTests = testScoreHistory.filter(t => new Date(t.date).getMonth() + 1 <= month);
        const relevantFees = feeHistory.find(f => f.month === month);

        const avgAtt = relevantAttendance.length ? relevantAttendance.reduce((sum, r) => sum + r.value, 0) / relevantAttendance.length : 100;
        const avgTest = relevantTests.length ? relevantTests.reduce((sum, r) => sum + r.value, 0) / relevantTests.length : 100;
        const feeDue = relevantFees ? relevantFees.isDue : false;

        const attendanceRisk = (100 - avgAtt) * 0.4;
        const testScoreRisk = (100 - avgTest) * 0.4;
        const feeRisk = feeDue ? 20 : 0;
        
        return Math.min(100, Math.round(attendanceRisk + testScoreRisk + feeRisk));
    }).slice(-6); // Only last 6 months of risk history
};

export const processStudentData = async (
    attendanceData: AttendanceRecord[],
    testData: TestRecord[],
    feeData: FeeRecord[],
    useMLAnomaly: boolean
): Promise<StudentRiskProfile[]> => {
    
    const studentIds = [...new Set(attendanceData.map(a => a.student_id))];

    const studentProfiles = await Promise.all(studentIds.map(async (id) => {
        const studentAttendance = attendanceData.filter(a => a.student_id === id).sort((a,b) => a.month - b.month);
        const studentTests = testData.filter(t => t.student_id === id).sort((a,b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime());
        const studentFees = feeData.filter(f => f.student_id === id).sort((a,b) => a.month - b.month);

        const avgAttendance = studentAttendance.reduce((acc, curr) => acc + curr.attendance_percent, 0) / studentAttendance.length || 0;
        const attendanceTrend = calculateTrend(studentAttendance.map(a => a.attendance_percent));
        
        const avgTestScore = studentTests.reduce((acc, curr) => acc + curr.score, 0) / studentTests.length || 0;
        const scoreTrend = calculateTrend(studentTests.map(t => t.score));

        const latestFee = studentFees[studentFees.length - 1];
        const isFeeDue = latestFee?.fee_status === 'Due';

        // Risk Calculation
        const attendanceRisk = (100 - avgAttendance) * 0.4;
        const testScoreRisk = (100 - avgTestScore) * 0.4;
        const feeRisk = isFeeDue ? 20 : 0;
        let totalRisk = attendanceRisk + testScoreRisk + feeRisk;

        const riskFactors: string[] = [];
        if (attendanceRisk > 15) riskFactors.push(`Low average attendance (${avgAttendance.toFixed(1)}%)`);
        if (testScoreRisk > 15) riskFactors.push(`Low average test scores (${avgTestScore.toFixed(1)})`);
        if (isFeeDue) riskFactors.push("Outstanding fee balance");
        if (attendanceTrend < -5) riskFactors.push("Declining attendance trend");
        if (scoreTrend < -5) riskFactors.push("Declining score trend");

        // Anomaly Detection
        let isAnomaly = false;
        let anomalyReason = '';
        if (useMLAnomaly && studentAttendance.length > 2 && studentTests.length > 2) {
             const { is_anomaly, reason } = await detectAnomaly({
                 attendance: studentAttendance.slice(-3).map(a => a.attendance_percent),
                 scores: studentTests.slice(-3).map(t => t.score),
                 fees_due_in_last_3_months: studentFees.slice(-3).filter(f=>f.fee_status === 'Due').length
             });
             isAnomaly = is_anomaly;
             anomalyReason = reason;
             if (is_anomaly) {
                 totalRisk *= 1.2; // Increase risk by 20% if anomaly detected
             }
        }
        
        const finalRiskScore = Math.min(100, Math.round(totalRisk));
        const riskLabel = getRiskLabel(finalRiskScore);

        const feeHistory = studentFees.map(f => ({month: f.month, isDue: f.fee_status === 'Due'}));
        const riskHistory = calculateHistoricalRisk(
            studentAttendance.map(a => ({month: a.month, value: a.attendance_percent})), 
            studentTests.map(t => ({date: t.test_date, value: t.score})),
            feeHistory
        );

        const riskTrend = calculateTrend(riskHistory);
        let trajectory: 'Improving' | 'Worsening' | 'Flat' = 'Flat';
        if (riskTrend < -5) trajectory = 'Improving';
        if (riskTrend > 5) trajectory = 'Worsening';

        return {
            student_id: id,
            riskScore: finalRiskScore,
            riskLabel: riskLabel,
            riskFactors: riskFactors.length > 0 ? riskFactors.slice(0, 3) : ["Student is performing well."],
            trajectory: trajectory,
            avgAttendance: avgAttendance,
            attendanceTrend: attendanceTrend,
            avgTestScore: avgTestScore,
            scoreTrend: scoreTrend,
            isFeeDue: isFeeDue,
            isAnomaly: isAnomaly,
            anomalyReason: anomalyReason,
            attendanceHistory: studentAttendance.map(a => ({ month: a.month, value: a.attendance_percent })),
            testScoreHistory: studentTests.map(t => ({ date: t.test_date, value: t.score })),
            riskHistory: riskHistory,
        };
    }));

    return studentProfiles;
};

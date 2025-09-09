
import React, { useState, useMemo, useCallback } from 'react';
import { StudentRiskProfile, AppSettings } from './types';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';
import { processStudentData } from './services/dataProcessor';
import { SAMPLE_ATTENDANCE_CSV, SAMPLE_FEES_CSV, SAMPLE_TESTS_CSV } from './constants';
import Papa from 'papaparse';

const App: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentRiskProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentRiskProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    useMLAnomaly: true,
  });

  const handleDataLoaded = useCallback(async (attendance: any[], tests: any[], fees: any[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const processedData = await processStudentData(attendance, tests, fees, settings.useMLAnomaly);
      setStudentData(processedData);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error processing data:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during data processing.');
    } finally {
      setIsLoading(false);
    }
  }, [settings.useMLAnomaly]);

  const loadSampleData = useCallback(() => {
    const attendance = Papa.parse(SAMPLE_ATTENDANCE_CSV, { header: true, dynamicTyping: true }).data;
    const tests = Papa.parse(SAMPLE_TESTS_CSV, { header: true, dynamicTyping: true }).data;
    const fees = Papa.parse(SAMPLE_FEES_CSV, { header: true, dynamicTyping: true }).data;
    handleDataLoaded(attendance, tests, fees);
  }, [handleDataLoaded]);

  const handleStudentSelect = (student: StudentRiskProfile | null) => {
    setSelectedStudent(student);
  };

  const dashboardMetrics = useMemo(() => {
    if (studentData.length === 0) {
      return { totalStudents: 0, avgRisk: 0, criticalCount: 0, atRiskCount: 0, monitorCount: 0 };
    }
    const totalRisk = studentData.reduce((acc, s) => acc + s.riskScore, 0);
    return {
      totalStudents: studentData.length,
      avgRisk: Math.round(totalRisk / studentData.length),
      criticalCount: studentData.filter(s => s.riskLabel === 'Critical Intervention').length,
      atRiskCount: studentData.filter(s => s.riskLabel === 'At Risk').length,
      monitorCount: studentData.filter(s => s.riskLabel === 'Monitor').length,
    };
  }, [studentData]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar settings={settings} onSettingsChange={setSettings} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-dark-text tracking-tight">Student Early-Warning Dashboard</h1>
          <p className="text-medium-text mt-2">AI-powered insights to support student success.</p>
        </header>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`transition-all duration-500 ease-in-out ${selectedStudent ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {studentData.length === 0 ? (
               <FileUpload onDataLoaded={handleDataLoaded} onLoadSampleData={loadSampleData} isLoading={isLoading} />
            ) : (
              <Dashboard
                metrics={dashboardMetrics}
                students={studentData}
                onStudentSelect={handleStudentSelect}
                selectedStudentId={selectedStudent?.student_id}
              />
            )}
          </div>

          {selectedStudent && (
            <div className="lg:col-span-1">
              <StudentProfile student={selectedStudent} onClose={() => handleStudentSelect(null)} />
            </div>
          )}
        </div>
        
        <InfoPanel />
      </main>
    </div>
  );
};

export default App;

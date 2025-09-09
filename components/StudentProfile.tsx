
import React, { useState, useEffect, useCallback } from 'react';
import { StudentRiskProfile } from '../types';
import RiskRadarChart from './RiskRadarChart';
import SparkLineChart from './SparkLineChart';
import { RISK_THRESHOLDS } from '../constants';
import { generateCounselingMessage } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

const StudentProfile: React.FC<{ student: StudentRiskProfile; onClose: () => void; }> = ({ student, onClose }) => {
  const [message, setMessage] = useState('');
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const riskConfig = RISK_THRESHOLDS[student.riskLabel];

  const fetchMessage = useCallback(async () => {
    setIsLoadingMessage(true);
    try {
      const generatedMessage = await generateCounselingMessage(student.riskScore, student.riskLabel, student.riskFactors);
      setMessage(generatedMessage);
    } catch (error) {
      console.error("Failed to generate message:", error);
      setMessage("Could not generate a message at this time. Please check your API key and try again.");
    } finally {
      setIsLoadingMessage(false);
    }
  }, [student]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-dark-text">Student Profile: {student.student_id}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <CloseIcon />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        <div className="text-center mb-4">
            <span className={`text-3xl font-bold ${riskConfig.color.replace('bg-', 'text-').replace('-100', '-600')}`}>{student.riskScore}</span>
            <p className={`font-semibold ${riskConfig.color.replace('bg-', 'text-').replace('-100', '-800')}`}>{student.riskLabel}</p>
        </div>

        <div className="h-64 mb-4">
          <RiskRadarChart student={student} />
        </div>

        <div className="mb-4">
            <h4 className="font-semibold text-medium-text mb-2">Key Risk Factors</h4>
            <ul className="space-y-1 list-disc list-inside">
                {student.riskFactors.map((factor, index) => (
                    <li key={index} className="text-sm text-slate-600">{factor}</li>
                ))}
                {student.isAnomaly && <li className="text-sm text-red-600 font-semibold">AI Anomaly Detected: {student.anomalyReason}</li>}
            </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <h5 className="text-sm font-semibold text-center text-medium-text">Attendance Trend</h5>
                <div className="h-20">
                    <SparkLineChart data={student.attendanceHistory.slice(-6)} dataKey="value" />
                </div>
            </div>
            <div>
                <h5 className="text-sm font-semibold text-center text-medium-text">Test Score Trend</h5>
                <div className="h-20">
                     <SparkLineChart data={student.testScoreHistory.slice(-6)} dataKey="value" />
                </div>
            </div>
        </div>

        <div>
            <h4 className="font-semibold text-medium-text mb-2">AI-Generated Counseling Message</h4>
             <div className="relative">
                <textarea 
                    value={isLoadingMessage ? 'Generating message...' : message} 
                    readOnly={isLoadingMessage}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 p-2 border border-slate-300 rounded-md text-sm bg-slate-50 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                />
                 <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-1.5 bg-slate-200 hover:bg-slate-300 rounded">
                    {copySuccess ? <span className="text-xs font-bold text-brand-blue">{copySuccess}</span> : <ClipboardIcon />}
                 </button>
                 {isLoadingMessage && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>}
             </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

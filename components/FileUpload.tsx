
import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onDataLoaded: (attendance: any[], tests: any[], fees: any[]) => void;
  onLoadSampleData: () => void;
  isLoading: boolean;
}

const FileInput: React.FC<{
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}> = ({ id, label, file, onFileChange }) => (
  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
    <label htmlFor={id} className="cursor-pointer">
      <div className="flex flex-col items-center">
        <UploadIcon className="w-10 h-10 text-slate-400 mb-2" />
        <span className="text-brand-blue font-semibold">{label}</span>
        <span className="text-sm text-slate-500 mt-1">
          {file ? file.name : 'Drag & drop or click to upload'}
        </span>
      </div>
      <input
        id={id}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
      />
    </label>
  </div>
);

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, onLoadSampleData, isLoading }) => {
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);
  const [testsFile, setTestsFile] = useState<File | null>(null);
  const [feesFile, setFeesFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const parseFile = <T,>(file: File): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
            if (results.errors.length) {
                reject(new Error(`Error parsing ${file.name}: ${results.errors[0].message}`));
            } else {
                resolve(results.data as T[]);
            }
        },
        error: (err) => reject(err),
      });
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!attendanceFile || !testsFile || !feesFile) {
      setError('Please upload all three required CSV files.');
      return;
    }
    setError('');

    try {
      const attendanceData = await parseFile(attendanceFile);
      const testsData = await parseFile(testsFile);
      const feesData = await parseFile(feesFile);
      onDataLoaded(attendanceData, testsData, feesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during file parsing.');
    }
  }, [attendanceFile, testsFile, feesFile, onDataLoaded]);
  
  const allFilesUploaded = attendanceFile && testsFile && feesFile;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-dark-text mb-2">Upload Your Data</h2>
      <p className="text-medium-text mb-6">Provide attendance, test scores, and fee status CSVs to begin.</p>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FileInput id="attendance-file" label="Attendance Data" file={attendanceFile} onFileChange={setAttendanceFile} />
        <FileInput id="tests-file" label="Test Scores" file={testsFile} onFileChange={setTestsFile} />
        <FileInput id="fees-file" label="Fee Status" file={feesFile} onFileChange={setFeesFile} />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={!allFilesUploaded || isLoading}
          className="w-full sm:w-auto flex-grow bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Analyze Student Data'}
        </button>
        <div className="text-center text-slate-500">or</div>
        <button
          onClick={onLoadSampleData}
          disabled={isLoading}
          className="w-full sm:w-auto bg-slate-100 text-brand-blue font-bold py-3 px-6 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors duration-300"
        >
          Use Sample Data
        </button>
      </div>
    </div>
  );
};

export default FileUpload;


import React from 'react';
import { AppSettings } from '../types';
import { SettingsIcon, BrainCircuitIcon } from './icons/SidebarIcons';

interface SidebarProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const ToggleSwitch: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  description: string;
}> = ({ label, enabled, onChange, description }) => (
    <div>
        <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-100">{label}</span>
            <button
                type="button"
                className={`${
                enabled ? 'bg-brand-green' : 'bg-slate-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-gray-800`}
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
            >
                <span
                aria-hidden="true"
                className={`${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
);


const Sidebar: React.FC<SidebarProps> = ({ settings, onSettingsChange }) => {
  return (
    <aside className="w-64 bg-slate-800 text-white p-6 hidden lg:flex flex-col space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <BrainCircuitIcon className="w-8 h-8 mr-2 text-brand-yellow" />
          <span>EduWarn AI</span>
        </h1>
      </div>

      <div className="flex-grow space-y-6">
          <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center"><SettingsIcon className="w-4 h-4 mr-2" />Settings</h2>
              <ToggleSwitch
                  label="AI Anomaly Detection"
                  enabled={settings.useMLAnomaly}
                  onChange={(value) => onSettingsChange({ ...settings, useMLAnomaly: value })}
                  description="Use Gemini AI to detect unusual patterns in student data."
              />
          </div>
      </div>

       <div className="text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} EduWarn AI</p>
        <p>Supporting educators with data.</p>
      </div>
    </aside>
  );
};

export default Sidebar;

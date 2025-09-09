
import React from 'react';

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group bg-white p-4 rounded-lg shadow-sm border border-slate-200">
    <summary className="font-semibold cursor-pointer text-dark-text list-none flex justify-between items-center">
      {title}
      <span className="group-open:rotate-90 transition-transform duration-200">▶</span>
    </summary>
    <div className="mt-4 text-medium-text space-y-2 text-sm">
      {children}
    </div>
  </details>
);

const InfoPanel: React.FC = () => {
  return (
    <div className="mt-12">
        <h2 className="text-2xl font-bold text-dark-text mb-4">Learn More</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoSection title="How Risk Scores Are Calculated">
                <p>The student risk score (0-100) is a composite metric designed to provide a quick overview of a student's potential challenges. It is calculated as follows:</p>
                <ul className="list-disc list-inside pl-4">
                    <li><strong>40% - Attendance:</strong> Based on the student's average attendance percentage. Lower attendance results in a higher risk contribution.</li>
                    <li><strong>40% - Test Scores:</strong> Based on the student's average test score. Lower scores result in a higher risk contribution.</li>
                    <li><strong>20% - Fee Status:</strong> A binary factor. If fees are currently due, this portion contributes the full 20 points to the risk score.</li>
                </ul>
                <p className="mt-2"><strong>AI Anomaly Detection:</strong> If enabled, student data is sent to the Gemini AI model. If an anomaly is detected (e.g., a sudden drop in performance), the total risk score is increased by 20% to flag the student for immediate review.</p>
            </InfoSection>

            <InfoSection title="Privacy & Ethics">
                <p>This tool is intended for educational support and should be used responsibly. All data processing happens locally in your browser.</p>
                <ul className="list-disc list-inside pl-4">
                    <li><strong>Data Privacy:</strong> CSV data is not uploaded to any server. When AI features are used, only anonymized, aggregated data points for a single student are sent to the Gemini API for analysis.</li>
                    <li><strong>Ethical Use:</strong> Risk scores are indicators, not definitive judgments. They should be used to start conversations and provide support, not for punitive measures. Always consider the individual student's context.</li>
                    <li><strong>Bias Awareness:</strong> AI models can reflect existing biases. Educators should use their professional judgment to interpret the AI's suggestions and analysis.</li>
                </ul>
            </InfoSection>
        </div>
    </div>
  );
};

export default InfoPanel;

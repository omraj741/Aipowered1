import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileCode2, ListChecks } from 'lucide-react';

interface GenerationSummary {
  url: string;
  elementCounts: Record<string, number>;
  totalElements: number;
  framework: string;
  generatedTestsApprox: number;
  logs: string[];
}

const TestGenerationPanel: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<GenerationSummary | null>(null);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onCompleted = (e: Event) => {
      const ce = e as CustomEvent;
      const payload = ce.detail;
      if (!payload?.success) {
        setError(payload?.message || 'Generation failed');
        setIsGenerating(false);
        return;
      }
      setSummary(payload.data.summary);
      setCode(payload.data.code);
      setIsGenerating(false);
      setError(null);
    };

    const onStart = () => setIsGenerating(true);

    window.addEventListener('test-generation:completed' as any, onCompleted as any);
    window.addEventListener('test-generation:started' as any, onStart as any);
    return () => {
      window.removeEventListener('test-generation:completed' as any, onCompleted as any);
      window.removeEventListener('test-generation:started' as any, onStart as any);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ListChecks className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Tests</h3>
        </div>
        {isGenerating && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-error-600 dark:text-error-400 mb-3">{error}</div>
      )}

      {summary ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="URL" value={summary.url} mono />
            <Stat label="Elements" value={String(summary.totalElements)} />
            <Stat label="Tests (approx)" value={String(summary.generatedTestsApprox)} />
            <Stat label="Framework" value={summary.framework} />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Element coverage</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.elementCounts).map(([k, v]) => (
                <span key={k} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {k}: {v}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FileCode2 className="h-4 w-4 mr-1" /> Code
            </h4>
            <pre className="max-h-64 overflow-auto text-xs bg-gray-900 text-gray-100 p-3 rounded">
{code}
            </pre>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logs</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1 max-h-40 overflow-auto">
              {summary.logs.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">Paste a URL and run to generate tests.</div>
      )}
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="p-3 rounded border border-gray-200 dark:border-gray-700">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`text-sm font-medium ${mono ? 'font-mono break-all' : ''} text-gray-900 dark:text-white`}>{value}</p>
  </div>
);

export default TestGenerationPanel;



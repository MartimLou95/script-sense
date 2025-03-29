import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ScriptContent, scriptService } from '../services/scriptService';

interface ScriptViewerProps {
  script: ScriptContent;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ script }) => {
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await scriptService.analyzeScript(script, question);
      setAnalysis(response);
    } catch (error) {
      console.error('Error analyzing script:', error);
      setAnalysis('Sorry, there was an error analyzing the script. Please try again.');
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{script.title}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {script.metadata.genre?.map((genre, index) => (
            <span key={index} className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
              {genre}
            </span>
          ))}
        </div>
        <p className="text-gray-400 text-sm">
          Written by {script.metadata.writer} • {script.metadata.year}
        </p>
      </div>

      {/* Script Content */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Script Content</h3>
        <div className="bg-slate-700 rounded-lg p-4">
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
            {script.content}
          </pre>
        </div>
      </div>

      {/* AI Analysis */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Ask AI About This Script</h3>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How does the character development work in this script?"
              className="w-full pl-4 pr-12 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {analysis && (
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { Star, X, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Script } from '../types/script';
import { ScriptContent, scriptService } from '../services/scriptService';
import { ScriptViewer } from './ScriptViewer';

interface ScriptDetailProps {
  script: Script;
  onClose: () => void;
  onRate: (rating: number) => void;
}

export const ScriptDetail: React.FC<ScriptDetailProps> = ({ script, onClose, onRate }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [scriptContent, setScriptContent] = useState<ScriptContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScript = async () => {
      try {
        setIsLoading(true);
        const content = await scriptService.fetchScript(script.title);
        if (content) {
          setScriptContent(content);
        } else {
          setError('Could not fetch script content. Please try again later.');
        }
      } catch (err) {
        setError('An error occurred while fetching the script. Please try again later.');
        console.error('Error fetching script:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScript();
  }, [script.title]);

  const handleRate = (rating: number) => {
    setUserRating(rating);
    onRate(rating);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : scriptContent ? (
            <ScriptViewer script={scriptContent} />
          ) : null}
        </div>
      </div>
    </div>
  );
}; 
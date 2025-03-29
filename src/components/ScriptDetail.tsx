import React, { useState } from 'react';
import { Star, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Script } from '../types/script';

interface ScriptDetailProps {
  script: Script;
  onClose: () => void;
  onRate: (rating: number) => void;
}

export const ScriptDetail: React.FC<ScriptDetailProps> = ({ script, onClose, onRate }) => {
  const [userRating, setUserRating] = useState<number | null>(null);

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
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
          
          <img 
            src={script.image} 
            alt={script.title} 
            className="w-full h-96 object-cover"
          />
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{script.title}</h1>
            <p className="text-gray-400 mb-4">{script.writer} • {script.year}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-white ml-1 text-xl">{script.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">({script.ratingCount} ratings)</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {script.genre.map((g, index) => (
                <span key={index} className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 mb-6">{script.description}</p>

            <div className="border-t border-slate-700 pt-6">
              <h2 className="text-xl font-bold text-white mb-4">Rate this Script</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleRate(1)}
                  className={`p-2 rounded-full ${userRating === 1 ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <ThumbsUp className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={() => handleRate(0)}
                  className={`p-2 rounded-full ${userRating === 0 ? 'bg-red-500' : 'bg-slate-700'}`}
                >
                  <ThumbsDown className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
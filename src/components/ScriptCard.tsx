import React from 'react';
import { Star } from 'lucide-react';
import { Script } from '../types/script';

interface ScriptCardProps {
  script: Script;
  onClick?: () => void;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, onClick }) => {
  return (
    <div 
      className="bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-200 cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={script.image} 
        alt={script.title} 
        className="w-full h-72 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{script.title}</h3>
        <p className="text-gray-400 text-sm mb-2">{script.writer}</p>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white ml-1">{script.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400 text-sm">({script.ratingCount} ratings)</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {script.genre.map((g, index) => (
            <span key={index} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}; 
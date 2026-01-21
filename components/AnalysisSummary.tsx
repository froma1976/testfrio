
import React from 'react';
import { ListChecks, LayoutGrid } from 'lucide-react';
import { AnalysisResult } from '../types';

interface Props {
  results: AnalysisResult[];
}

const AnalysisSummary: React.FC<Props> = ({ results }) => {
  return (
    <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <LayoutGrid size={120} />
      </div>
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <ListChecks size={24} className="text-gray-900" />
        </div>
        <h2 className="text-2xl font-bold italic tracking-tight">RESUMEN DE RESPUESTAS</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
        {results.map((res, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all hover:scale-105"
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">P{idx + 1}</span>
            <span className="text-3xl font-black text-green-400 uppercase leading-none">{res.correctOption}</span>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 16 - results.length) }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="flex flex-col items-center bg-black/20 rounded-2xl p-4 border border-dashed border-white/5 opacity-30"
            >
               <span className="text-xs font-bold text-gray-600 mb-1">P{results.length + i + 1}</span>
               <span className="text-2xl font-black text-gray-700">-</span>
            </div>
        ))}
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
        <span>Basado en Reglamento F-Gas 2024 y RD 115/2017</span>
      </div>
    </div>
  );
};

export default AnalysisSummary;


import React from 'react';
import { CheckCircle, AlertCircle, BookOpen, Scale } from 'lucide-react';
import { AnalysisResult } from '../types';

interface Props {
  results: AnalysisResult[];
}

const QuestionResults: React.FC<Props> = ({ results }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="text-green-500 w-8 h-8" />
        <h2 className="text-2xl font-bold text-gray-800">Resultados del Análisis</h2>
      </div>

      {results.map((item, index) => (
        <div key={index} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-6">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </span>
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">
              {item.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {item.options.map((opt) => (
              <div 
                key={opt.label}
                className={`p-4 rounded-xl border-2 transition-all ${
                  opt.label.toLowerCase() === item.correctOption.toLowerCase()
                    ? 'bg-green-50 border-green-400 text-green-900 shadow-sm'
                    : 'bg-gray-50 border-gray-100 text-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-lg uppercase">{opt.label})</span>
                  <p className="text-md">{opt.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
                <AlertCircle size={18} />
                <span>Justificación Técnica</span>
              </div>
              <p className="text-blue-900 leading-relaxed italic">
                "{item.justification}"
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                <Scale size={14} className="text-gray-500" />
                <span>Ref: {item.regulationReference}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-sm font-medium text-indigo-700 border border-indigo-100">
                <BookOpen size={14} />
                <span>Validado por Gemini 3 Pro</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionResults;


import React, { useState } from 'react';
import { Book, ChevronRight, Loader2, Award, Info, BookOpenCheck } from 'lucide-react';
import { generateTopicSummary } from '../services/topicService';

const TOPICS = [
  { id: 1, title: "Termodinámica y Ciclo de Refrigeración", icon: "🌡️" },
  { id: 2, title: "Componentes: Compresores, Condensadores y Evaporadores", icon: "⚙️" },
  { id: 3, title: "Refrigerantes: Clasificación, PCA (GWP) y Sustitutos", icon: "🧪" },
  { id: 4, title: "Reglamento F-Gas 2024 (UE 573/2024)", icon: "⚖️" },
  { id: 5, title: "Detección de Fugas y Recuperación de Gas", icon: "🔍" },
  { id: 6, title: "Lubricantes y Compatibilidad con Gases", icon: "🛢️" },
  { id: 7, title: "Instalación, Puesta en Marcha y Mantenimiento", icon: "🛠️" },
  { id: 8, title: "Eficiencia Energética y TEWI", icon: "⚡" },
];

const TopicSummary: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<typeof TOPICS[0] | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async (topic: typeof TOPICS[0]) => {
    setSelectedTopic(topic);
    setSummary(null);
    setError(null);
    setIsLoading(true);
    try {
      const result = await generateTopicSummary(topic.id, topic.title);
      setSummary(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => fetchSummary(topic)}
            disabled={isLoading}
            className={`
              p-6 rounded-3xl border text-left transition-all group relative overflow-hidden
              ${selectedTopic?.id === topic.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md text-gray-800'}
            `}
          >
            <div className="text-3xl mb-4">{topic.icon}</div>
            <h3 className="font-bold leading-tight mb-2 pr-6">
              Tema {topic.id}: {topic.title}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter opacity-60">
              Solicitar Resumen <ChevronRight size={10} />
            </div>
            {selectedTopic?.id === topic.id && isLoading && (
              <div className="absolute top-4 right-4 animate-spin">
                <Loader2 size={20} />
              </div>
            )}
          </button>
        ))}
      </div>

      {isLoading && !summary && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-blue-50 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-blue-600 font-bold animate-pulse">Generando resumen experto por IA...</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-700 flex items-center gap-3">
          <Award size={24} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {summary && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BookOpenCheck size={28} />
              <span className="text-xs font-black uppercase tracking-widest opacity-80">Manual del Experto</span>
            </div>
            <h2 className="text-3xl font-black italic">
              Tema {selectedTopic?.id}: {selectedTopic?.title}
            </h2>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-4">
              {summary.split('\n').map((line, i) => {
                if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4 border-l-4 border-blue-500 pl-4 uppercase tracking-tight">{line.replace('###', '').trim()}</h3>;
                if (line.startsWith('##')) return <h2 key={i} className="text-2xl font-black text-blue-800 mt-10 mb-6">{line.replace('##', '').trim()}</h2>;
                if (line.startsWith('-') || line.startsWith('*')) return <div key={i} className="flex gap-3 ml-2 items-start text-lg"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div><p>{line.substring(1).trim()}</p></div>;
                return <p key={i} className="text-lg whitespace-pre-wrap">{line}</p>;
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50 flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
                  <Award size={16} />
                  <span>Validado para Examen Industria</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
                  <Info size={16} />
                  <span>Actualizado F-Gas 2024</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSummary;

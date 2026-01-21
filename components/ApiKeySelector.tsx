
import React from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface Props {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<Props> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    onKeySelected();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-2xl shadow-xl border border-blue-100 max-w-2xl mx-auto mt-12 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Key className="text-blue-600 w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Configuración de Acceso</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Para utilizar el modelo de alta calidad <strong>Gemini 3 Pro</strong>, 
        necesitas seleccionar tu propia clave de API vinculada a un proyecto de facturación de GCP.
      </p>
      
      <button
        onClick={handleSelectKey}
        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95 mb-6"
      >
        Seleccionar Clave de API
      </button>

      <a 
        href="https://ai.google.dev/gemini-api/docs/billing" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4"
      >
        Ver documentación sobre facturación <ExternalLink size={14} />
      </a>
    </div>
  );
};

export default ApiKeySelector;

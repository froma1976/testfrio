
import React, { useState, useEffect, useCallback } from 'react';
import { Thermometer, Zap, ShieldCheck, Loader2, AlertTriangle, RefreshCw, PlusCircle, LayoutDashboard } from 'lucide-react';
import FileUpload from './components/FileUpload';
import QuestionResults from './components/QuestionResults';
import AnalysisSummary from './components/AnalysisSummary';
import ApiKeySelector from './components/ApiKeySelector';
import { analyzeTestImages } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    images: [],
    result: null,
    error: null,
    hasApiKey: false
  });

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setState(prev => ({ ...prev, hasApiKey: hasKey }));
    };
    checkKey();
  }, []);

  const handleImageAdded = useCallback((base64: string) => {
    setState(prev => {
      if (prev.images.length >= 16) return prev;
      return { 
        ...prev, 
        images: [...prev.images, base64], 
        result: null, 
        error: null 
      };
    });
  }, []);

  const removeImage = (index: number) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      result: null
    }));
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (state.isAnalyzing) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              handleImageAdded(reader.result as string);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [state.isAnalyzing, handleImageAdded]);

  const handleAnalyze = async () => {
    if (state.images.length === 0) return;

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const results = await analyzeTestImages(state.images);
      setState(prev => ({ ...prev, isAnalyzing: false, result: results }));
    } catch (err: any) {
      if (err.message === 'API_KEY_INVALID') {
        setState(prev => ({ ...prev, isAnalyzing: false, hasApiKey: false }));
      } else {
        setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
      }
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, images: [], result: null, error: null }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!state.hasApiKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <ApiKeySelector onKeySelected={() => setState(prev => ({ ...prev, hasApiKey: true }))} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-blue-200 shadow-lg">
              <Thermometer className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                RefriTest AI
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase text-left">Expert Assistant</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <ShieldCheck size={16} />
              <span>Regulaciones 2024</span>
            </div>
            {state.images.length > 0 && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold transition-colors text-sm"
              >
                <RefreshCw size={16} />
                Limpiar todo
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {!state.result && (
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Análisis Multi-Captura
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Sube las capturas de tus 16 preguntas (pegando una a una con <strong>Ctrl+V</strong>) y analízalas todas juntas.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {state.result && <AnalysisSummary results={state.result} />}

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
            {!state.result ? (
              <div className="space-y-8">
                <FileUpload 
                  onImageAdded={handleImageAdded} 
                  images={state.images}
                  onRemoveImage={removeImage}
                  disabled={state.isAnalyzing}
                />
                
                {state.error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
                    <AlertTriangle size={20} />
                    <p className="font-medium">{state.error}</p>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={state.images.length === 0 || state.isAnalyzing}
                  className={`
                    w-full py-6 rounded-2xl text-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-tight
                    ${state.images.length > 0 && !state.isAnalyzing 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 hover:scale-[1.01]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  {state.isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Procesando {state.images.length} capturas...
                    </>
                  ) : (
                    <>
                      <Zap className={state.images.length > 0 ? 'animate-pulse' : ''} />
                      Enviar {state.images.length} capturas a la vez
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex justify-between items-center px-2">
                   <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-6 py-3 rounded-full transition-colors border border-blue-100"
                  >
                    <PlusCircle size={20} />
                    Comenzar nuevo análisis
                  </button>
                </div>
                
                <QuestionResults results={state.result} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 border border-gray-800">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-bold tracking-tight">Análisis Masivo con Gemini 3 Pro</span>
      </div>
    </div>
  );
};

export default App;


import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X, Keyboard, Plus } from 'lucide-react';

interface Props {
  onImageAdded: (base64: string) => void;
  images: string[];
  onRemoveImage: (index: number) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<Props> = ({ onImageAdded, images, onRemoveImage, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageAdded(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Grid of Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
              <img src={img} alt={`Captura ${idx + 1}`} className="w-full h-full object-cover" />
              {!disabled && (
                <button
                  onClick={() => onRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 font-bold text-center">
                #{idx + 1}
              </div>
            </div>
          ))}
          {images.length < 16 && !disabled && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex flex-col items-center justify-center text-blue-500 hover:bg-blue-100 hover:border-blue-300 transition-all"
            >
              <Plus size={24} />
              <span className="text-[10px] font-bold uppercase mt-1">Añadir</span>
            </button>
          )}
        </div>
      )}

      {/* Main Upload Area (Hidden when many images exist or simplified) */}
      {images.length === 0 ? (
        <label className={`
          flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl 
          transition-all cursor-pointer bg-gray-50 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 border-blue-200 hover:border-blue-400'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <p className="mb-2 text-xl font-bold text-gray-800">Sube la primera captura</p>
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-semibold">o</p>
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
              <Keyboard size={20} className="text-blue-500" />
              <span className="text-gray-700 font-medium">Pulsa <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-900 border border-gray-300 font-mono text-sm">Ctrl + V</kbd> para pegar</span>
            </div>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            ref={fileInputRef}
          />
        </label>
      ) : (
        <div className="text-center py-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">
            <Keyboard size={16} />
            <span>Sigue pegando (<kbd className="bg-white px-1.5 rounded border border-blue-200">Ctrl+V</kbd>) para añadir más (Máx. 16)</span>
          </div>
        </div>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
    </div>
  );
};

export default FileUpload;


import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Circle } from 'lucide-react';

interface Props {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<Props> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setIsReady(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Asegúrate de dar permisos.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/png');
      onCapture(base64);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
            <X size={48} className="text-red-500 mb-4" />
            <p className="text-lg font-bold mb-4">{error}</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute top-4 right-4">
              <button 
                onClick={onClose}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all backdrop-blur-md"
              >
                <X size={24} />
              </button>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
              <button
                onClick={capturePhoto}
                disabled={!isReady}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <div className="w-16 h-16 border-4 border-black/5 rounded-full flex items-center justify-center">
                   <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
      <div className="mt-8 text-white/60 text-sm font-medium flex items-center gap-2">
        <Camera size={16} />
        <span>Enfoca la pregunta y pulsa el botón</span>
      </div>
    </div>
  );
};

export default CameraCapture;

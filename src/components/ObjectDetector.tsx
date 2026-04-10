import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Search, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { translate as t } from '../lib/i18n';

interface ObjectDetectorProps {
  targetObject: string;
  onMatch: () => void;
  onFallback: () => void;
}

export const ObjectDetector: React.FC<ObjectDetectorProps> = ({ targetObject, onMatch, onFallback }) => {
  const { settings } = useSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastDetection, setLastDetection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<'IDLE' | 'MATCHED' | 'FAILED'>('IDLE');

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load model:", err);
        setError("AI Model loading failed. You can still use the fallback button.");
      }
    };
    loadModel();

    // Setup Camera
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        }
      } catch (err) {
        setError("Camera access denied. Please enable your camera.");
      }
    };
    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!model || !videoRef.current) return;

    setIsDetecting(true);
    setMatchingStatus('IDLE');

    try {
      const predictions = await model.detect(videoRef.current);
      setIsDetecting(false);

      if (predictions.length > 0) {
        const objects = predictions.map(p => p.class.toLowerCase());
        setLastDetection(objects.join(', '));

        // Check if target is in the detected objects
        if (objects.includes(targetObject.toLowerCase())) {
          setMatchingStatus('MATCHED');
          setLastDetection(null); // Clear last detection on success
          setTimeout(() => onMatch(), 1500);
        } else {
          setMatchingStatus('FAILED');
          // Auto-dimiss fail status after 2 seconds
          setTimeout(() => setMatchingStatus('IDLE'), 2000);
        }
      } else {
        setLastDetection("Nothing detected");
        setMatchingStatus('FAILED');
        setTimeout(() => setMatchingStatus('IDLE'), 2000);
      }
    } catch (err) {
      setIsDetecting(false);
      setError("Detection error. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-6 bg-white rounded-[3rem] shadow-2xl border-4 border-purple-100 mt-4">
      <div className="relative w-full aspect-video bg-gray-950 rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {!isCameraReady && !error && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <RefreshCw size={48} className="text-purple-400" />
            </motion.div>
            <p className="mt-4 font-black text-xl">Waking up Camera...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white p-8 text-center">
            <AlertCircle size={64} className="mb-4 text-red-400 animate-bounce" />
            <p className="font-black text-2xl mb-2">Camera Error</p>
            <p className="opacity-80">{error}</p>
          </div>
        )}

        {/* Overlay scanning effect */}
        {isDetecting && (
          <motion.div 
            initial={{ top: -10 }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-purple-500 shadow-[0_0_20px_#A78BFA] z-20"
          />
        )}

        {/* Detection feedback */}
        <AnimatePresence>
          {matchingStatus !== 'IDLE' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => matchingStatus === 'FAILED' && setMatchingStatus('IDLE')}
              className={`absolute inset-0 flex items-center justify-center z-30 ${matchingStatus === 'FAILED' ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'} bg-black/40 backdrop-blur-sm`}
            >
              <div className={`p-8 rounded-[3rem] flex flex-col items-center gap-4 ${matchingStatus === 'MATCHED' ? 'bg-emerald-500' : 'bg-red-500'} text-white shadow-2xl`}>
                {matchingStatus === 'MATCHED' ? <Check size={80} strokeWidth={4} /> : <AlertCircle size={80} strokeWidth={4} />}
                <p className="text-4xl font-black">{matchingStatus === 'MATCHED' ? t('FOUND IT!', settings?.language) : t('TRY AGAIN', settings?.language)}</p>
                {matchingStatus === 'FAILED' && <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{t('Tap to dismiss', settings?.language)}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2 border border-white/20">
          <div className={`w-2 h-2 rounded-full ${model ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
          {model ? t('Smart AI Active', settings?.language) : t('Loading AI Engine...', settings?.language)}
        </div>
      </div>

      <div className="flex flex-col items-center text-center w-full px-4">
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">{t('Scan for:', settings?.language)}</p>
        <h3 className="text-4xl font-black text-purple-600 mb-8 uppercase tracking-tighter ring-purple-100 ring-8 px-8 py-2 rounded-full">
          {t(targetObject, settings?.language)}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCapture}
            disabled={!model || isDetecting || matchingStatus === 'MATCHED'}
            className={`flex items-center justify-center gap-4 px-8 py-6 rounded-[2rem] text-2xl font-black border-b-[8px] transition-all shadow-xl
              ${isDetecting ? 'bg-gray-400 border-gray-600 cursor-wait' : 'bg-purple-600 border-purple-800 text-white active:translate-y-2 active:border-b-0'}
              ${matchingStatus === 'MATCHED' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isDetecting ? <RefreshCw className="animate-spin" /> : <Camera size={32} />}
            {isDetecting ? t('SENSING...', settings?.language) : `📷 ${t('CAPTURE', settings?.language)}`}
          </motion.button>

          <button
            onClick={onFallback}
            className="flex items-center justify-center gap-4 bg-white border-4 border-gray-100 text-gray-400 px-8 py-6 rounded-[2rem] text-xl font-bold transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <Check size={28} /> {t('I FOUND IT', settings?.language)}
          </button>
        </div>

        {lastDetection && !isDetecting && (
          <p className="mt-6 text-red-500 font-bold bg-red-50 px-6 py-2 rounded-full border border-red-100">
            {t("I saw:", settings?.language)} <span className="font-black">"{t(lastDetection, settings?.language)}"</span> - {t("Hint: Make sure it's in the light!", settings?.language)}
          </p>
        )}
      </div>
    </div>
  );
};

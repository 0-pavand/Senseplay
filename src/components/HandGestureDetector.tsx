import React, { useRef, useEffect, useState } from 'react';
import { Hands, Results, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { motion, AnimatePresence } from 'motion/react';
import { Camera as CameraIcon, Check, AlertCircle, Waves, Circle, Scissors, Zap, Activity } from 'lucide-react';

interface HandGestureDetectorProps {
  expectedGesture: string; // 'HELLO' | 'YES' | 'PEACE'
  onMatch: () => void;
  onFallback: () => void;
}

export const HandGestureDetector: React.FC<HandGestureDetectorProps> = ({ expectedGesture, onMatch, onFallback }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchProgress, setMatchProgress] = useState(0);
  const matchDuration = 1200;
  const matchStartTime = useRef<number | null>(null);
  // Use refs so the effect never needs to re-run when these change
  const onMatchRef = useRef(onMatch);
  const onFallbackRef = useRef(onFallback);
  const expectedGestureRef = useRef(expectedGesture);
  useEffect(() => { onMatchRef.current = onMatch; }, [onMatch]);
  useEffect(() => { onFallbackRef.current = onFallback; }, [onFallback]);
  useEffect(() => { expectedGestureRef.current = expectedGesture; }, [expectedGesture]);

  useEffect(() => {
    let camera: any = null;
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: Results) => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const canvasCtx = canvasRef.current.getContext('2d');
      if (!canvasCtx) return;

      try {

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Mirror the video
      canvasCtx.translate(canvasRef.current.width, 0);
      canvasCtx.scale(-1, 1);
      
      // Draw landmarks if visible
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        const gesture = analyzeGesture(landmarks);
        setDetectedGesture(gesture);

        if (gesture === expectedGestureRef.current) {
          if (!matchStartTime.current) {
            matchStartTime.current = Date.now();
          } else {
            const elapsed = Date.now() - matchStartTime.current;
            const progress = Math.min((elapsed / matchDuration) * 100, 100);
            setMatchProgress(progress);
            if (progress >= 100) {
              onMatchRef.current();
              matchStartTime.current = null;
            }
          }
        } else {
          matchStartTime.current = null;
          setMatchProgress(0);
        }

        // Draw enhanced glowing landmarks
        canvasCtx.shadowBlur = 15;
        canvasCtx.shadowColor = gesture === expectedGestureRef.current ? '#4ADE80' : '#A78BFA';
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { 
          color: gesture === expectedGestureRef.current ? '#34D399' : '#8B5CF6', 
          lineWidth: 8 
        });
        canvasCtx.shadowBlur = 0;
        drawLandmarks(canvasCtx, landmarks, { 
          color: '#FFFFFF', 
          lineWidth: 2,
          radius: 5
        });

      } else {
        setDetectedGesture(null);
        matchStartTime.current = null;
        setMatchProgress(0);
      }
      canvasCtx.restore();
      } catch (e) {
        console.warn('HandGestureDetector drawing error:', e);
      }
    });

    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start().then(() => setIsCameraReady(true)).catch((err: any) => {
        setError("Camera access denied. Please enable it in browser settings.");
      });
    }

    return () => {
      if (camera) camera.stop();
      hands.close();
    };
  }, []); // Empty deps — camera is initialized once, refs keep callbacks fresh

  const analyzeGesture = (landmarks: any[]) => {
    // 0: Wrist, 4: Thumb Tip, 8: Index Tip, 12: Middle Tip, 16: Ring Tip, 20: Pinky Tip
    // MCPs: 5: Index, 9: Middle, 13: Ring, 17: Pinky
    
    const isFingerExtended = (tipIdx: number, mcpIdx: number) => {
      return landmarks[tipIdx].y < landmarks[mcpIdx].y;
    };

    const indexExtended = isFingerExtended(8, 5);
    const middleExtended = isFingerExtended(12, 9);
    const ringExtended = isFingerExtended(16, 13);
    const pinkyExtended = isFingerExtended(20, 17);
    
    // Simple logic for Thumb (depends on hand orientation, but let's say tip is far from palm)
    const thumbExtended = Math.abs(landmarks[4].x - landmarks[13].x) > 0.1;

    // HELLO: All extended
    if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
      return 'HELLO';
    }
    
    // PEACE: Index and Middle extended, others curled
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      return 'PEACE';
    }

    // YES: All curled (Fist)
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return 'YES';
    }

    return 'UNKNOWN';
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-6 bg-white rounded-[3rem] shadow-2xl border-4 border-blue-50">
      <div className="relative w-full aspect-video bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center group">
        {!isCameraReady && !error && (
          <div className="flex flex-col items-center text-white z-10">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Activity size={64} className="text-blue-400 mb-4" />
            </motion.div>
            <p className="font-black text-xl tracking-tighter">AI SCANNER WARMING UP...</p>
          </div>
        )}
        
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-60"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          width={640}
          height={480}
        />

        {/* HUD Overlay */}
        <div className="absolute inset-0 border-[16px] border-white/5 pointer-events-none z-20" />
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl text-white text-xs font-black flex items-center gap-3 border border-white/10 shadow-xl">
            <div className={`w-2.5 h-2.5 rounded-full ${isCameraReady ? 'bg-green-500 shadow-[0_0_10px_#4ADE80]' : 'bg-red-500'}`} />
            SIGN ANALYZER V2.0
          </div>
        </div>

        {/* Target Graphic */}
        <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-20">
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-white/60 tracking-widest uppercase">Target Goal</p>
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ring-blue-500/20">
              {expectedGesture === 'HELLO' ? <Waves size={32} /> : expectedGesture === 'YES' ? <Circle size={32} /> : <Scissors size={32} />}
            </div>
            <p className="text-xs font-black text-white uppercase italic tracking-tighter">{expectedGesture}</p>
          </div>
        </div>

        {/* Stability Progress Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-md z-20">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${matchProgress}%` }}
             className={`h-full ${matchProgress >= 100 ? 'bg-green-500' : 'bg-blue-400'} shadow-[0_0_15px_rgba(52,211,153,0.5)]`}
           />
        </div>

        {error && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-md text-white p-8 text-center italic">
            <AlertCircle size={64} className="text-red-400 mb-4 animate-pulse" />
            <p className="font-black text-2xl mb-2">SCANNER OFFLINE</p>
            <p className="opacity-70 text-sm max-w-[200px]">{error}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center text-center w-full">
        <div className="mb-6">
          <h3 className="text-3xl font-black text-gray-800 tracking-tighter uppercase mb-1">Hold the Sign!</h3>
          <p className="text-blue-500 font-bold flex items-center gap-2 justify-center">
            <Zap size={18} />
            Show the <span className="bg-blue-100 px-3 py-0.5 rounded-lg text-blue-700">{expectedGesture}</span> gesture to the camera
          </p>
        </div>
        
        <button
          onClick={onFallback}
          className="flex items-center gap-3 bg-slate-50 hover:bg-white text-slate-400 px-10 py-4 rounded-full font-black tracking-tight border-b-4 border-slate-100 active:border-b-0 active:translate-y-1 transition-all"
        >
          <Check size={20} /> I DID IT MANUALLY
        </button>
      </div>

      <AnimatePresence>
        {detectedGesture && detectedGesture !== 'UNKNOWN' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
          >
            <div className={`px-12 py-6 rounded-[2.5rem] font-black text-5xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md border-b-[12px]
              ${detectedGesture === expectedGesture ? 'bg-green-500/90 border-green-700 text-white' : 'bg-purple-500/90 border-purple-700 text-white'}
            `}>
              {detectedGesture === expectedGesture ? 'LOCKED! 🎯' : detectedGesture}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

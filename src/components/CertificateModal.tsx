import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Download } from 'lucide-react';

interface CertificateModalProps {
  gameName: string;
  gameEmoji: string;
  totalStars: number;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  gameName, gameEmoji, totalStars, onClose
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotateX: 15 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm"
        >
          {/* Certificate card */}
          <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-[6px] border-yellow-300">

            {/* Top decorative banner */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 p-4 text-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-900 opacity-80">
                Certificate of Achievement
              </p>
            </div>

            {/* Decorative corner stars */}
            {['top-14 left-4', 'top-14 right-4', 'bottom-14 left-4', 'bottom-14 right-4'].map((pos, i) => (
              <span key={i} className={`absolute ${pos} text-2xl opacity-30`}>⭐</span>
            ))}

            <div className="p-8 text-center">
              {/* Medal */}
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-5xl shadow-xl border-[4px] border-yellow-200 mb-6 relative">
                {gameEmoji}
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-9 h-9 flex items-center justify-center text-xl border-2 border-white shadow">🏆</div>
              </div>

              <p className="text-sm font-bold text-orange-700 mb-1 uppercase tracking-wider">This certifies that</p>
              <h2 className="text-4xl font-black text-gray-800 mb-2">Jamie</h2>
              <p className="text-base font-medium text-gray-600 mb-4 leading-relaxed">
                has successfully completed all levels in
              </p>
              <h3 className="text-2xl font-black text-orange-600 mb-6">{gameName}</h3>

              {/* Stars earned */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: Math.min(totalStars, 15) }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="text-xl"
                  >⭐</motion.span>
                ))}
              </div>

              <div className="bg-orange-100 rounded-2xl px-5 py-3 mb-6 inline-block">
                <p className="font-black text-orange-800 text-lg">{totalStars} Stars Earned!</p>
              </div>

              <p className="text-xs text-gray-400 font-medium">{today}</p>

              {/* Motivational quote */}
              <div className="mt-4 bg-yellow-100 rounded-2xl p-3">
                <p className="text-xs font-bold text-yellow-800 italic">
                  "Every expert was once a beginner. You are amazing! 💪"
                </p>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t border-yellow-200 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-white text-gray-600 px-4 py-3 rounded-2xl font-bold border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <X size={18} /> Close
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-2xl font-black border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Star size={18} fill="white" /> Keep Going!
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

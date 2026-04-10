import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAchievements } from '../context/AchievementContext';

export const AchievementToast = () => {
  const { newAchievement, clearNew } = useAchievements();

  useEffect(() => {
    if (!newAchievement) return;
    const t = setTimeout(clearNew, 4500);
    return () => clearTimeout(t);
  }, [newAchievement, clearNew]);

  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          initial={{ y: -120, opacity: 0, scale: 0.8 }}
          animate={{ y: 0,    opacity: 1, scale: 1 }}
          exit={{   y: -120, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={clearNew}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-sm cursor-pointer"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-b-[6px] border-orange-700 p-5 flex items-center gap-4">
            {/* Shimmer */}
            <motion.div
              animate={{ x: ['−100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] pointer-events-none"
            />
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-inner">
              {newAchievement.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-orange-100 mb-0.5">
                🎉 Achievement Unlocked!
              </p>
              <h3 className="text-xl font-black text-white leading-tight truncate">
                {newAchievement.title}
              </h3>
              <p className="text-xs text-orange-100 font-medium mt-0.5 leading-tight">
                {newAchievement.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

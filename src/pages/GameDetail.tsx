import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, Star, Play, Camera } from 'lucide-react';
import { GAMES } from '../data/games';
import { useProgress } from '../context/ProgressContext';
import { useSettings } from '../context/SettingsContext';
import { translate as t } from '../lib/i18n';

export const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { settings } = useSettings();
  
  const game = GAMES.find(g => g.id === id);
  if (!game) return <div className="p-8 text-center font-bold text-xl">Game not found</div>;
  
  const Icon = game.icon;
  const unlockedLevels = progress.unlockedLevels[game.id] || [];
  const gameStars = progress.stars[game.id] || {};
  const completedLevels = game.levels.filter((l: any) => gameStars[l.id] > 0);
  const progressPercent = Math.round((completedLevels.length / game.levels.length) * 100);

  const bgClass = settings.focusMode ? 'bg-slate-700' : game.bg;
  const borderClass = settings.focusMode ? 'border-slate-800' : game.borderBg;

  return (
    <div className="min-h-screen bg-white font-sans pb-12 selection:bg-orange-200">
      <header className="p-6 flex items-center gap-4 max-w-md mx-auto">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border-b-[4px] border-gray-200 active:border-b-0 active:translate-y-[4px] transition-all"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </motion.button>
        <h1 className="text-2xl font-black text-gray-800">{t(game.title, settings?.language)}</h1>
      </header>

      <main className="px-6 max-w-md mx-auto flex flex-col gap-6">
        <div className={`relative overflow-hidden p-8 rounded-[2rem] ${bgClass} ${borderClass} border-b-[8px] flex flex-col items-center justify-center text-white min-h-[200px]`}>
          <div className="absolute -bottom-10 -right-10 opacity-20 rotate-12 pointer-events-none focus-hide">
            <Icon size={200} />
          </div>
          <div className="relative z-10 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-b-[4px] border-black/10 mb-4">
            <Icon size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-center relative z-10 mb-4">{t("Select Level", settings?.language)}</h2>
          
          {/* Progress Section */}
          <div className="w-full max-w-xs relative z-10 bg-black/20 p-4 rounded-2xl border-b-[4px] border-black/10">
             <div className="flex justify-between items-end mb-2">
               <span className="text-white/90 font-bold text-sm">{t("Course Progress", settings?.language)}</span>
               <span className="text-lg font-black text-white">{progressPercent}%</span>
             </div>
             <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {game.levels.map((level, index) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const stars = gameStars[level.id] || 0;
            
            return (
              <motion.div
                key={level.id}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => isUnlocked && navigate(`/game/${game.id}/level/${level.id}`)}
                className={`p-6 rounded-[1.5rem] border-b-[6px] flex items-center justify-between transition-all
                  ${isUnlocked ? 'bg-white border-gray-200 cursor-pointer hover:bg-gray-50' : 'bg-gray-200 border-gray-300 opacity-70 cursor-not-allowed'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${isUnlocked ? (settings.focusMode ? 'bg-slate-700 text-white' : game.bg + ' text-white') : 'bg-gray-300 text-gray-500'}
                  `}>
                    {isUnlocked ? <Play size={20} fill="currentColor" className="ml-1" /> : <Lock size={20} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-800' : 'text-gray-500'} flex items-center gap-2`}>
                      {t(level.title, settings?.language)}
                      {(game.id === 'sign-and-play' || game.id === 'see-and-identify') && isUnlocked && (
                         <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                           <Camera size={10} /> {t("CAMERA", settings?.language)}
                         </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{t("Level", settings?.language)} {index + 1}</p>
                  </div>
                </div>
                
                {isUnlocked && (
                  <div className="flex gap-1">
                    {[1, 2, 3].map(star => (
                      <Star 
                        key={star} 
                        size={20} 
                        className={star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, PackageOpen, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useSettings } from '../context/SettingsContext';
import { PRODUCTS } from '../data/products';
import { speak } from '../lib/audio';

export const CollectionPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { settings } = useSettings();

  const unlockedProducts = PRODUCTS.filter(p => progress.unlockedProducts.includes(p.id));

  const bgClass = settings.focusMode ? 'bg-slate-900' : 'bg-white';
  const cardBgClass = settings.focusMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const textClass = settings.focusMode ? 'text-slate-100' : 'text-gray-800';
  const subTextClass = settings.focusMode ? 'text-slate-400' : 'text-gray-500';

  useEffect(() => {
    if (settings.voiceGuidance) {
      if (unlockedProducts.length === 0) {
        speak("Your collection is empty. Visit the store to unlock items.");
      } else {
        speak(`You have ${unlockedProducts.length} items in your collection.`);
      }
    }
  }, [settings.voiceGuidance, unlockedProducts.length]);

  return (
    <div className={`min-h-screen ${bgClass} font-sans pb-24`}>
      <header className="p-6 flex items-center gap-4 max-w-md mx-auto">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-b-[4px] active:border-b-0 active:translate-y-[4px] transition-all
            ${settings.focusMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-700'}
          `}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className={`text-2xl font-black ${textClass}`}>My Collection</h1>
      </header>

      <main className="px-6 max-w-md mx-auto flex flex-col gap-6">
        <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
            <Heart size={24} className="fill-blue-200" />
          </div>
          <div>
            <h2 className="text-blue-800 font-bold text-lg leading-tight mb-1">Making an Impact</h2>
            <p className="text-blue-600 text-sm font-medium">
              Every item you unlock helps you learn about tools that improve accessibility in the real world.
            </p>
          </div>
        </div>

        {unlockedProducts.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-12 text-center ${cardBgClass} rounded-[2rem] border-b-[6px] p-8`}>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <PackageOpen size={48} className="text-gray-400" />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${textClass}`}>No items yet</h3>
            <p className={`font-medium mb-8 ${subTextClass}`}>
              Play games to earn points and unlock assistive products in the store!
            </p>
            <button 
              onClick={() => navigate('/store')}
              className="w-full py-4 rounded-2xl font-black text-lg bg-blue-500 text-white border-b-[4px] border-blue-700 active:border-b-0 active:translate-y-[4px] transition-all"
            >
              Go to Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {unlockedProducts.map(product => {
              const Icon = product.icon;
              return (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-5 rounded-3xl border-b-[6px] flex flex-col items-center text-center gap-3 ${cardBgClass}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] ${product.color}`}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className={`font-black leading-tight ${textClass}`}>{product.name}</h3>
                    <p className={`text-xs font-medium mt-1 ${subTextClass} capitalize`}>{product.category} Aid</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, Star, ChevronLeft, CheckCircle2, 
  Eye, Ear, Brain, Lock, Unlock, X, Truck, MapPin, RotateCcw,
  PackageOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useSettings } from '../context/SettingsContext';
import { PRODUCTS, ProductCategory } from '../data/products';
import { speak, playSound } from '../lib/audio';

export const StorePage = () => {
  const navigate = useNavigate();
  const { progress, unlockProduct, resetStore } = useProgress();
  const { settings } = useSettings();
  
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('visual');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showRedemption, setShowRedemption] = useState(false);
  const [redemptionStep, setRedemptionStep] = useState<'form' | 'success'>('form');

  // Calculate total points (1 star = 800 points)
  let totalStars = 0;
  Object.values(progress.stars).forEach(gameStars => {
    Object.values(gameStars).forEach(stars => {
      totalStars += Math.max(0, stars);
    });
  });
  
  // Real balance in points
  const currentPoints = (totalStars * 800) - (progress.spentPoints || 0);

  const bgClass = settings.focusMode ? 'bg-slate-900' : 'bg-white';
  const cardBgClass = settings.focusMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const textClass = settings.focusMode ? 'text-slate-100' : 'text-gray-800';
  const subTextClass = settings.focusMode ? 'text-slate-400' : 'text-gray-500';

  useEffect(() => {
    if (settings.voiceGuidance) {
      speak("Welcome to the Ability Store. Use your points to unlock assistive products.");
    }
  }, [settings.voiceGuidance]);

  const handleUnlock = (productId: string, cost: number, name: string) => {
    if (currentPoints >= cost) {
      unlockProduct(productId, cost);
      setSelectedProduct(productId);
      setShowAchievement(true);
      
      if (!settings.focusMode) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
        });
      }
      
      if (settings.soundEffects && !settings.focusMode) playSound('success');
      if (settings.voiceGuidance) speak(`Congratulations! You unlocked the ${name}.`);
    } else {
      if (settings.soundEffects && !settings.focusMode) playSound('error');
      if (settings.voiceGuidance) speak("Not enough points.");
    }
  };

  const filteredProducts = PRODUCTS.filter(p => p.category === activeCategory);
  const lockedProducts = PRODUCTS.filter(p => !progress.unlockedProducts?.includes(p.id)).sort((a, b) => a.cost - b.cost);
  const nextGoal = lockedProducts.length > 0 ? lockedProducts[0] : null;

  return (
    <div className={`min-h-screen ${bgClass} font-sans pb-24`}>
      <header className="p-6 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-b-[4px] active:border-b-0 active:translate-y-[4px] transition-all
              ${settings.focusMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-700'}
            `}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h1 className={`text-2xl font-black ${textClass}`}>Ability Store</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (window.confirm('Reset all store unlocks?')) {
                resetStore();
              }
            }}
            className="p-2.5 bg-red-100 text-red-600 rounded-full border-b-[4px] border-red-300 active:border-b-0 active:translate-y-1 transition-all"
            title="Reset Store Unlocks"
          >
            <RotateCcw size={18} />
          </button>
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-b-[4px] border-yellow-300">
            <Star size={20} className="text-yellow-500 fill-yellow-500" />
            <span className="font-black text-yellow-700 text-lg">{currentPoints.toLocaleString()}</span>
          </div>
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto flex flex-col gap-6">
        {nextGoal && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-2xl text-white shadow-md">
            <h3 className="font-black text-lg mb-1">Next Goal: {nextGoal.name}</h3>
            <p className="font-medium text-blue-100 text-sm">
              {currentPoints >= nextGoal.cost 
                ? "You have enough points to unlock this!" 
                : `You need ${(nextGoal.cost - currentPoints).toLocaleString()} more points to unlock this.`}
            </p>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('visual')}
            className={`whitespace-nowrap px-4 py-3 rounded-xl font-bold transition-all border-b-[4px] active:border-b-0 active:translate-y-1 flex items-center gap-2
              ${activeCategory === 'visual' 
                ? 'bg-blue-500 text-white border-blue-700' 
                : settings.focusMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-gray-500 border-gray-200'
              }
            `}
          >
            <Eye size={20} /> Visually Impaired
          </button>
          <button
            onClick={() => setActiveCategory('hearing')}
            className={`whitespace-nowrap px-4 py-3 rounded-xl font-bold transition-all border-b-[4px] active:border-b-0 active:translate-y-1 flex items-center gap-2
              ${activeCategory === 'hearing' 
                ? 'bg-orange-500 text-white border-orange-700' 
                : settings.focusMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-gray-500 border-gray-200'
              }
            `}
          >
            <Ear size={20} /> Hearing Impaired
          </button>
          <button
            onClick={() => setActiveCategory('cognitive')}
            className={`whitespace-nowrap px-4 py-3 rounded-xl font-bold transition-all border-b-[4px] active:border-b-0 active:translate-y-1 flex items-center gap-2
              ${activeCategory === 'cognitive' 
                ? 'bg-green-500 text-white border-green-700' 
                : settings.focusMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-gray-500 border-gray-200'
              }
            `}
          >
            <Brain size={20} /> Cognitive
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {filteredProducts.map(product => {
            const isUnlocked = progress.unlockedProducts?.includes(product.id);
            const canAfford = currentPoints >= product.cost;
            const Icon = product.icon;

            return (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-[2rem] border-b-[6px] flex flex-col gap-4 ${cardBgClass}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 ${product.color} ${isUnlocked ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''}`}>
                    <Icon size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-black ${textClass}`}>{product.name}</h3>
                    <p className={`text-sm font-medium mt-1 leading-snug ${subTextClass}`}>{product.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold
                    ${isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {isUnlocked ? <CheckCircle2 size={18} /> : <Star size={18} className="text-yellow-500 fill-yellow-500" />}
                    <span>{isUnlocked ? 'Unlocked' : `${product.cost.toLocaleString()} Points`}</span>
                  </div>

                  {!isUnlocked ? (
                    <button
                      onClick={() => handleUnlock(product.id, product.cost, product.name)}
                      disabled={!canAfford}
                      className={`px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all border-b-[4px] active:border-b-0 active:translate-y-1
                        ${canAfford 
                          ? 'bg-blue-500 text-white border-blue-700 hover:bg-blue-600' 
                          : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                        }
                      `}
                    >
                      {canAfford ? <Unlock size={18} /> : <Lock size={18} />}
                      Unlock
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProduct(product.id);
                        setShowRedemption(true);
                      }}
                      className="px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all border-b-[4px] active:border-b-0 active:translate-y-1 bg-green-500 text-white border-green-700 hover:bg-green-600"
                    >
                      <ShoppingBag size={18} />
                      Redeem
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Achievement Overlay */}
      <AnimatePresence>
        {showAchievement && selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white p-8 rounded-[2rem] border-b-[8px] border-gray-200 flex flex-col items-center text-center max-w-sm w-full"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border-b-[4px] border-green-200 shadow-inner">
                <ShoppingBag size={48} className="text-green-500" />
              </div>
              <h2 className="text-4xl font-black text-gray-800 mb-2">Amazing! 🎉</h2>
              <p className="text-xl text-gray-600 font-bold mb-6">
                You unlocked the <span className="text-blue-600">{PRODUCTS.find(p => p.id === selectedProduct)?.name}</span>!
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-5 rounded-2xl border-2 border-blue-200 w-full mb-6">
                <p className="text-indigo-900 font-black text-sm uppercase tracking-wide mb-1">You earned this</p>
                <p className="text-blue-800 font-medium text-sm leading-relaxed">
                  Your hard work in SensePlay is unlocking tools that make the real world more accessible. Be very proud of your progress today! 🌟
                </p>
              </div>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowAchievement(false)}
                  className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 border-b-[4px] border-gray-300 active:border-b-0 active:translate-y-[4px] transition-all"
                >
                  Keep Playing
                </button>
                <button 
                  onClick={() => navigate('/collection')}
                  className="flex-1 py-4 rounded-2xl font-bold bg-blue-500 text-white border-b-[4px] border-blue-700 active:border-b-0 active:translate-y-[4px] transition-all"
                >
                  View Collection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Redemption Overlay */}
      <AnimatePresence>
        {showRedemption && selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 rounded-[2rem] border-b-[8px] border-gray-200 flex flex-col max-w-sm w-full relative"
            >
              <button 
                onClick={() => {
                  setShowRedemption(false);
                  setTimeout(() => setRedemptionStep('form'), 300);
                }}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>

              {redemptionStep === 'form' ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <Truck size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">Redeem Item</h2>
                  </div>

                  <p className="text-gray-600 font-medium mb-6">
                    Enter your shipping details to receive your <span className="font-bold text-blue-600">{PRODUCTS.find(p => p.id === selectedProduct)?.name}</span>.
                  </p>

                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                      <input type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Shipping Address</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="text" className="w-full pl-10 p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="123 Main St, City, Country" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (settings.soundEffects && !settings.focusMode) playSound('success');
                      setRedemptionStep('success');
                    }}
                    className="w-full py-4 rounded-2xl font-black text-lg bg-blue-500 text-white border-b-[4px] border-blue-700 active:border-b-0 active:translate-y-[4px] transition-all"
                  >
                    Confirm Order
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border-b-[4px] border-green-200">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-800 mb-2">Order Placed!</h2>
                  <p className="text-gray-600 font-medium mb-6">
                    Your <span className="font-bold text-blue-600">{PRODUCTS.find(p => p.id === selectedProduct)?.name}</span> is on its way. You will receive an email confirmation shortly.
                  </p>
                  <button 
                    onClick={() => {
                      setShowRedemption(false);
                      setTimeout(() => setRedemptionStep('form'), 300);
                    }}
                    className="w-full py-4 rounded-2xl font-black text-lg bg-gray-100 text-gray-700 border-b-[4px] border-gray-300 active:border-b-0 active:translate-y-[4px] transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Plus, Trash2, CheckCircle2, Star, Zap, Trophy, Brain } from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import { GAMES } from '../data/games';

const PRESET_GOALS = [
  { text: 'Complete 5 levels', target: 5,  type: 'levels' as const, gameId: 'all' },
  { text: 'Earn 10 stars',     target: 10, type: 'stars'  as const, gameId: 'all' },
  { text: 'Complete 10 levels',target: 10, type: 'levels' as const, gameId: 'all' },
  { text: 'Earn 30 stars',     target: 30, type: 'stars'  as const, gameId: 'all' },
];

export const GoalPanel = () => {
  const { goals, addGoal, removeGoal, currentStats } = useAchievements();
  const [showForm, setShowForm] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customText, setCustomText] = useState('');
  const [customTarget, setCustomTarget] = useState(10);
  const [customType, setCustomType] = useState<'levels' | 'stars'>('levels');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { totalStars, totalLevels } = currentStats;

  // AI Goal Engine: Looks at your stats and creates a specific stretch goal
  const generateAIGoal = () => {
    setIsAnalyzing(true);
    setSelectedPreset(null);
    
    // Simulate thinking time for excitement
    setTimeout(() => {
      let target = 0;
      let type: 'levels' | 'stars' = 'levels';
      let text = '';
      
      // Basic AI heuristic analysis
      if (totalLevels < 5) {
        target = 5; type = 'levels'; text = "Master your first 5 levels!";
      } else if (totalStars < 20) {
        target = 20; type = 'stars'; text = "Reach 20 Stars! Focus on accuracy.";
      } else if (totalLevels % 5 !== 0) {
        target = totalLevels + (5 - (totalLevels % 5));
        type = 'levels'; text = `Complete ${target - totalLevels} more levels for a milestone!`;
      } else {
        target = totalStars + 10;
        type = 'stars'; text = `Earn 10 more stars to become untouchable!`;
      }
      
      setCustomType(type);
      setCustomTarget(target);
      setCustomText(text);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleAdd = () => {
    if (selectedPreset !== null) {
      const preset = PRESET_GOALS[selectedPreset];
      addGoal({ text: preset.text, target: preset.target, type: preset.type, gameId: 'all' });
    } else {
      addGoal({ text: customText || `Reach ${customTarget} ${customType}`, target: customTarget, type: customType, gameId: 'all' });
    }
    setShowForm(false);
    setSelectedPreset(null);
    setCustomText('');
  };

  return (
    <div className="flex flex-col gap-6 pb-24">

      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-[2.5rem] p-6 text-white shadow-xl border-b-[6px] border-purple-900 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 opacity-10"><Trophy size={150} /></div>
        <div className="relative z-10">
          <p className="text-purple-200 text-xs font-black uppercase tracking-widest mb-1">Goal Tracker</p>
          <h2 className="text-3xl font-black mb-4">My Goals 🎯</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black">{totalLevels}</p>
              <p className="text-purple-200 text-xs font-bold uppercase">Levels Done</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black flex items-center justify-center gap-1"><Star size={18} className="fill-yellow-300 text-yellow-300" />{totalStars}</p>
              <p className="text-purple-200 text-xs font-bold uppercase">Stars Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl text-gray-800">Active Goals</h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-2xl font-bold border-b-4 border-violet-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            <Plus size={18} /> Add Goal
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-[2rem] border-b-[4px] border-gray-200 p-5 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-black text-gray-800">Choose a Goal:</p>
                <button 
                  onClick={generateAIGoal} 
                  disabled={isAnalyzing}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all ${isAnalyzing ? 'bg-purple-100 text-purple-400 animate-pulse' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                  <Brain size={14} />
                  {isAnalyzing ? "Analyzing..." : "AI Suggestion"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PRESET_GOALS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPreset(i === selectedPreset ? null : i)}
                    className={`p-3 rounded-2xl border-2 font-bold text-sm text-left transition-all
                      ${selectedPreset === i ? 'bg-violet-50 border-violet-400 text-violet-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    {p.type === 'stars' ? '⭐' : '✅'} {p.text}
                  </button>
                ))}
              </div>
              {selectedPreset === null && (
                <div className="space-y-3 mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Or set a custom goal:</p>
                  <input
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder="My goal description..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-violet-400"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={customTarget}
                      onChange={e => setCustomTarget(Number(e.target.value))}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-violet-400"
                    />
                    <select
                      value={customType}
                      onChange={e => setCustomType(e.target.value as any)}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-violet-400"
                    >
                      <option value="levels">Levels</option>
                      <option value="stars">Stars</option>
                    </select>
                  </div>
                </div>
              )}
              <button
                onClick={handleAdd}
                className="w-full bg-violet-500 text-white py-3 rounded-2xl font-black border-b-4 border-violet-700 active:border-b-0 transition-all"
              >
                Set This Goal! 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {goals.length === 0 ? (
          <div className="bg-white rounded-[2rem] border-b-4 border-gray-200 p-8 text-center text-gray-400">
            <Target size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-bold">No goals yet — set one above!</p>
          </div>
        ) : (
          <AnimatePresence>
            {goals.map(goal => {
              const current = goal.type === 'stars' ? totalStars : totalLevels;
              const pct = Math.min((current / goal.target) * 100, 100);
              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className={`bg-white rounded-[2rem] border-b-[4px] p-5 transition-all
                    ${goal.completed
                      ? 'border-green-400 bg-green-50 ring-2 ring-green-300'
                      : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl
                        ${goal.completed ? 'bg-green-100' : 'bg-violet-100'}`}>
                        {goal.completed ? '🎉' : (goal.type === 'stars' ? '⭐' : '🎯')}
                      </div>
                      <div>
                        <p className={`font-black ${goal.completed ? 'text-green-700' : 'text-gray-800'}`}>{goal.text}</p>
                        <p className="text-xs text-gray-500 font-medium">{current} / {goal.target} {goal.type}</p>
                      </div>
                    </div>
                    <button onClick={() => removeGoal(goal.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {goal.completed ? (
                    <div className="bg-green-100 rounded-2xl px-4 py-2 text-center">
                      <p className="font-black text-green-700">🏆 Goal Achieved! You're incredible!</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-violet-500 rounded-full"
                        />
                      </div>
                      <p className="text-right text-xs font-bold text-violet-600 mt-1">{Math.round(pct)}%</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

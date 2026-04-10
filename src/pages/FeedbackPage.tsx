import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Smile, Meh, Frown, MessageSquare, Send, 
  ChevronLeft, Target, Volume2, Settings, Trophy, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { speak } from '../lib/audio';

type Mood = 'happy' | 'neutral' | 'sad' | null;
type QuickFeedback = 'Great!' | 'Too hard' | 'Confusing' | 'Needs improvement';

export const FeedbackPage = () => {
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();
  
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [rating, setRating] = useState(0);
  const [mood, setMood] = useState<Mood>(null);
  const [quickFeedback, setQuickFeedback] = useState<QuickFeedback[]>([]);
  const [feedbackText, setFeedbackText] = useState('');

  const bgClass = settings.focusMode ? 'bg-slate-800' : 'bg-white';
  const textClass = settings.focusMode ? 'text-slate-100' : 'text-gray-800';
  const subTextClass = settings.focusMode ? 'text-slate-400' : 'text-gray-500';

  useEffect(() => {
    if (settings.voiceGuidance && step === 'form') {
      speak("How was your experience? Please rate and share your feedback.");
    } else if (settings.voiceGuidance && step === 'success') {
      speak("Thank you for your feedback! Here are some features you might like.");
    }
  }, [step, settings.voiceGuidance]);

  const toggleQuickFeedback = (option: QuickFeedback) => {
    setQuickFeedback(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    // In a real app, send to backend
    setStep('success');
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (quickFeedback.includes('Needs improvement')) {
      suggestions.push({
        id: 'focus',
        title: 'Try Focus Mode',
        desc: 'Reduces distractions for better concentration.',
        icon: Target,
        action: () => updateSetting('focusMode', true),
        color: 'bg-blue-100 text-blue-600',
        btnColor: 'bg-blue-500 hover:bg-blue-600'
      });
    }
    if (quickFeedback.includes('Too hard')) {
      suggestions.push({
        id: 'difficulty',
        title: 'Change Difficulty',
        desc: 'Set the game to Easy mode.',
        icon: Settings,
        action: () => updateSetting('difficulty', 'easy'),
        color: 'bg-green-100 text-green-600',
        btnColor: 'bg-green-500 hover:bg-green-600'
      });
    }
    if (quickFeedback.includes('Confusing')) {
      suggestions.push({
        id: 'voice',
        title: 'Enable Voice Guidance',
        desc: 'Get spoken instructions for games.',
        icon: Volume2,
        action: () => updateSetting('voiceGuidance', true),
        color: 'bg-purple-100 text-purple-600',
        btnColor: 'bg-purple-500 hover:bg-purple-600'
      });
    }
    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <div className={`min-h-screen ${settings.focusMode ? 'bg-slate-900' : 'bg-white'} font-sans pb-12`}>
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
        <h1 className={`text-2xl font-black ${textClass}`}>Review & Improve</h1>
      </header>

      <main className="px-6 max-w-md mx-auto flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              {/* Rating */}
              <div className={`${bgClass} p-6 rounded-[2rem] border-b-[6px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-4 ${textClass}`}>Rate your experience</h2>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-2 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        size={40} 
                        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className={`${bgClass} p-6 rounded-[2rem] border-b-[6px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-4 ${textClass}`}>How do you feel?</h2>
                <div className="flex justify-between gap-4">
                  <button 
                    onClick={() => setMood('happy')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-b-[4px] transition-all
                      ${mood === 'happy' ? 'bg-green-100 border-green-500 text-green-600' : settings.focusMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-500'}
                    `}
                  >
                    <Smile size={40} />
                    <span className="font-bold">Happy</span>
                  </button>
                  <button 
                    onClick={() => setMood('neutral')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-b-[4px] transition-all
                      ${mood === 'neutral' ? 'bg-yellow-100 border-yellow-500 text-yellow-600' : settings.focusMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-500'}
                    `}
                  >
                    <Meh size={40} />
                    <span className="font-bold">Okay</span>
                  </button>
                  <button 
                    onClick={() => setMood('sad')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-b-[4px] transition-all
                      ${mood === 'sad' ? 'bg-red-100 border-red-500 text-red-600' : settings.focusMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-500'}
                    `}
                  >
                    <Frown size={40} />
                    <span className="font-bold">Sad</span>
                  </button>
                </div>
              </div>

              {/* Quick Feedback */}
              <div className={`${bgClass} p-6 rounded-[2rem] border-b-[6px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-4 ${textClass}`}>What can we improve?</h2>
                <div className="flex flex-wrap gap-3">
                  {(['Great!', 'Too hard', 'Confusing', 'Needs improvement'] as QuickFeedback[]).map(option => (
                    <button
                      key={option}
                      onClick={() => toggleQuickFeedback(option)}
                      className={`px-4 py-2 rounded-xl font-bold border-b-[4px] transition-all active:border-b-0 active:translate-y-1
                        ${quickFeedback.includes(option) 
                          ? 'bg-blue-500 border-blue-700 text-white' 
                          : settings.focusMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'}
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Feedback */}
              <div className={`${bgClass} p-6 rounded-[2rem] border-b-[6px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textClass}`}>
                  <MessageSquare size={20} /> Any other thoughts?
                </h2>
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us more..."
                  className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all resize-none h-32
                    ${settings.focusMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'}
                  `}
                />
              </div>

              <button 
                onClick={handleSubmit}
                disabled={rating === 0 && !mood && quickFeedback.length === 0 && !feedbackText}
                className={`w-full py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-2 transition-all shadow-sm
                  ${(rating > 0 || mood || quickFeedback.length > 0 || feedbackText)
                    ? 'bg-blue-500 text-white border-b-[6px] border-blue-700 active:border-b-0 active:translate-y-[6px]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Submit Feedback <Send size={24} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-6"
            >
              <div className={`${bgClass} p-8 rounded-[2rem] border-b-[6px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'} text-center flex flex-col items-center`}>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border-b-[4px] border-green-200">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h2 className={`text-3xl font-black mb-2 ${textClass}`}>Thank You!</h2>
                <p className={`text-lg font-medium ${subTextClass}`}>Your feedback helps us make SensePlay better for everyone.</p>
              </div>

              {suggestions.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className={`font-black text-xl px-2 ${textClass}`}>Suggested for you</h3>
                  {suggestions.map(s => (
                    <div key={s.id} className={`${bgClass} p-5 rounded-2xl border-b-[4px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'} flex items-center justify-between gap-4`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${s.color}`}>
                          <s.icon size={24} />
                        </div>
                        <div>
                          <h4 className={`font-bold ${textClass}`}>{s.title}</h4>
                          <p className={`text-sm ${subTextClass}`}>{s.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={s.action}
                        className={`px-4 py-2 rounded-xl text-white font-bold transition-colors ${s.btnColor}`}
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-4 mt-4">
                <h3 className={`font-black text-xl px-2 ${textClass}`}>Explore More Features</h3>
                
                <button onClick={() => navigate('/')} className={`${bgClass} p-5 rounded-2xl border-b-[4px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'} flex items-center gap-4 text-left hover:bg-gray-50 transition-colors`}>
                  <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${textClass}`}>Leaderboard</h4>
                    <p className={`text-sm ${subTextClass}`}>Check your rank and stars</p>
                  </div>
                </button>

                <button onClick={() => navigate('/')} className={`${bgClass} p-5 rounded-2xl border-b-[4px] ${settings.focusMode ? 'border-slate-700' : 'border-gray-200'} flex items-center gap-4 text-left hover:bg-gray-50 transition-colors`}>
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${textClass}`}>Accessibility Settings</h4>
                    <p className={`text-sm ${subTextClass}`}>Customize your experience</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => navigate('/')}
                className="mt-6 w-full py-5 rounded-[2rem] font-black text-xl bg-gray-200 text-gray-700 border-b-[6px] border-gray-300 active:border-b-0 active:translate-y-[6px] transition-all flex items-center justify-center"
              >
                Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

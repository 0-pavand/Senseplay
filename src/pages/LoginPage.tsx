import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Ear, Brain, Mic, User, Grid, ArrowRight, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

type AbilitySupport = 'Visual' | 'Hearing' | 'Learning' | null;
type LoginMethod = 'Profile' | 'PIN' | 'Voice' | null;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { updateSetting } = useSettings();

  const [step, setStep] = useState<1 | 2>(1);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(null);
  const [pin, setPin] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSupportSelect = (type: AbilitySupport) => {
    if (type === 'Visual') {
      updateSetting('voiceGuidance', true);
      updateSetting('highContrast', false); // keep login page clean
      updateSetting('textSize', 'large');
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Visual support selected. Voice guidance enabled.");
        window.speechSynthesis.speak(msg);
      }
    } else if (type === 'Hearing') {
      updateSetting('voiceGuidance', false);
      updateSetting('soundEffects', false);
      updateSetting('highContrast', false);
    } else if (type === 'Learning') {
      updateSetting('focusMode', true);
      updateSetting('reduceMotion', true);
      updateSetting('difficulty', 'easy');
    }
    setTimeout(() => setStep(2), 400);
  };

  const handleLogin = () => {
    localStorage.setItem('senseplay_logged_in', 'true');
    navigate('/app');
  };

  const simulateVoiceLogin = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleLogin();
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-slate-800">

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full flex flex-col gap-4"
          >
            <div className="text-center mb-6">
              <h1 className="text-5xl font-black mb-2 tracking-tight text-gray-800">SensePlay</h1>
              <p className="text-lg font-bold text-blue-600">How can we help you play?</p>
            </div>

            {/* Visual Support */}
            <button
              onClick={() => handleSupportSelect('Visual')}
              className="p-6 rounded-[2rem] border-b-[8px] border-blue-200 bg-white shadow-lg flex items-center gap-6 transition-transform active:scale-95 active:border-b-0 active:translate-y-2"
            >
              <div className="p-4 rounded-full bg-blue-100 text-blue-600 shrink-0">
                <Eye size={40} />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-2xl font-black text-gray-800">Visual Support</h2>
                <p className="font-bold text-gray-500">Large text & Voice Guide</p>
              </div>
              <ArrowRight size={28} className="text-gray-400" />
            </button>

            {/* Hearing Support */}
            <button
              onClick={() => handleSupportSelect('Hearing')}
              className="p-6 rounded-[2rem] border-b-[8px] border-green-200 bg-white shadow-lg flex items-center gap-6 transition-transform active:scale-95 active:border-b-0 active:translate-y-2"
            >
              <div className="p-4 rounded-full bg-green-100 text-green-600 shrink-0">
                <Ear size={40} />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-2xl font-black text-gray-800">Hearing Support</h2>
                <p className="font-bold text-gray-500">No sounds, Clear visuals</p>
              </div>
              <ArrowRight size={28} className="text-gray-400" />
            </button>

            {/* Learning Support */}
            <button
              onClick={() => handleSupportSelect('Learning')}
              className="p-6 rounded-[2rem] border-b-[8px] border-purple-200 bg-white shadow-lg flex items-center gap-6 transition-transform active:scale-95 active:border-b-0 active:translate-y-2"
            >
              <div className="p-4 rounded-full bg-purple-100 text-purple-600 shrink-0">
                <Brain size={40} />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-2xl font-black text-gray-800">Learning Support</h2>
                <p className="font-bold text-gray-500">Focus mode & Simple levels</p>
              </div>
              <ArrowRight size={28} className="text-gray-400" />
            </button>

            <button
              onClick={() => { setStep(2); }}
              className="mt-2 p-4 rounded-full font-bold text-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip (I don't need support)
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md w-full flex flex-col gap-4"
          >
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black mb-2 text-gray-800">Let's Go!</h1>
              <p className="text-lg font-bold text-blue-600">How do you want to start?</p>
            </div>

            {!loginMethod && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleLogin}
                  className="p-6 rounded-[2rem] border-b-[8px] border-blue-700 bg-blue-500 text-white flex items-center justify-center gap-4 transition-transform active:scale-95 active:border-b-0 active:translate-y-2 shadow-lg"
                >
                  <User size={32} />
                  <span className="text-2xl font-black">Play as Guest</span>
                </button>

                <button
                  onClick={() => setLoginMethod('PIN')}
                  className="p-6 rounded-[2rem] border-b-[8px] border-gray-200 bg-white text-gray-800 flex items-center justify-center gap-4 transition-transform active:scale-95 active:border-b-0 active:translate-y-2 shadow-md"
                >
                  <Grid size={32} className="text-blue-500" />
                  <span className="text-2xl font-black">Use PIN</span>
                </button>

                <button
                  onClick={() => setLoginMethod('Voice')}
                  className="p-6 rounded-[2rem] border-b-[8px] border-gray-200 bg-white text-gray-800 flex items-center justify-center gap-4 transition-transform active:scale-95 active:border-b-0 active:translate-y-2 shadow-md"
                >
                  <Mic size={32} className="text-purple-500" />
                  <span className="text-2xl font-black">Voice Login</span>
                </button>
              </div>
            )}

            {loginMethod === 'PIN' && (
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4 mb-2">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all
                        ${pin.length > i ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}
                    >
                      {pin.length > i && <div className="w-5 h-5 rounded-full bg-white" />}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        const newPin = pin + num;
                        setPin(newPin);
                        if (newPin.length === 4) handleLogin();
                      }}
                      className="w-20 h-20 rounded-[2rem] bg-white text-gray-800 flex items-center justify-center text-3xl font-black border-b-[6px] border-gray-200 shadow-md transition-transform active:scale-90 active:border-b-0 active:translate-y-[6px]"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button onClick={() => setLoginMethod(null)} className="mt-2 font-bold text-gray-500 hover:text-gray-700">
                  ← Go Back
                </button>
              </div>
            )}

            {loginMethod === 'Voice' && (
              <div className="flex flex-col items-center gap-8 py-8">
                <button
                  onClick={simulateVoiceLogin}
                  disabled={isListening}
                  className={`w-40 h-40 rounded-full flex items-center justify-center border-b-[12px] shadow-xl transition-all
                    ${isListening ? 'bg-red-500 border-red-700 scale-110' : 'bg-white border-gray-200'}`}
                >
                  <motion.div animate={isListening ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <Mic size={64} className={isListening ? 'text-white' : 'text-blue-500'} />
                  </motion.div>
                </button>
                <div className="text-center">
                  <h3 className="text-2xl font-black mb-2 text-gray-800">{isListening ? 'Listening...' : 'Tap the microphone'}</h3>
                  <p className="font-bold text-gray-500">Say "Hello SensePlay" to log in</p>
                </div>
                <button onClick={() => setLoginMethod(null)} className="font-bold text-gray-500 hover:text-gray-700">
                  ← Go Back
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowRight, Star, CheckCircle2, RotateCcw, Play, AlertCircle, RefreshCw, MessageSquare, Mic } from 'lucide-react';
import { speak, playSound } from '../lib/audio';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { Celebration } from './Celebration';
import { HandGestureDetector } from './HandGestureDetector';
import { ObjectDetector } from './ObjectDetector';
import { CertificateModal } from './CertificateModal';
import { translate as t } from '../lib/i18n';

// AI Performance Analyzer
const generateAIEncouragement = (wrongCount: number, timeSpentMs: number) => {
  const seconds = timeSpentMs / 1000;
  if (wrongCount === 0) {
    if (seconds < 3) return "Lightning fast and perfectly correct! ⚡️ Incredible reflexes!";
    if (seconds < 6) return "Perfect answer! 🌟 You're a natural!";
    return "Great accuracy! 🧠 You took your time and got it exactly right.";
  } else if (wrongCount === 1) {
    if (seconds < 8) return "You adjusted quickly! 🎯 Great job learning from mistakes!";
    return "Good fix! 💪 Everyone makes a mistake, but you kept trying.";
  } else {
    return "You never gave up! 🚀 That perseverance is your secret superpower!";
  }
};

type Step = 'INTRO' | 'GUIDED' | 'PRACTICE' | 'TEST' | 'RESULT' | 'COMPLETION';

export const LevelFlow = ({ game, level, onComplete }: { game: any, level: any, onComplete: (stars: number) => void }) => {
  const [step, setStep] = useState<Step>('INTRO');
  const [score, setScore] = useState(0);
  const [testIndex, setTestIndex] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { awardStars, unlockNextLevel } = useProgress();
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationOption, setCelebrationOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [gameStars, setGameStars] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Safety: If level is missing, show error instead of crashing
  if (!level || !game) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl shadow-xl">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Oops! Level not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-500 font-bold underline">Go Home</button>
      </div>
    );
  }

  const isListenGame = game.id === 'listen-and-guess';
  const isSpellingStep = level.type === 'spelling';
  const isSignGame = game.id === 'sign-and-play';
  const isDetectGame = game.id === 'see-and-identify';

  // Read gesture directly from level data (set in games.ts)
  const expectedGesture: string | null = isSignGame ? (level.gesture || null) : null;

  useEffect(() => {
    if (!settings?.voiceGuidance) return;
    
    // Use a small delay for page transition
    const timer = setTimeout(() => {
      if (step === 'INTRO') {
        let text = level.introText || "Welcome to the level";
        if (isSignGame && expectedGesture) text = `${level.introText}. Show your hand to the camera to sign!`;
        if (isDetectGame) text = `${level.introText}. Find the object and show it to the camera.`;
        speak(text);
      } else if (step === 'GUIDED') {
        const text = isDetectGame ? `Show a ${level.targetObject || ''} to the camera and click capture.` : (level.guidedText || "Follow along");
        speak(text);
      } else if (step === 'PRACTICE') {
        speak(level.practiceText || "Let's practice");
      } else if (step === 'TEST') {
        speak(level.testQuestions?.[testIndex]?.questionText || "Answer the question");
      } else if (step === 'RESULT') {
        speak(`Great job! You scored ${score} out of ${level.testQuestions?.length || 0}.`);
      } else if (step === 'COMPLETION') {
        speak("Congratulations! You completed the level.");
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [step, level, testIndex, settings?.voiceGuidance]);

  const handleNextStep = (next: Step) => {
    setWrongAttempts([]);
    setStep(next);
    setSpeechTranscript(null);
    setSpeechError(null);
    setManualInput("");
    setShowManualInput(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const startSpeechRecognition = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
      setSpeechTranscript(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setSpeechTranscript(transcript);
      
      const correctWord = (step === 'TEST' 
        ? level.testQuestions?.[testIndex]?.correctOption 
        : (level.correctOption || level.testQuestions?.[0]?.correctOption))?.toLowerCase();

      if (!correctWord) return;

      // Normalize transcript: remove spaces and dots (for spelling like "C A T")
      const normalizedTranscript = transcript.replace(/[\s\.]/g, '');
      
      if (normalizedTranscript.includes(correctWord) || transcript.includes(correctWord)) {
        handleOptionClick(correctWord.toUpperCase(), step === 'TEST');
      } else {
        setSpeechError(`I heard "${transcript}". Try again!`);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === 'network') {
        setSpeechError("Internet required for voice spelling. Please check your connection!");
      } else if (event.error === 'no-speech') {
        setSpeechError("I didn't hear anything. Try again!");
      } else {
        setSpeechError(`Voice Error: ${event.error}. Please try again!`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handlePlayAudio = () => {
    const currentAudioUrl = step === 'TEST' 
      ? level.testQuestions?.[testIndex]?.audioUrl 
      : (level.audioUrl || level.testQuestions?.[0]?.audioUrl);
    
    if (!currentAudioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      const audio = new Audio(currentAudioUrl);
      audioRef.current = audio;
      setIsAudioPlaying(true);
      setAudioError(false);

      audio.play()
        .then(() => {
          audio.onended = () => setIsAudioPlaying(false);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          setAudioError(true);
          setIsAudioPlaying(false);
        });
    } catch (err) {
      setAudioError(true);
    }
  };

  const handleOptionClick = (optionId: string, isTest: boolean) => {
    if (celebrationOption || wrongAttempts.includes(optionId)) return;

    const currentQuestion = isTest 
      ? level.testQuestions?.[testIndex] 
      : { correctOption: level.correctOption || level.testQuestions?.[0]?.correctOption };

    if (!currentQuestion) return;

    if (optionId === currentQuestion.correctOption) {
      setCelebrationOption(optionId);
      
      setTimeout(() => {
        if (settings?.soundEffects && !settings?.focusMode) playSound('success');
        setShowConfetti(true);
        
        // AI Feedback Engine: analyzes user performance for custom feedback
        const timeSpent = Date.now() - questionStartTime;
        const msg = generateAIEncouragement(wrongAttempts.length, timeSpent);
        
        setFeedback(msg);
        setEncouragement(msg);
        if (settings?.voiceGuidance) speak(msg);

        setTimeout(() => {
          setShowConfetti(false);
          setCelebrationOption(null);
          setFeedback(null);
          setEncouragement(null);
          setWrongAttempts([]);
          
          if (isTest) {
            setScore(s => s + 1);
            if (testIndex + 1 < (level.testQuestions?.length || 0)) {
              setTestIndex(i => i + 1);
              setQuestionStartTime(Date.now());
            } else {
              setStep('RESULT');
            }
          } else {
            if (step === 'GUIDED') setStep('PRACTICE');
            else {
              setStep('TEST');
              setQuestionStartTime(Date.now());
            }
          }
        }, 2500);
      }, 300);
    } else {
      if (settings?.soundEffects && !settings?.focusMode) playSound('error');
      setFeedback("Oops! Try again!");
      if (settings?.voiceGuidance) speak("Try again!");
      setWrongAttempts(prev => [...prev, optionId]);
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const renderOptions = (isTest: boolean, showHint: boolean) => {
    const currentQuestion = isTest 
      ? level.testQuestions?.[testIndex] 
      : { 
          options: level.options || level.testQuestions?.[0]?.options || [], 
          correctOption: level.correctOption || level.testQuestions?.[0]?.correctOption 
        };

    if (!currentQuestion?.options) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
        {currentQuestion.options.map((opt: any) => {
          const isWrong = wrongAttempts.includes(opt.id);
          const isHinted = showHint && opt.id === currentQuestion.correctOption;
          const Icon = opt.icon;
          
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionClick(opt.id, isTest)}
              animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : (celebrationOption === opt.id ? { scale: [1, 1.05, 1] } : {})}
              className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-b-[8px] transition-all
                ${isWrong ? 'bg-red-100 border-red-300 opacity-50' : 
                  celebrationOption === opt.id ? 'bg-emerald-100 border-emerald-500 shadow-[0_0_20px_rgba(74,222,128,0.2)] animate-glow' : 
                  isHinted ? 'bg-green-100 border-green-400 ring-4 ring-green-400 ring-offset-4 animate-pulse' : 
                  'bg-white border-gray-200 hover:bg-gray-50'}
              `}
            >
              {Icon && <Icon size={80} className={isWrong ? 'text-red-400' : isHinted ? 'text-green-500' : 'text-gray-700'} />}
              {game.id !== 'sign-and-play' && (
                <span className="mt-4 text-2xl font-bold text-gray-700">{t(opt.label, settings?.language)}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  };

  const bgClass = settings?.focusMode ? 'bg-slate-700' : game.bg;
  const borderClass = settings?.focusMode ? 'border-slate-800' : game.borderBg;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4 relative">
      <Celebration active={showConfetti} />
      
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-1/4 left-1/2 -translate-x-1/2 z-[100] px-12 py-6 rounded-3xl font-black text-4xl shadow-2xl
              ${feedback === 'Correct!' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}
            `}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'INTRO' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
            <div className={`p-12 rounded-full ${bgClass} ${borderClass} border-b-[8px] mb-8`}>
              {level.introIcon && <level.introIcon size={120} className="text-white" />}
            </div>
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">{t(level.title, settings?.language)}</h2>
            <p className="text-2xl text-gray-600 mb-12 max-w-xl">{t(level.introText, settings?.language)}</p>
            <button onClick={() => setStep('GUIDED')} className="flex items-center gap-4 bg-[#4ADE80] border-b-[8px] border-[#22C55E] text-white px-10 py-5 rounded-full text-2xl font-bold">
              {t("Start Learning", settings?.language)} <ArrowRight size={32} />
            </button>
          </motion.div>
        )}

        {step === 'GUIDED' && (
          <motion.div key="guided" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center w-full">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => speak(t(level.guidedText || "", settings?.language))} className="p-4 bg-blue-100 text-blue-500 rounded-full"><Volume2 size={32} /></button>
              <h2 className="text-3xl font-extrabold text-gray-800">{t(level.guidedText || "", settings?.language)}</h2>
            </div>
            {isListenGame && (
              <button onClick={handlePlayAudio} className="mb-8 flex items-center gap-3 bg-blue-500 border-b-[8px] border-blue-700 text-white px-10 py-5 rounded-full text-2xl font-black">
                {isAudioPlaying ? "Playing..." : "🔊 Play Sound"}
              </button>
            )}

            {isSpellingStep && (
              <div className="flex flex-col items-center gap-6 mb-8 p-8 bg-white rounded-[2.5rem] border-2 border-dashed border-blue-200 shadow-sm w-full max-w-2xl">
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-black text-blue-600 mb-2">🎤 Voice Mode</p>
                  <p className="text-gray-500 font-medium italic">"Say the spelling of the word!"</p>
                </div>

                {!showManualInput ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      {isListening && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 bg-red-400 rounded-full blur-xl"
                        />
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startSpeechRecognition}
                        disabled={isListening || !!celebrationOption}
                        className={`relative z-10 flex items-center gap-4 px-12 py-6 rounded-full text-2xl font-black border-b-[8px] transition-all shadow-xl
                          ${isListening ? 'bg-red-500 border-red-700 text-white' : 'bg-[#2563EB] border-[#1E40AF] text-white'}
                          ${(isListening || !!celebrationOption) ? 'opacity-90' : 'hover:brightness-110'}
                        `}
                      >
                        <Mic size={32} className={isListening ? 'animate-bounce' : ''} />
                        {isListening ? "Listening..." : "Speak Answer"}
                      </motion.button>
                    </div>

                    {speechError && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <p className="px-6 py-3 bg-red-50 text-red-500 font-black rounded-2xl border border-red-100 text-center animate-shake">
                          {speechError}
                        </p>
                        <button 
                          onClick={() => setShowManualInput(true)}
                          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-black border-b-4 border-gray-200 hover:bg-gray-200 transition-all"
                        >
                          ⌨️ Type Instead (Offline Mode)
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type the word here..."
                      value={manualInput}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setManualInput(val);
                        const correct = (step === 'TEST' 
                          ? level.testQuestions?.[testIndex]?.correctOption 
                          : (level.correctOption || level.testQuestions?.[0]?.correctOption))?.toUpperCase();
                        if (val === correct) {
                          handleOptionClick(correct, step === 'TEST');
                        }
                      }}
                      className="w-full text-center text-4xl font-black p-6 bg-blue-50 border-4 border-blue-200 rounded-3xl text-blue-700 placeholder:text-blue-200 focus:outline-none focus:border-blue-400 focus:ring-8 focus:ring-blue-100 transition-all"
                    />
                    <button 
                      onClick={() => setShowManualInput(false)}
                      className="text-gray-400 font-bold text-sm underline hover:text-gray-600"
                    >
                      Wait, let me try voice again!
                    </button>
                  </motion.div>
                )}

                {speechTranscript && !showManualInput && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-1 bg-blue-50 px-8 py-3 rounded-2xl border border-blue-100"
                  >
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">I Heard</span>
                    <span className="text-3xl font-black text-blue-700 tracking-tighter">"{speechTranscript.toUpperCase()}"</span>
                  </motion.div>
                )}
              </div>
            )}
            
            {isSignGame && expectedGesture && (
              <div className="w-full mb-8">
                <HandGestureDetector 
                  expectedGesture={expectedGesture}
                  onMatch={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
                  onFallback={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
                />
              </div>
            )}

            {isDetectGame && (
              <ObjectDetector 
                targetObject={level.targetObject || ''}
                onMatch={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
                onFallback={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
              />
            )}
            
            {!(isDetectGame || isSignGame) && renderOptions(false, true)}
          </motion.div>
        )}

        {step === 'PRACTICE' && (
          <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center w-full">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">{t(level.practiceText || "", settings?.language)}</h2>
            {isListenGame && (
              <button onClick={handlePlayAudio} className="mb-8 flex items-center gap-3 bg-purple-500 border-b-[8px] border-purple-700 text-white px-10 py-5 rounded-full text-2xl font-black">
                {isAudioPlaying ? "Playing..." : "🔊 Play Sound"}
              </button>
            )}

            {isSpellingStep && (
              <div className="flex flex-col items-center gap-4 mb-8 p-6 bg-white rounded-3xl border-2 border-dashed border-blue-200">
                <p className="text-xl font-bold text-blue-600 italic">"How do you spell it?"</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startSpeechRecognition}
                  disabled={isListening || !!celebrationOption}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full text-xl font-black border-b-[8px] transition-all
                    ${isListening ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-blue-600 border-blue-800 text-white shadow-lg'}
                  `}
                >
                  <Mic size={24} />
                  {isListening ? "Listening..." : "🎤 Speak Answer"}
                </motion.button>
                {speechTranscript && (
                  <p className="font-bold text-gray-500">I heard: <span className="text-blue-600 font-black">"{speechTranscript.toUpperCase()}"</span></p>
                )}
                {speechError && (
                  <p className="text-red-500 font-bold bg-red-50 px-4 py-1 rounded-xl">{speechError}</p>
                )}
              </div>
            )}

            {isSignGame && expectedGesture && (
              <div className="w-full mb-8">
                <HandGestureDetector 
                  expectedGesture={expectedGesture}
                  onMatch={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
                  onFallback={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
                />
              </div>
            )}

            {isDetectGame && (
              <ObjectDetector 
                targetObject={level.targetObject || ''}
                onMatch={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
                onFallback={() => handleOptionClick(level.correctOption || level.testQuestions?.[0]?.correctOption, false)}
              />
            )}

            {!(isDetectGame || isSignGame) && renderOptions(false, false)}
          </motion.div>
        )}

        {step === 'TEST' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center w-full">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">{t(level.testQuestions?.[testIndex]?.questionText || "", settings?.language)}</h2>
            {isListenGame && (
              <button onClick={handlePlayAudio} className="mb-8 flex items-center gap-3 bg-orange-500 border-b-[8px] border-orange-700 text-white px-10 py-5 rounded-full text-2xl font-black">
                {isAudioPlaying ? "Playing..." : "🔊 Play Sound"}
              </button>
            )}

            {isSpellingStep && (
              <div className="flex flex-col items-center gap-4 mb-10 p-8 bg-blue-50/50 rounded-[2.5rem] border-2 border-dashed border-blue-200">
                <div className="w-40 h-40 bg-white rounded-3xl shadow-sm flex items-center justify-center p-4 mb-2">
                  {level.introIcon && <level.introIcon size={100} className="text-blue-500" />}
                </div>
                <p className="text-xl font-black text-blue-700">CAN YOU SPELL IT?</p>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startSpeechRecognition}
                  disabled={isListening || !!celebrationOption}
                  className={`flex items-center gap-4 px-12 py-5 rounded-full text-2xl font-black border-b-[8px] transition-all
                    ${isListening ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-blue-600 border-blue-800 text-white shadow-xl'}
                  `}
                >
                  <Mic size={32} />
                  {isListening ? "Listening..." : "🎤 Speak Answer"}
                </motion.button>
                
                {speechTranscript && (
                  <div className="mt-4 px-6 py-3 bg-white rounded-2xl shadow-inner">
                    <p className="text-lg font-bold text-gray-400">YOU SAID:</p>
                    <p className="text-2xl font-black text-blue-600 tracking-widest">{speechTranscript.toUpperCase()}</p>
                  </div>
                )}
                
                {speechError && (
                  <p className="mt-4 text-red-500 font-black animate-bounce">{speechError}</p>
                )}
              </div>
            )}

            {isSignGame && expectedGesture && (
              <div className="w-full mb-8">
                <HandGestureDetector 
                  expectedGesture={expectedGesture}
                  onMatch={() => handleOptionClick(level.testQuestions?.[testIndex]?.correctOption, true)}
                  onFallback={() => handleOptionClick(level.testQuestions?.[testIndex]?.correctOption, true)}
                />
              </div>
            )}

            {isDetectGame && (
              <ObjectDetector 
                targetObject={level.targetObject || ''}
                onMatch={() => handleOptionClick(level.testQuestions?.[testIndex]?.correctOption, true)}
                onFallback={() => handleOptionClick(level.testQuestions?.[testIndex]?.correctOption, true)}
              />
            )}

            {!(isDetectGame || isSignGame) && renderOptions(true, false)}
          </motion.div>
        )}

        {step === 'RESULT' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
            <CheckCircle2 size={120} className="text-green-500 mb-6" />
            <h2 className="text-5xl font-extrabold text-gray-800 mb-4">{t("Great Job!", settings?.language)}</h2>
            <p className="text-2xl text-gray-600 mb-8">{t("You scored", settings?.language)} {score} {t("out of", settings?.language)} {level.testQuestions?.length || 0}</p>
            <button onClick={() => { setStep('COMPLETION'); awardStars(game.id, level.id, 3); unlockNextLevel(game.id, level.id); }} className="bg-yellow-400 border-b-[8px] border-yellow-500 text-yellow-900 px-10 py-5 rounded-full text-2xl font-black flex items-center justify-center gap-3">
              {t("Claim Stars!", settings?.language)} <Star size={28} className="fill-yellow-900" />
            </button>
          </motion.div>
        )}

        {step === 'COMPLETION' && (
          <motion.div key="completion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
            <Star size={160} className="text-yellow-400 fill-yellow-400 mb-8" />
            <h2 className="text-5xl font-extrabold text-gray-800 mb-12">{t("Level Complete!", settings?.language)}</h2>
            <div className="flex gap-6">
              <button onClick={() => { setStep('INTRO'); setScore(0); setTestIndex(0); }} className="bg-white border-b-[8px] border-gray-200 px-8 py-4 rounded-full text-xl font-bold">{t("Replay", settings?.language)}</button>
              <button onClick={() => onComplete(3)} className="bg-[#4ADE80] border-b-[8px] border-[#22C55E] text-white px-8 py-4 rounded-full text-xl font-bold">{t("Next Level", settings?.language)}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

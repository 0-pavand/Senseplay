import React, { useRef, useState, useEffect } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "motion/react";
import { Headphones, Volume2, Dog, Cat, VolumeX, CheckCircle2, RotateCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { Celebration } from "../components/Celebration";

export default function HearPlay() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Fixed Audio Ref Pattern
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const correctAnswer = "dog";

  const animals = [
    { 
      id: "dog", 
      name: "Dog", 
      icon: Dog, 
      color: "bg-orange-400", 
      border: "border-orange-600",
      soundUrl: "/sounds/dog-bark.mp3",
      voiceLabel: "The dog says woof woof"
    },
    { 
      id: "cat", 
      name: "Cat", 
      icon: Cat, 
      color: "bg-emerald-400", 
      border: "border-emerald-600",
      soundUrl: "https://www.soundjay.com/nature/sounds/cat-meow-1.mp3",
      voiceLabel: "The cat says meow"
    },
    { 
      id: "cow", 
      name: "Cow", 
      icon: Volume2, 
      color: "bg-blue-400", 
      border: "border-blue-600",
      soundUrl: "https://www.soundjay.com/nature/sounds/cow-moo-1.mp3",
      voiceLabel: "The cow says moo"
    },
    { 
      id: "goat", 
      name: "Goat", 
      icon: Volume2, 
      color: "bg-purple-400", 
      border: "border-purple-600",
      soundUrl: "https://www.soundjay.com/nature/sounds/goat-bleat-1.mp3",
      voiceLabel: "The goat says baa"
    },
  ];

  // Removed windowSize effect as Celebration handles it

  const playSound = (soundSource: string, isFallback: boolean = false) => {
    // 🎯 Requirement: Maintain optional mute setting
    if (!settings.soundEffects) return;

    // Support both local files and full URLs
    const url = soundSource.startsWith('http') ? soundSource : `/sounds/${soundSource}`;
    const audio = new Audio(url);
    
    // Stop current audio logic
    const isMajorSound = soundSource.includes('bark') || soundSource.includes('meow') || soundSource.includes('moo') || soundSource.includes('bleat') || soundSource === 'cat.mp3' || soundSource === 'dog-bark.mp3';
    
    if (isMajorSound && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = audio;
    }

    if (soundSource === "dog-bark.mp3" || soundSource.includes('dog-bark')) {
      setIsPlaying(true);
    }
    
    audio.play()
      .then(() => {
        audio.onended = () => {
          if (soundSource === "dog-bark.mp3" || soundSource.includes('dog-bark')) setIsPlaying(false);
        };
      })
      .catch((e) => {
        console.warn("Audio play failed, using voice fallback:", e);
        if (soundSource === "dog-bark.mp3" || soundSource.includes('dog-bark')) setIsPlaying(false);
        
        // Voice Fallback for "working model" if sounds are blocked or missing
        if (!isFallback) {
          const animal = animals.find(a => soundSource.includes(a.id));
          if (animal) {
            const utterance = new SpeechSynthesisUtterance(animal.voiceLabel);
            window.speechSynthesis.speak(utterance);
          }
        }
      });
  };

  const handleAnswer = (animalId: string) => {
    if (selected) return; // Prevent multiple clicks
    
    const animal = animals.find(a => a.id === animalId);
    setSelected(animalId);
    
    if (animal?.soundUrl) {
      playSound(animal.soundUrl);
    } else {
      playSound(`${animalId}.mp3`);
    }

    if (animalId === correctAnswer) {
      // 🎯 Requirement: Add a slight delay (300ms) after answer selection
      setTimeout(() => {
        setResult("Correct!");
        
        // 🎯 Requirement: Trigger sound + confetti together at the same time
        playSound("success.mp3");
        setShowConfetti(true);

        // 🎯 Requirement: Stop confetti after duration (3 seconds)
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }, 300);
    } else {
      setTimeout(() => {
        setResult("Oops! Try again!");
        playSound("error.mp3");
      }, 300);
    }
  };

  const resetGame = () => {
    setSelected(null);
    setResult(null);
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <Celebration active={showConfetti} />

      {/* Header / Nav */}
      <div className="fixed top-6 left-6 right-6 flex justify-between items-center max-w-xl mx-auto w-full">
        <button 
          onClick={() => navigate('/')}
          className="p-3 bg-white rounded-2xl shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"
        >
          <Home className="text-slate-600" />
        </button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border-b-4 border-slate-200">
          <Headphones className="text-blue-500" size={20} />
          <span className="font-black text-slate-700 uppercase tracking-wider text-sm">Hear & Play</span>
        </div>
      </div>

      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[3rem] shadow-xl border-b-[12px] border-slate-100 max-w-2xl w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400" />

        <div className="mb-8">
          <div className="inline-flex p-6 rounded-full bg-blue-50 mb-6">
            <Headphones size={64} className="text-blue-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Listen Closely!</h1>
          <p className="mt-4 text-xl font-bold text-slate-500 leading-relaxed">
            A dog says <span className="text-blue-500">"Woof Woof"</span>. <br />
            Can you tap the correct animal?
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound("dog-bark.mp3");
          }}
          animate={isPlaying ? { scale: [1, 1.1, 1], boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 20px rgba(59, 130, 246, 0.3)", "0px 0px 0px rgba(59, 130, 246, 0)"] } : {}}
          transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
          className={`flex items-center justify-center gap-4 mx-auto px-10 py-5 rounded-full text-2xl font-black border-b-[8px] transition-all shadow-lg
            ${isPlaying ? 'bg-emerald-500 border-emerald-700 text-white' : 'bg-blue-500 border-blue-700 text-white'}
          `}
        >
          {isPlaying ? <Volume2 size={32} /> : <Volume2 size={32} />}
          {isPlaying ? "PLAYING..." : "PLAY SOUND"}
        </motion.button>

        {/* Animal Grid */}
        <div className="grid grid-cols-2 gap-6 mt-12">
          {animals.map((animal) => {
            const isSelected = selected === animal.id;
            const isCorrect = animal.id === correctAnswer;
            const Icon = animal.icon;

            return (
              <motion.button
                key={animal.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(animal.id)}
                animate={isSelected && isCorrect ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
                className={`group relative p-6 rounded-[2.5rem] border-b-[8px] transition-all
                  ${isSelected 
                    ? (isCorrect 
                        ? 'bg-emerald-100 border-emerald-500 shadow-[0_0_20px_rgba(74,222,128,0.2)] animate-glow' 
                        : 'bg-red-100 border-red-500') 
                    : 'bg-slate-50 border-slate-200 hover:bg-white'}
                `}
              >
                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border-b-4 mb-4 transition-transform group-hover:rotate-6
                  ${animal.color} ${animal.border} text-white
                `}>
                  <Icon size={40} />
                </div>
                <span className="text-xl font-black text-slate-700 uppercase tracking-wide">
                  {animal.name}
                </span>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border-2 border-slate-100"
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={32} className="text-emerald-500" />
                      ) : (
                        <VolumeX size={32} className="text-red-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Result Feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              className={`mt-10 p-6 rounded-3xl font-black text-3xl flex flex-col items-center justify-center gap-6 shadow-lg animate-slide-up
                ${selected === correctAnswer 
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-b-8 border-emerald-800' 
                  : 'bg-gradient-to-br from-red-400 to-red-600 text-white border-b-8 border-red-800'}
              `}
            >
              <div className="flex items-center gap-4">
                {selected === correctAnswer ? <CheckCircle2 size={48} /> : <RotateCcw size={48} />}
                {result}
              </div>
              {selected === correctAnswer && (
                <button 
                  onClick={resetGame}
                  className="ml-4 bg-emerald-500 text-white px-6 py-2 rounded-full text-sm border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 transition-all font-black uppercase tracking-widest"
                >
                  Play Again
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer hint */}
      <p className="mt-8 text-slate-400 font-bold uppercase tracking-widest text-xs">
        SensePlay learning module
      </p>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, Moon, Sun, Contrast, Type, 
  Gauge, Activity, RotateCcw, Check, Target, AlertTriangle, X, LogOut
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';

export const SettingsPanel = () => {
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();
  const { resetProgress } = useProgress();
  const [showResetModal, setShowResetModal] = useState(false);

  const Toggle = ({ 
    label, 
    description, 
    checked, 
    onChange, 
    icon: Icon 
  }: { 
    label: string, 
    description: string, 
    checked: boolean, 
    onChange: (val: boolean) => void,
    icon: any
  }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${checked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{label}</h3>
          <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative w-16 h-8 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-200 ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
        aria-pressed={checked}
        aria-label={label}
      >
        <motion.div 
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm"
          animate={{ x: checked ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );

  const Selector = ({ 
    label, 
    description, 
    options, 
    value, 
    onChange, 
    icon: Icon 
  }: { 
    label: string, 
    description: string, 
    options: { value: string, label: string }[], 
    value: string, 
    onChange: (val: any) => void,
    icon: any
  }) => (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{label}</h3>
          <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
              ${value === opt.value 
                ? 'bg-purple-500 text-white shadow-md border-b-4 border-purple-700 translate-y-0' 
                : 'bg-gray-100 text-gray-600 border-b-4 border-gray-200 hover:bg-gray-200 active:border-b-0 active:translate-y-1'
              }
            `}
          >
            {value === opt.value && <Check size={16} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-[2rem] border-b-[6px] border-gray-200">
        <h2 className="text-3xl font-black text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-500 font-medium mb-6 text-lg">Customize your SensePlay experience.</p>
        
        <div className="flex flex-col gap-4">
          <Toggle 
            label="Focus Mode" 
            description="Calm theme, minimal UI, no distractions"
            checked={settings.focusMode}
            onChange={(val) => updateSetting('focusMode', val)}
            icon={Target}
          />

          <Toggle 
            label="Voice Guidance" 
            description="Spoken instructions for games"
            checked={settings.voiceGuidance}
            onChange={(val) => updateSetting('voiceGuidance', val)}
            icon={settings.voiceGuidance ? Volume2 : VolumeX}
          />
          
          <Toggle 
            label="Sound Effects" 
            description="Game sounds and feedback"
            checked={settings.soundEffects}
            onChange={(val) => updateSetting('soundEffects', val)}
            icon={Activity}
          />

          <Toggle 
            label="Dark Mode" 
            description="Easier on the eyes in low light"
            checked={settings.darkMode}
            onChange={(val) => updateSetting('darkMode', val)}
            icon={settings.darkMode ? Moon : Sun}
          />

          <Toggle 
            label="High Contrast" 
            description="Increase visibility of elements"
            checked={settings.highContrast}
            onChange={(val) => updateSetting('highContrast', val)}
            icon={Contrast}
          />

          <Toggle 
            label="Reduce Motion" 
            description="Minimize animations and movement"
            checked={settings.reduceMotion}
            onChange={(val) => updateSetting('reduceMotion', val)}
            icon={Gauge}
          />

          <Selector 
            label="Text Size"
            description="Adjust the size of text"
            icon={Type}
            value={settings.textSize}
            onChange={(val) => updateSetting('textSize', val)}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' }
            ]}
          />

          <Selector 
            label="Difficulty"
            description="Adjust game challenge level"
            icon={Activity}
            value={settings.difficulty}
            onChange={(val) => updateSetting('difficulty', val)}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' }
            ]}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border-b-[6px] border-gray-200 flex flex-col gap-4">
        <h3 className="font-black text-gray-800 text-xl">Data & Progress</h3>
        
        <button 
          onClick={() => {
            localStorage.removeItem('senseplay_logged_in');
            navigate('/login');
          }}
          className="w-full bg-slate-100 text-slate-700 font-black py-4 rounded-2xl border-b-[4px] border-slate-300 active:border-b-0 active:translate-y-[4px] transition-all flex items-center justify-center gap-2 text-lg"
        >
          <LogOut size={24} />
          LOG OUT
        </button>

        <button 
          onClick={() => setShowResetModal(true)}
          className="w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl border-b-[4px] border-red-200 active:border-b-0 active:translate-y-[4px] transition-all flex items-center justify-center gap-2 text-lg"
        >
          <RotateCcw size={24} />
          RESET ALL PROGRESS
        </button>
      </div>

      {/* Custom Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
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
              className="bg-white p-6 rounded-[2rem] border-b-[8px] border-gray-200 flex flex-col items-center text-center max-w-sm w-full relative"
            >
              <button 
                onClick={() => setShowResetModal(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 border-b-[4px] border-red-200">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              
              <h2 className="text-2xl font-black text-gray-800 mb-2">Reset Progress?</h2>
              <p className="text-gray-600 font-medium mb-6">
                Are you sure you want to reset all your progress? This will clear all your stars and unlocked items. This action cannot be undone.
              </p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 border-b-[4px] border-gray-300 active:border-b-0 active:translate-y-[4px] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    resetProgress();
                    setShowResetModal(false);
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold bg-red-500 text-white border-b-[4px] border-red-700 active:border-b-0 active:translate-y-[4px] transition-all"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

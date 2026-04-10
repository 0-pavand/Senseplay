import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'small' | 'medium' | 'large';
type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'en' | 'zh' | 'ja' | 'ta';

export type SettingsState = {
  language: Language;
  voiceGuidance: boolean;
  darkMode: boolean;
  highContrast: boolean;
  textSize: TextSize;
  difficulty: Difficulty;
  reduceMotion: boolean;
  soundEffects: boolean;
  focusMode: boolean;
};

const defaultSettings: SettingsState = {
  language: 'en',
  voiceGuidance: true,
  darkMode: false,
  highContrast: false,
  textSize: 'medium',
  difficulty: 'easy',
  reduceMotion: false,
  soundEffects: true,
  focusMode: false,
};

type SettingsContextType = {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('senseplay_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('senseplay_settings', JSON.stringify(settings));
    
    // Apply global classes based on settings
    const root = document.documentElement;
    
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Text size
    root.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    root.classList.add(`text-size-${settings.textSize}`);

    // Reduce motion
    if (settings.reduceMotion || settings.focusMode) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus mode
    if (settings.focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }

  }, [settings]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

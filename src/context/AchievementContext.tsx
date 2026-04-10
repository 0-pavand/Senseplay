import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useProgress } from './ProgressContext';
import { GAMES } from '../data/games';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: number;
};

export type Goal = {
  id: string;
  text: string;
  target: number;  // e.g. 5 levels
  type: 'levels' | 'stars';
  gameId: string | 'all';
  completed: boolean;
};

type AchievementContextType = {
  achievements: Achievement[];
  unlockedIds: string[];
  newAchievement: Achievement | null;
  clearNew: () => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  removeGoal: (id: string) => void;
  currentStats: { totalStars: number; totalLevels: number; completedGames: number };
};

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_level',    emoji: '🌟', title: 'First Step',       description: 'Complete your very first level!' },
  { id: 'five_levels',    emoji: '🔥', title: 'On Fire',          description: 'Complete 5 levels across any game.' },
  { id: 'ten_levels',     emoji: '🚀', title: 'Sky Rocket',       description: 'Complete 10 levels!' },
  { id: 'twenty_levels',  emoji: '🏆', title: 'Champion',         description: 'Complete 20 levels!' },
  { id: 'thirty_stars',   emoji: '⭐', title: 'Star Collector',   description: 'Earn 30 stars across all games.' },
  { id: 'sixty_stars',    emoji: '💫', title: 'Galaxy Brain',     description: 'Earn 60 stars!' },
  { id: 'sign_master',    emoji: '✋', title: 'Sign Master',      description: 'Complete all Sign & Play levels.' },
  { id: 'hear_master',    emoji: '👂', title: 'Sharp Ears',       description: 'Complete all Hear & Play levels.' },
  { id: 'learn_master',   emoji: '📚', title: 'Word Wizard',      description: 'Complete all Learn & Play levels.' },
  { id: 'see_master',     emoji: '👁️', title: 'Eagle Eye',        description: 'Complete all See & Identify levels.' },
  { id: 'all_games',      emoji: '🎉', title: 'SensePlay Hero',   description: 'Complete every game in SensePlay!' },
  { id: 'perfect_level',  emoji: '💎', title: 'Perfectionist',    description: 'Get 3 stars on any level.' },
];

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider = ({ children }: { children: React.ReactNode }) => {
  const { progress } = useProgress();
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('senseplay_achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('senseplay_goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate current stats
  const currentStats = React.useMemo(() => {
    let totalStars = 0;
    let totalLevels = 0;
    let completedGames = 0;
    GAMES.forEach(game => {
      const gameStars = progress.stars[game.id] || {};
      let gameLevels = 0;
      Object.values(gameStars).forEach(s => {
        if (typeof s === 'number' && s > 0) { totalStars += s; gameLevels += 1; }
      });
      totalLevels += gameLevels;
      if (gameLevels === game.levels.length) completedGames += 1;
    });
    return { totalStars, totalLevels, completedGames };
  }, [progress.stars]);

  // Evaluate which achievements should be unlocked
  useEffect(() => {
    const { totalStars, totalLevels, completedGames } = currentStats;

    const shouldUnlock: string[] = [];

    if (totalLevels >= 1)  shouldUnlock.push('first_level');
    if (totalLevels >= 5)  shouldUnlock.push('five_levels');
    if (totalLevels >= 10) shouldUnlock.push('ten_levels');
    if (totalLevels >= 20) shouldUnlock.push('twenty_levels');
    if (totalStars  >= 30) shouldUnlock.push('thirty_stars');
    if (totalStars  >= 60) shouldUnlock.push('sixty_stars');
    if (completedGames >= 4) shouldUnlock.push('all_games');

    // Perfect level
    const hasPerfect = GAMES.some(game =>
      Object.values(progress.stars[game.id] || {}).some(s => s >= 3)
    );
    if (hasPerfect) shouldUnlock.push('perfect_level');

    // Per-game mastery
    const gameMasters = [
      { gameId: 'sign-and-play',    achId: 'sign_master' },
      { gameId: 'listen-and-guess', achId: 'hear_master' },
      { gameId: 'shape-sorter',     achId: 'learn_master' },
      { gameId: 'see-and-identify', achId: 'see_master' },
    ];
    gameMasters.forEach(({ gameId, achId }) => {
      const game = GAMES.find(g => g.id === gameId);
      if (!game) return;
      const completedCount = Object.values(progress.stars[gameId] || {}).filter(s => typeof s === 'number' && s > 0).length;
      if (completedCount === game.levels.length) shouldUnlock.push(achId);
    });

    // Find newly unlocked
    const newlyUnlocked = shouldUnlock.filter(id => !unlockedIds.includes(id));
    if (newlyUnlocked.length > 0) {
      const firstNew = ALL_ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
      if (firstNew) setNewAchievement(firstNew);
      const updated = [...unlockedIds, ...newlyUnlocked];
      setUnlockedIds(updated);
      localStorage.setItem('senseplay_achievements', JSON.stringify(updated));
    }
  }, [currentStats, progress.stars]);

  // Update goals completion
  useEffect(() => {
    const { totalStars, totalLevels } = currentStats;
    setGoals(prev => prev.map(goal => {
      if (goal.completed) return goal;
      const current = goal.type === 'stars' ? totalStars : totalLevels;
      return { ...goal, completed: current >= goal.target };
    }));
  }, [currentStats]);

  useEffect(() => {
    localStorage.setItem('senseplay_goals', JSON.stringify(goals));
  }, [goals]);

  const clearNew = useCallback(() => setNewAchievement(null), []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'completed'>) => {
    const newGoal: Goal = { ...goal, id: Date.now().toString(), completed: false };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const removeGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  return (
    <AchievementContext.Provider value={{
      achievements: ALL_ACHIEVEMENTS,
      unlockedIds,
      newAchievement,
      clearNew,
      goals,
      addGoal,
      removeGoal,
      currentStats,
    }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider');
  return ctx;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

type ProgressState = {
  unlockedLevels: Record<string, string[]>; // gameId -> array of levelIds
  stars: Record<string, Record<string, number>>; // gameId -> levelId -> stars
  unlockedProducts: string[];
  spentPoints: number;
};

const defaultState: ProgressState = {
  unlockedLevels: {
    'sign-and-play': ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10'],
    'listen-and-guess': ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10'],
    'shape-sorter': ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10'],
    'see-and-identify': ['l1', 'l2', 'l3', 'l4', 'l5']
  },
  stars: {},
  unlockedProducts: [],
  spentPoints: 0
};

type ProgressContextType = {
  progress: ProgressState;
  unlockNextLevel: (gameId: string, currentLevelId: string) => void;
  awardStars: (gameId: string, levelId: string, stars: number) => void;
  unlockProduct: (productId: string, cost: number) => void;
  resetProgress: () => void;
  resetStore: () => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem('senseplay_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all levels are unlocked even if loading from older save
      return {
        ...parsed,
        unlockedLevels: defaultState.unlockedLevels,
        unlockedProducts: parsed.unlockedProducts || [],
        spentPoints: parsed.spentPoints || 0
      };
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('senseplay_progress', JSON.stringify(progress));
  }, [progress]);

  const unlockNextLevel = (gameId: string, currentLevelId: string) => {
    setProgress(prev => {
      const gameLevels = prev.unlockedLevels[gameId] || [];
      // Simple logic: if l1 is completed, unlock l2. 
      // We assume level IDs are l1, l2, l3...
      const currentNum = parseInt(currentLevelId.replace('l', ''));
      const nextLevelId = `l${currentNum + 1}`;
      
      if (!gameLevels.includes(nextLevelId)) {
        return {
          ...prev,
          unlockedLevels: {
            ...prev.unlockedLevels,
            [gameId]: [...gameLevels, nextLevelId]
          }
        };
      }
      return prev;
    });
  };

  const awardStars = (gameId: string, levelId: string, stars: number) => {
    setProgress(prev => {
      const gameStars = prev.stars[gameId] || {};
      const currentStars = gameStars[levelId] || 0;
      
      if (stars > currentStars) {
        return {
          ...prev,
          stars: {
            ...prev.stars,
            [gameId]: {
              ...gameStars,
              [levelId]: stars
            }
          }
        };
      }
      return prev;
    });
  };

  const unlockProduct = (productId: string, cost: number) => {
    setProgress(prev => {
      if (!prev.unlockedProducts.includes(productId)) {
        return {
          ...prev,
          unlockedProducts: [...prev.unlockedProducts, productId],
          spentPoints: prev.spentPoints + cost
        };
      }
      return prev;
    });
  };

  const resetProgress = () => {
    setProgress(defaultState);
  };

  const resetStore = () => {
    setProgress(prev => ({
      ...prev,
      unlockedProducts: [],
      spentPoints: 0
    }));
  };

  return (
    <ProgressContext.Provider value={{ progress, unlockNextLevel, awardStars, unlockProduct, resetProgress, resetStore }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

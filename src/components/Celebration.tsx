import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

interface CelebrationProps {
  active: boolean;
  duration?: number;
}

export const Celebration: React.FC<CelebrationProps> = ({ active, duration = 3000 }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />
    </div>
  );
};

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { GAMES } from '../data/games';
import { LevelFlow } from '../components/LevelFlow';
import { CertificateModal } from '../components/CertificateModal';
import { useProgress } from '../context/ProgressContext';
import { useSettings } from '../context/SettingsContext';
import { translate as t } from '../lib/i18n';

export const LevelScreen = () => {
  const { gameId, levelId } = useParams();
  const navigate = useNavigate();
  const { progress, unlockNextLevel, awardStars } = useProgress();
  const { settings } = useSettings();

  const game = GAMES.find(g => g.id === gameId);
  const level = game?.levels.find(l => l.id === levelId);

  if (!game || !level) return <div className="p-8 text-center font-bold text-xl">Level not found</div>;

  const [showCertificate, setShowCertificate] = React.useState(false);
  const [totalStars, setTotalStars] = React.useState(0);

  const handleComplete = (stars: number) => {
    awardStars(game.id, level.id, stars);
    unlockNextLevel(game.id, level.id);

    // Check if this was the last level
    const isLastLevel = game.levels[game.levels.length - 1].id === level.id;
    
    // Check if all levels are now completed (count stars in progress)
    const gameStars = progress.stars[game.id] || {};
    const newlyCompletedCount = Object.values(gameStars).filter(s => typeof s === 'number' && s > 0).length + (gameStars[level.id] ? 0 : 1);
    
    if (isLastLevel || newlyCompletedCount === game.levels.length) {
       // Calculate total stars
       let sum = 0;
       game.levels.forEach(l => {
         sum += (l.id === level.id ? stars : (gameStars[l.id] || 0));
       });
       setTotalStars(sum);
       setShowCertificate(true);
    } else {
       // Go to the next level immediately
       const currentIndex = game.levels.findIndex(l => l.id === level.id);
       const nextLevel = game.levels[currentIndex + 1];
       navigate(`/game/${game.id}/level/${nextLevel.id}`);
    }
  };

  const handleCloseCertificate = () => {
    setShowCertificate(false);
    navigate(`/game/${game.id}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-12 selection:bg-orange-200 flex flex-col">
      <header className="p-6 flex items-center gap-4 w-full max-w-4xl mx-auto">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/game/${gameId}`)}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border-b-[4px] border-gray-200 active:border-b-0 active:translate-y-[4px] transition-all"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-800">{t(game.title, settings.language)}</h1>
          <p className="text-sm font-bold text-gray-500">{t(level.title, settings.language)}</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative">
        <LevelFlow key={level.id} game={game} level={level} onComplete={handleComplete} />
        {showCertificate && (
          <CertificateModal 
            gameName={t(game.title, settings.language)}
            gameEmoji={game.title.includes('Sign') ? '✋' : game.title.includes('Hear') ? '👂' : game.title.includes('Learn') ? '📚' : '👁️'}
            totalStars={totalStars}
            onClose={handleCloseCertificate}
          />
        )}
      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Star, Heart, Home, Book, BarChart2, Settings, Play, RotateCcw, MessageSquare, ShoppingBag, Target, Users, Globe
} from 'lucide-react';
import { GAMES } from '../data/games';
import { useProgress } from '../context/ProgressContext';
import { useSettings } from '../context/SettingsContext';
import { SettingsPanel } from '../components/SettingsPanel';
import { RankPanel } from '../components/RankPanel';
import { GoalPanel } from '../components/GoalPanel';
import { CommunityWall } from '../components/CommunityWall';

const TRANSLATIONS = {
  en: {
    play: "Let's play, Jamie!",
    pick: "Pick a toybox to start!",
    rewards: "Rewards",
    help: "Help",
    nav: { home: 'Home', review: 'Review', rank: 'Rank', goals: 'Goals', community: 'Friends', settings: 'Settings' },
    card: { start: 'START', continue: 'CONTINUE', done: 'DONE!', replay: 'REPLAY' },
    games: {
      'sign-and-play': 'Sign & Play',
      'listen-and-guess': 'Listen & Guess',
      'shape-sorter': 'Shape Sorter',
      'see-and-identify': 'See & Identify'
    },
    reviewTitle: "Review",
    reviewDesc: "Here is your learning progress."
  },
  zh: {
    play: "我们玩吧，Jamie！",
    pick: "选择玩具箱开始吧！",
    rewards: "奖励",
    help: "帮助",
    nav: { home: '主页', review: '复习', rank: '排名', goals: '目标', community: '朋友', settings: '设置' },
    card: { start: '开始', continue: '继续', done: '完成！', replay: '重玩' },
    games: {
      'sign-and-play': '手语与游戏',
      'listen-and-guess': '聆听与猜迷',
      'shape-sorter': '形状分类',
      'see-and-identify': '观察与识别'
    },
    reviewTitle: "复习",
    reviewDesc: "这是你的学习进度。"
  },
  ja: {
    play: "遊ぼう、Jamie！",
    pick: "おもちゃ箱を選んで始めよう！",
    rewards: "報酬",
    help: "ヘルプ",
    nav: { home: 'ホーム', review: '復習', rank: 'ランク', goals: '目標', community: '友達', settings: '設定' },
    card: { start: 'スタート', continue: '続く', done: '完了！', replay: 'リプレイ' },
    games: {
      'sign-and-play': '手話と遊び',
      'listen-and-guess': '聞いて当てる',
      'shape-sorter': '形合わせ',
      'see-and-identify': '見て識別する'
    },
    reviewTitle: "復習",
    reviewDesc: "あなたの学習の進捗です。"
  },
  ta: {
    play: "விளையாடலாம், ஜேமி!",
    pick: "தொடங்க ஒரு விளையாட்டு பெட்டியைத் தேர்ந்தெடுக்கவும்!",
    rewards: "வெகுமதிகள்",
    help: "உதவி",
    nav: { home: 'முகப்பு', review: 'மீள்பார்வை', rank: 'தரவரிசை', goals: 'இலக்குகள்', community: 'நண்பர்கள்', settings: 'அமைப்புகள்' },
    card: { start: 'தொடங்கு', continue: 'தொடரவும்', done: 'முடிந்தது!', replay: 'மீண்டும் விளையாடு' },
    games: {
      'sign-and-play': 'சைகை & விளையாடு',
      'listen-and-guess': 'கேட்பது & கணிப்பது',
      'shape-sorter': 'வடிவங்களை பிரித்தல்',
      'see-and-identify': 'பார்த்து அடையாளம் காண்'
    },
    reviewTitle: "மீள்பார்வை",
    reviewDesc: "உங்கள் கற்றல் முன்னேற்றம்."
  }
};

const StatPill = ({ icon: Icon, color, value }: { icon: any, color: string, value: string | number }) => (
  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border-b-[3px] border-gray-200">
    <Icon size={16} className={color} fill="currentColor" />
    <span className="font-bold text-gray-700 text-sm">{value}</span>
  </div>
);

const GameCard = ({ game, onClick, lang }: { key?: React.Key, game: any, onClick: () => void, lang: 'en'|'zh'|'ja'|'ta' }) => {
  const [fill, setFill] = useState(0);
  const { progress } = useProgress();
  const { settings } = useSettings();
  const Icon = game.icon;
  const t = TRANSLATIONS[lang];
  
  const unlockedLevels = progress.unlockedLevels[game.id] || [];
  const totalLevels = game.levels.length;
  const completedLevels = game.levels.filter((l: any) => progress.stars[game.id]?.[l.id] > 0);
  const progressPercent = Math.round((completedLevels.length / totalLevels) * 100);
  const isCompleted = completedLevels.length === totalLevels;

  useEffect(() => {
    const timer = setTimeout(() => setFill(progressPercent), 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  const bgClass = settings.focusMode ? 'bg-slate-700' : game.bg;
  const borderClass = settings.focusMode ? 'border-slate-800' : game.borderBg;

  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden p-5 rounded-[2rem] ${bgClass} ${borderClass} border-b-[8px] flex flex-col gap-4 text-white cursor-pointer`}
    >
      <div className="absolute -bottom-8 -right-8 opacity-20 rotate-12 pointer-events-none focus-hide">
        <Icon size={140} />
      </div>

      <div className="flex gap-4 relative z-10">
        <div className="w-16 h-16 shrink-0 bg-white/20 rounded-full flex items-center justify-center border-b-[4px] border-black/10">
          <Icon size={32} className="text-white" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-extrabold text-xl leading-tight">{t.games[game.id as keyof typeof t.games] || game.title}</h3>
            {isCompleted && <Star size={20} className="text-yellow-300 drop-shadow-sm" fill="currentColor" />}
          </div>

          {!isCompleted ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 h-3.5 bg-black/20 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${fill}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <button className={`bg-white px-5 py-2 rounded-full font-extrabold text-sm border-b-[4px] border-gray-200 active:border-b-0 active:translate-y-[4px] transition-all text-gray-800`}>
                {progressPercent === 0 ? t.card.start : t.card.continue}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3.5 bg-black/20 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${fill}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <span className="font-extrabold text-sm tracking-wide">{t.card.done}</span>
            </div>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="flex justify-between items-end mt-1 relative z-10">
          <button className="bg-white text-teal-700 px-6 py-2.5 rounded-full font-extrabold text-sm border-b-[4px] border-gray-200 active:border-b-0 active:translate-y-[4px] transition-all">
            {t.card.replay}
          </button>
          <button className="bg-[#FF6B35] text-white w-14 h-14 rounded-full flex items-center justify-center border-b-[4px] border-[#D95A2B] active:border-b-0 active:translate-y-[4px] transition-all shadow-lg">
            <Play size={24} fill="currentColor" className="ml-1" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { settings, updateSetting } = useSettings();
  
  const lang = settings.language;
  
  // Calculate total stars
  let totalStars = 0;
  Object.values(progress.stars).forEach(gameStars => {
    Object.values(gameStars).forEach(stars => {
      totalStars += stars;
    });
  });
  
  const availablePoints = (totalStars * 800) - (progress.spentPoints || 0);

  return (
    <div className="min-h-screen bg-white font-sans pb-32 selection:bg-orange-200">
      <header className="p-6 flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-300 border-[3px] border-white shadow-md overflow-hidden shrink-0">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=b6e3f4" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-xl text-gray-800 tracking-tight">
            {lang === 'ta' ? 'சென்ஸ் ப்ளே' : 'SensePlay'}
          </span>
          <button 
            onClick={() => updateSetting('language', lang === 'en' ? 'zh' : lang === 'zh' ? 'ja' : lang === 'ja' ? 'ta' : 'en')}
            className="ml-2 flex items-center gap-1 bg-white px-2 py-1 rounded-full border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 active:translate-y-[2px] transition-all"
          >
            <Globe size={14} />
            {lang === 'en' ? 'EN' : lang === 'zh' ? '中文' : lang === 'ja' ? '日本語' : 'தமிழ்'}
          </button>
        </div>
        <div className="flex gap-2 focus-hide">
          <StatPill icon={Flame} color="text-orange-500" value="12" />
          <StatPill icon={Star} color="text-yellow-400" value={availablePoints >= 1000 ? `${(availablePoints / 1000).toFixed(1)}k` : availablePoints} />
          <StatPill icon={Heart} color="text-red-500" value="5" />
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-1">{TRANSLATIONS[lang].play}</h1>
            <p className="text-lg font-bold text-gray-500">{TRANSLATIONS[lang].pick}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/store')}
              className="flex flex-col items-center gap-1 bg-green-100 text-green-700 p-2 rounded-xl border-b-[4px] border-green-300 active:border-b-0 active:translate-y-1 transition-all focus-hide"
            >
              <ShoppingBag size={24} className="fill-green-200" />
              <span className="text-[10px] font-black uppercase tracking-wider">{TRANSLATIONS[lang].rewards}</span>
            </button>
            <button 
              onClick={() => navigate('/feedback')}
              className="flex flex-col items-center gap-1 bg-yellow-100 text-yellow-700 p-2 rounded-xl border-b-[4px] border-yellow-300 active:border-b-0 active:translate-y-1 transition-all focus-hide"
            >
              <MessageSquare size={24} className="fill-yellow-200" />
              <span className="text-[10px] font-black uppercase tracking-wider">{TRANSLATIONS[lang].help}</span>
            </button>
          </div>
        </div>

        {activeTab === 'settings' ? (
          <SettingsPanel />
        ) : activeTab === 'review' ? (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[2rem] border-b-[6px] border-gray-200">
              <h2 className="text-2xl font-black text-gray-800 mb-4">{TRANSLATIONS[lang].reviewTitle}</h2>
              <p className="text-gray-500 font-medium mb-6">{TRANSLATIONS[lang].reviewDesc}</p>
              <div className="flex flex-col gap-4">
                {GAMES.map(game => {
                  const completed = game.levels.filter(l => progress.stars[game.id]?.[l.id] > 0).length;
                  const total = game.levels.length;
                  const Icon = game.icon;
                  return (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${game.bg} text-white`}>
                          <Icon size={20} />
                        </div>
                        <span className="font-bold text-gray-700">{TRANSLATIONS[lang].games[game.id as keyof typeof TRANSLATIONS['en']['games']] || game.title}</span>
                      </div>
                      <span className="font-black text-gray-500">{completed} / {total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeTab === 'rank' ? (
          <RankPanel />
        ) : activeTab === 'goals' ? (
          <GoalPanel />
        ) : activeTab === 'community' ? (
          <CommunityWall />
        ) : (
          <div className="flex flex-col gap-6">
            {GAMES.map(game => (
              <GameCard 
                key={game.id}
                game={game}
                lang={lang}
                onClick={() => navigate(`/game/${game.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-6 py-5 pb-8 flex justify-between items-center z-50 max-w-md mx-auto border-t border-gray-100">
        {[
          { id: 'home',      icon: Home },
          { id: 'review',    icon: Book },
          { id: 'rank',      icon: BarChart2 },
          { id: 'goals',     icon: Target },
          { id: 'community', icon: Users },
          { id: 'settings',  icon: Settings },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const label = TRANSLATIONS[lang].nav[tab.id as keyof typeof TRANSLATIONS['en']['nav']];
          return (
            <motion.div 
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => tab.isRoute ? navigate('/store') : setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className={`p-2.5 rounded-2xl transition-colors ${isActive ? 'bg-orange-50' : 'bg-transparent'}`}>
                <Icon size={26} className={isActive ? 'text-[#FF6B35]' : 'text-gray-400'} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${isActive ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Star, Award, Target, CheckCircle2, Zap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { GAMES } from '../data/games';
import { useSettings } from '../context/SettingsContext';

// ── static mock rivals (their score won't change, but YOU can beat them) ──────
const MOCK_USERS = [
  { id: '1', name: 'Alex',   stars: 38, levels: 13, avatar: 'A', color: 'bg-pink-400' },
  { id: '2', name: 'Sam',    stars: 28, levels: 10, avatar: 'S', color: 'bg-emerald-400' },
  { id: '3', name: 'Jordan', stars: 20, levels:  7, avatar: 'J', color: 'bg-violet-400' },
  { id: '4', name: 'Casey',  stars: 14, levels:  5, avatar: 'C', color: 'bg-cyan-400' },
  { id: '5', name: 'Riley',  stars:  8, levels:  3, avatar: 'R', color: 'bg-rose-400' },
];

const SECTIONS = [
  { id: 'all',            label: 'All Games' },
  ...GAMES.map(g => ({ id: g.id, label: g.title })),
];

const rankBadge = (stars: number) => {
  if (stars >= 60) return { label: 'Legend',   color: 'text-yellow-600 bg-yellow-100 border-yellow-300',   Icon: Trophy };
  if (stars >= 30) return { label: 'Pro',       color: 'text-purple-600 bg-purple-100 border-purple-300',   Icon: Trophy };
  if (stars >= 12) return { label: 'Explorer',  color: 'text-blue-600   bg-blue-100   border-blue-300',     Icon: Star };
  return              { label: 'Beginner', color: 'text-gray-500  bg-gray-100   border-gray-300',     Icon: Award };
};

export const RankPanel = () => {
  const { progress } = useProgress();
  const { settings } = useSettings();
  const [filter, setFilter] = useState('all');

  // ── real-time player stats ─────────────────────────────────────────────────
  const { userStars, userLevels, perGame } = useMemo(() => {
    let totalStars = 0;
    let totalLevels = 0;
    const perGame: Record<string, { stars: number; levels: number }> = {};

    GAMES.forEach(game => {
      const gameStars = progress.stars[game.id] || {};
      let gs = 0, gl = 0;
      Object.values(gameStars).forEach(s => {
        if (typeof s === 'number' && s > 0) { gs += s; gl += 1; }
      });
      perGame[game.id] = { stars: gs, levels: gl };
      totalStars  += gs;
      totalLevels += gl;
    });

    return { userStars: totalStars, userLevels: totalLevels, perGame };
  }, [progress.stars]);

  // filtered stats
  const filteredStars  = filter === 'all' ? userStars  : (perGame[filter]?.stars  ?? 0);
  const filteredLevels = filter === 'all' ? userLevels : (perGame[filter]?.levels ?? 0);

  // accuracy: avg stars across completed levels (max 3 each)
  const accuracy = filteredLevels > 0
    ? Math.round((filteredStars / (filteredLevels * 3)) * 100)
    : 0;

  // total possible levels for filtered game
  const totalPossible = filter === 'all'
    ? GAMES.reduce((sum, g) => sum + g.levels.length, 0)
    : (GAMES.find(g => g.id === filter)?.levels.length ?? 0);

  const completion = totalPossible > 0 ? Math.round((filteredLevels / totalPossible) * 100) : 0;

  const badge = rankBadge(userStars);

  // ── leaderboard: mock rivals scaled per section, then insert "You" ─────────
  const board = useMemo(() => {
    const scale = filter === 'all' ? 1 : (1 / GAMES.length);
    const rivals = MOCK_USERS.map(u => ({
      ...u,
      stars:  Math.round(u.stars  * scale),
      levels: Math.round(u.levels * scale),
      isMe: false,
    }));
    const me = { id: 'me', name: 'You', stars: filteredStars, levels: filteredLevels, avatar: '😊', color: 'bg-blue-500', isMe: true };
    return [...rivals, me].sort((a, b) => b.stars - a.stars || b.levels - a.levels);
  }, [filter, filteredStars, filteredLevels]);

  const myRank = board.findIndex(u => u.isMe) + 1;

  const card = settings.focusMode
    ? 'bg-slate-800 border-slate-700 text-slate-100'
    : 'bg-white border-gray-200 text-gray-800';
  const sub = settings.focusMode ? 'text-slate-400' : 'text-gray-500';

  return (
    <div className="flex flex-col gap-6 pb-24">

      {/* ── Filter chips ─────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {SECTIONS.map(sec => {
          const game = GAMES.find(g => g.id === sec.id);
          const isActive = filter === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setFilter(sec.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-black border-b-[4px] transition-all active:border-b-0 active:translate-y-1 flex items-center gap-1.5
                ${isActive
                  ? game ? `${game.bg} ${game.borderBg} text-white` : 'bg-blue-500 border-blue-700 text-white'
                  : settings.focusMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }
              `}
            >
              {game && <game.icon size={14} />}
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* ── Hero: Your Rank ──────────────────────────────────────────── */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 border-b-[8px] border-indigo-900 text-white p-6 shadow-2xl"
      >
        <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
          <Trophy size={180} />
        </div>

        {/* Rank + Badge */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-200 font-bold uppercase tracking-widest text-xs mb-1">Your Rank</p>
            <motion.div
              key={myRank}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              className="flex items-end gap-2"
            >
              <span className="text-6xl font-black tracking-tighter">#{myRank}</span>
              <span className="text-lg font-bold text-blue-200 mb-2">/ {board.length}</span>
            </motion.div>
          </div>
          <div className={`flex flex-col items-center p-3 rounded-2xl border-2 ${badge.color} shadow-lg`}>
            <badge.Icon size={28} className="mb-1" />
            <span className="text-[11px] font-black uppercase tracking-wider">{badge.label}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { Icon: Star,          label: 'Stars',      value: filteredStars,  color: 'text-yellow-300 fill-yellow-300' },
            { Icon: CheckCircle2,  label: 'Levels',     value: filteredLevels, color: 'text-green-300' },
            { Icon: Target,        label: 'Accuracy',   value: `${accuracy}%`, color: 'text-red-300' },
          ].map(({ Icon, label, value, color }) => (
            <div key={label} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center gap-1">
              <Icon size={22} className={color} />
              <motion.span
                key={String(value)}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-black"
              >
                {value}
              </motion.span>
              <span className="text-[10px] font-bold uppercase text-blue-100 tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        {/* Completion bar */}
        <div className="relative z-10 mt-5">
          <div className="flex justify-between text-xs font-bold text-blue-200 mb-1.5">
            <span>Completion</span>
            <span>{filteredLevels} / {totalPossible} levels</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Per-game breakdown (only in "all" view) ───────────────────── */}
      {filter === 'all' && (
        <div className={`${card} border-b-[6px] p-6 rounded-[2rem]`}>
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" /> Section Scores
          </h3>
          <div className="flex flex-col gap-3">
            {GAMES.map(game => {
              const { stars, levels } = perGame[game.id] ?? { stars: 0, levels: 0 };
              const pct = game.levels.length > 0 ? (levels / game.levels.length) * 100 : 0;
              const Icon = game.icon;
              return (
                <div key={game.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${game.bg} text-white shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className={sub}>{game.title}</span>
                      <span className="flex items-center gap-0.5 text-yellow-500 font-black">
                        <Star size={11} className="fill-yellow-500" />{stars}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className={`h-full rounded-full ${game.bg}`}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-black ${sub} w-10 text-right`}>{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Leaderboard ───────────────────────────────────────────────── */}
      <div className={`${card} border-b-[6px] p-6 rounded-[2rem]`}>
        <h3 className="font-black text-xl mb-5">🏆 Leaderboard</h3>
        <AnimatePresence mode="popLayout">
          {board.map((user, index) => {
            const medals = [
              'bg-yellow-100 text-yellow-600 border-yellow-300',
              'bg-gray-200   text-gray-600   border-gray-400',
              'bg-orange-100 text-orange-700 border-orange-300',
            ];
            const medalIcons = [
              <Trophy key="g" size={18} className="text-yellow-500 fill-yellow-400" />,
              <Medal  key="s" size={18} className="text-gray-500  fill-gray-400" />,
              <Medal  key="b" size={18} className="text-orange-600 fill-orange-400" />,
            ];
            const isTop3 = index < 3;

            return (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 mb-3 last:mb-0 transition-all
                  ${user.isMe
                    ? (settings.focusMode ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-400 ring-2 ring-blue-300 shadow-lg')
                    : (settings.focusMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100')
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 shrink-0
                    ${isTop3 ? medals[index] : (settings.focusMode ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-gray-100 text-gray-500 border-gray-200')}
                  `}>
                    {isTop3 ? medalIcons[index] : `#${index + 1}`}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black text-white shadow shrink-0 ${user.color}`}>
                    {user.avatar}
                  </div>

                  <div>
                    <h4 className={`font-black text-lg leading-tight ${user.isMe ? 'text-blue-600' : (settings.focusMode ? 'text-slate-100' : 'text-gray-800')}`}>
                      {user.name} {user.isMe && <span className="text-xs font-bold ml-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">YOU</span>}
                    </h4>
                    <p className={`text-xs font-medium ${sub}`}>{user.levels} levels completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border-2 border-yellow-200 shrink-0">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <motion.span
                    key={user.stars}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="font-black text-yellow-700"
                  >
                    {user.stars}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

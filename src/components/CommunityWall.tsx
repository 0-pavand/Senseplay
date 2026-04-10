import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Trophy, Award } from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';

const COMMUNITY_POSTS = [
  { id: '1', name: 'Aisha',  avatar: '👧', color: 'bg-pink-400',   text: 'Just completed all Sign & Play levels! Never giving up 💪', time: '2m ago',  likes: 34, achievement: '✋ Sign Master' },
  { id: '2', name: 'Ravi',   avatar: '👦', color: 'bg-blue-400',   text: 'Earned 30 stars today. Feeling proud of myself!', time: '15m ago', likes: 22, achievement: '⭐ Star Collector' },
  { id: '3', name: 'Emma',   avatar: '👩', color: 'bg-purple-400', text: 'The camera mode is so fun — finally signed HELLO perfectly!', time: '1h ago',  likes: 51, achievement: null },
  { id: '4', name: 'Carlos', avatar: '🧑', color: 'bg-green-400',  text: 'SensePlay helped me learn 10 new signs this week 🙌', time: '2h ago',  likes: 18, achievement: '🚀 Sky Rocket' },
  { id: '5', name: 'Priya',  avatar: '👧', color: 'bg-orange-400', text: "Got my first certificate! Framed it on my wall 😄", time: '3h ago',  likes: 67, achievement: '🎉 SensePlay Hero' },
  { id: '6', name: 'Leo',    avatar: '👦', color: 'bg-teal-400',   text: 'Tip: hold the HELLO sign for 1.2 seconds to get the AI to recognize it!', time: '5h ago',  likes: 44, achievement: null },
];

const WORLD_STATS = [
  { label: 'Learners', value: '12,483', emoji: '👥' },
  { label: 'Levels Done', value: '89,241', emoji: '✅' },
  { label: 'Stars Earned', value: '241,095', emoji: '⭐' },
];

export const CommunityWall = () => {
  const { achievements, unlockedIds, currentStats } = useAchievements();
  const unlockedAchievements = achievements.filter(a => unlockedIds.includes(a.id));

  return (
    <div className="flex flex-col gap-6 pb-24">

      {/* World Stats */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-[2.5rem] p-6 text-white shadow-xl border-b-[6px] border-teal-800">
        <p className="text-teal-100 text-xs font-black uppercase tracking-widest mb-1">Global Community</p>
        <h2 className="text-3xl font-black mb-4">Together We Learn 🌍</h2>
        <div className="grid grid-cols-3 gap-3">
          {WORLD_STATS.map(s => (
            <div key={s.label} className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-xl mb-0.5">{s.emoji}</p>
              <p className="font-black text-sm">{s.value}</p>
              <p className="text-teal-100 text-[10px] font-bold uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Achievements */}
      <div className="bg-white rounded-[2rem] border-b-[4px] border-gray-200 p-5">
        <h3 className="font-black text-xl text-gray-800 mb-4 flex items-center gap-2">
          <Trophy size={22} className="text-yellow-500" /> My Achievements
        </h3>

        {unlockedAchievements.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Award size={40} className="mx-auto mb-2 opacity-40" />
            <p className="font-bold">Complete your first level to earn achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {unlockedAchievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-center"
              >
                <span className="text-2xl mb-1">{ach.emoji}</span>
                <p className="text-xs font-black text-yellow-800 leading-tight">{ach.title}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Locked achievements */}
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Locked ({achievements.length - unlockedAchievements.length} remaining)</p>
          <div className="flex gap-2 flex-wrap">
            {achievements
              .filter(a => !unlockedIds.includes(a.id))
              .map(ach => (
                <div key={ach.id} className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                  <span className="grayscale opacity-40 text-base">{ach.emoji}</span>
                  <span className="text-xs text-gray-400 font-bold">{ach.title}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Community Feed */}
      <div>
        <h3 className="font-black text-xl text-gray-800 mb-4">🔥 Community Feed</h3>
        <div className="flex flex-col gap-4">
          {COMMUNITY_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-[2rem] border-b-[4px] border-gray-200 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl ${post.color} flex items-center justify-center text-2xl shadow`}>
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-800">{post.name}</p>
                  <p className="text-xs text-gray-400 font-medium">{post.time}</p>
                </div>
                {post.achievement && (
                  <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full text-[10px] font-black">
                    {post.achievement}
                  </span>
                )}
              </div>
              <p className="text-gray-700 font-medium text-sm leading-relaxed mb-3">{post.text}</p>
              <div className="flex items-center gap-1.5 text-red-400">
                <Heart size={16} className="fill-red-400" />
                <span className="font-bold text-sm">{post.likes}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

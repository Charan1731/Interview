"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { getLeaderboard as fetchLeaderboard } from '@/lib/actions/clinical.action';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await fetchLeaderboard(filter === 'all' ? undefined : filter);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500 bg-yellow-500/20';
      case 2: return 'text-gray-400 bg-gray-400/20';
      case 3: return 'text-orange-500 bg-orange-500/20';
      default: return 'text-primary-200 bg-primary-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Leaderboard</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="bg-dark-200 border border-neutral-700 rounded-lg px-3 py-2 text-white"
        >
          <option value="all">All Specialties</option>
          <option value="cardiology">Cardiology</option>
          <option value="neurology">Neurology</option>
          <option value="emergency">Emergency Medicine</option>
          <option value="internal">Internal Medicine</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-dark-200 rounded-xl h-20"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <Card 
              key={entry.userId} 
              className={`p-6 transition-all duration-300 hover:scale-105 ${
                entry.rank <= 3 
                  ? 'bg-gradient-to-r from-primary-500/10 to-primary-300/10 border-primary-500/30' 
                  : 'bg-dark-200 border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {entry.userName}
                  </h3>
                  {entry.specialty && (
                    <p className="text-sm text-light-100">
                      Specialty: {entry.specialty}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-200">
                      {entry.totalScore}
                    </p>
                    <p className="text-xs text-light-100">Total Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success-100">
                      {entry.casesCompleted}
                    </p>
                    <p className="text-xs text-light-100">Cases Solved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">
                      {Math.round(entry.averageScore)}%
                    </p>
                    <p className="text-xs text-light-100">Avg Score</p>
                  </div>
                </div>

                {/* Achievement Badge */}
                {entry.rank <= 3 && (
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/icons/track.svg" 
                      alt="Achievement" 
                      width={24} 
                      height={24}
                      className="opacity-80"
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}

          {leaderboard.length === 0 && (
            <Card className="p-12 text-center bg-dark-200 border-neutral-700">
              <div className="space-y-4">
                <Image 
                  src="/icons/feedback.svg" 
                  alt="No data" 
                  width={48} 
                  height={48}
                  className="mx-auto opacity-50"
                />
                <h3 className="text-xl font-semibold text-white">No Rankings Yet</h3>
                <p className="text-light-100">
                  Complete some clinical cases to see your ranking!
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

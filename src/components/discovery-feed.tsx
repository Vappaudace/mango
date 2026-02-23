"use client";

import React, { useState, useEffect } from 'react';
import { ProfileCard } from './profile-card';
import { MatchOverlay } from './match-overlay';
import { MangoIcon } from './mango-icons';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { getDiscoveryProfiles, recordSwipe } from '@/lib/firestore';
import type { UserProfile, Match } from '@/lib/types';

export function DiscoveryFeed() {
  const { user, profile, loading: authLoading } = useRequireAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [newMatch, setNewMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (!user || authLoading || !profile) return;
    getDiscoveryProfiles(user.uid, profile)
      .then(setProfiles)
      .finally(() => setLoadingProfiles(false));
  }, [user, profile, authLoading]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (swipeDir || !user || !profile) return;
    const target = profiles[currentIndex];
    if (!target) return;

    setSwipeDir(direction);

    setTimeout(async () => {
      setSwipeDir(null);

      const match = await recordSwipe(
        user.uid,
        target.uid,
        direction === 'right' ? 'liked' : 'passed',
        { displayName: profile.displayName, photoURL: profile.photoURL },
        { displayName: target.displayName, photoURL: target.photoURL }
      );

      if (match) {
        setNewMatch(match);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 380);
  };

  const dismissMatch = () => {
    setNewMatch(null);
    setCurrentIndex(prev => prev + 1);
  };

  if (authLoading || loadingProfiles) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <MangoIcon className="w-14 h-14 animate-pulse" />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Chargement…</p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center gap-6">
        <div
          className="flex flex-col items-center gap-4 p-8 rounded-[28px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <MangoIcon className="w-16 h-16 opacity-40" />
          <h2 className="font-headline font-bold text-white text-2xl italic">Plus rien n&apos;est mûr…</h2>
          <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Revenez plus tard pour de nouvelles découvertes.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="mt-2 px-6 py-3 rounded-[20px] font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #FFB300, #FF7A00)' }}
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {newMatch && (
        <MatchOverlay
          match={newMatch}
          myProfile={profile!}
          onClose={dismissMatch}
        />
      )}

      {/* Card stack */}
      <div className="relative flex-1" style={{ minHeight: 420 }}>
        {nextProfile && (
          <div
            className="absolute inset-0 overflow-hidden rounded-[28px]"
            style={{ transform: 'scale(0.95) translateY(20px)', transformOrigin: 'bottom center', zIndex: 0 }}
          >
            <ProfileCard profile={nextProfile} />
          </div>
        )}

        <div
          className="absolute inset-0 overflow-hidden rounded-[28px]"
          style={{
            zIndex: 1,
            transition: 'transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.38s',
            transform: swipeDir === 'right'
              ? 'translateX(500px) rotate(20deg)'
              : swipeDir === 'left'
              ? 'translateX(-500px) rotate(-20deg)'
              : 'none',
            opacity: swipeDir ? 0 : 1,
          }}
        >
          {swipeDir === 'right' && (
            <div
              className="absolute z-10 font-black tracking-widest"
              style={{ top: 40, left: 20, padding: '8px 18px', borderRadius: 12, border: '3px solid #FFB300', color: '#FFB300', fontSize: 22, transform: 'rotate(-10deg)' }}
            >
              MÛR
            </div>
          )}
          {swipeDir === 'left' && (
            <div
              className="absolute z-10 font-black tracking-widest"
              style={{ top: 40, right: 20, padding: '8px 18px', borderRadius: 12, border: '3px solid #FF4444', color: '#FF4444', fontSize: 22, transform: 'rotate(10deg)' }}
            >
              NON
            </div>
          )}
          <ProfileCard profile={currentProfile} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 py-5">
        <button
          onClick={() => handleSwipe('left')}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 24, color: 'rgba(255,255,255,0.7)' }}
        >
          ✕
        </button>
        <button
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.2)', fontSize: 24 }}
        >
          ⭐
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #FFB300, #FF6000)', boxShadow: '0 8px 30px rgba(255,120,0,0.45)', fontSize: 32 }}
        >
          🥭
        </button>
      </div>
    </div>
  );
}

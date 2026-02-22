
"use client";

import React, { useState } from 'react';
import { ProfileCard } from './profile-card';
import { MatchOverlay } from './match-overlay';
import { Button } from './ui/button';
import { X, Heart, Star, RefreshCcw } from 'lucide-react';

const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Awa',
    age: 24,
    city: 'Dakar',
    distance: '3 km',
    bio: 'Passionnée de cuisine et de voyages. Je cherche quelqu\'un pour partager de bons moments.',
    interests: ['Cuisine', 'Plage', 'Musique'],
    photo: 'https://picsum.photos/seed/dakar1/600/800',
  },
  {
    id: '2',
    name: 'Moussa',
    age: 28,
    city: 'Saint-Louis',
    distance: '12 km',
    bio: 'Artiste dans l\'âme. J\'aime le jazz et les couchers de soleil sur le fleuve.',
    interests: ['Art', 'Jazz', 'Photographie'],
    photo: 'https://picsum.photos/seed/sl1/600/800',
  },
  {
    id: '3',
    name: 'Fatou',
    age: 26,
    city: 'Thiès',
    distance: '5 km',
    bio: 'Entrepreneur, dynamique et souriante. La vie est une mangue sucrée!',
    interests: ['Entreprenariat', 'Sourire', 'Voyage'],
    photo: 'https://picsum.photos/seed/nature1/600/800',
  }
];

export function DiscoveryFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentIndex === 0) {
      // Trigger match for the first one for demo
      setShowMatch(true);
    } else {
      setCurrentIndex(prev => Math.min(prev + 1, MOCK_PROFILES.length));
    }
  };

  const resetMatch = () => {
    setShowMatch(false);
    setCurrentIndex(prev => Math.min(prev + 1, MOCK_PROFILES.length));
  };

  if (currentIndex >= MOCK_PROFILES.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-white/5 p-8 rounded-full mb-6">
          <RefreshCcw className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-headline italic mb-2">Plus rien n&apos;est mûr...</h2>
        <p className="text-muted-foreground mb-8">Revenez plus tard pour de nouvelles découvertes.</p>
        <Button 
          onClick={() => setCurrentIndex(0)} 
          variant="outline" 
          className="rounded-mango-btn border-primary/50 text-primary hover:bg-primary/10"
        >
          Recommencer
        </Button>
      </div>
    );
  }

  const currentProfile = MOCK_PROFILES[currentIndex];

  return (
    <div className="relative h-[calc(100vh-180px)] w-full flex flex-col items-center">
      {showMatch && <MatchOverlay profile={currentProfile} onClose={resetMatch} />}
      
      <div className="flex-1 w-full relative">
        <ProfileCard profile={currentProfile} />
      </div>

      <div className="flex justify-center items-center gap-6 mt-6 mb-4">
        <button 
          onClick={() => handleSwipe('left')}
          className="h-14 w-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white transition-all active:scale-95"
        >
          <X className="h-8 w-8" />
        </button>
        
        <button 
          className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-blue-400 hover:text-blue-300 transition-all active:scale-95"
        >
          <Star className="h-6 w-6 fill-current" />
        </button>

        <button 
          onClick={() => handleSwipe('right')}
          className="h-14 w-14 flex items-center justify-center bg-primary/20 border border-primary/30 rounded-full text-primary hover:scale-105 transition-all active:scale-95"
        >
          <Heart className="h-8 w-8 fill-current" />
        </button>
      </div>
    </div>
  );
}

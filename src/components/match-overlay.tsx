
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { MangoIcon } from './mango-icons';
import { MessageCircle, ArrowRight } from 'lucide-react';

export function MatchOverlay({ profile, onClose }: { profile: any, onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0D0D0D]/95 backdrop-blur-xl animate-in fade-in duration-500">
      {/* Mango Rain (Static simulation) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <MangoIcon 
            key={i} 
            className="absolute h-8 w-8 opacity-40 animate-bounce"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }} 
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center px-6 z-10">
        <div className="bg-primary/20 p-6 rounded-full mb-8 animate-pulse-slow">
          <MangoIcon className="h-20 w-20" />
        </div>

        <h2 className="text-5xl font-headline italic text-primary mb-2">C&apos;est mûr !</h2>
        <p className="text-xl text-white/80 mb-12 max-w-xs">
          Vous et <strong>{profile.name}</strong> avez les mêmes goûts.
        </p>

        <div className="flex items-center gap-4 mb-16 relative">
          <div className="relative h-28 w-28 rounded-full border-4 border-primary overflow-hidden shadow-2xl animate-in slide-in-from-left duration-700">
            <Image src="https://picsum.photos/seed/me/200/200" alt="Me" fill className="object-cover" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bg-primary text-primary-foreground p-2 rounded-full z-20 shadow-lg">
            <HeartPulseIcon className="h-6 w-6" />
          </div>
          <div className="relative h-28 w-28 rounded-full border-4 border-primary overflow-hidden shadow-2xl animate-in slide-in-from-right duration-700">
            <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button asChild className="rounded-mango-btn h-14 text-lg font-bold mango-gradient">
            <button onClick={onClose}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Envoyer un Jus
            </button>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-mango-btn h-14 text-white/60 hover:text-white"
          >
            Continuer à découvrir
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const HeartPulseIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);


"use client";

import React from 'react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { MapPin, Info } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  distance: string;
  bio: string;
  interests: string[];
  photo: string;
}

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="h-full w-full bg-card rounded-mango-card overflow-hidden mango-card-shadow relative group">
      <Image 
        src={profile.photo} 
        alt={profile.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        data-ai-hint="portrait"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      {/* Top Details */}
      <div className="absolute top-6 left-6 flex gap-2">
        <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white font-medium px-3 py-1">
          {profile.distance}
        </Badge>
      </div>

      <button className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/70">
        <Info className="h-5 w-5" />
      </button>

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="text-4xl font-headline italic text-white">{profile.name}</h2>
          <span className="text-2xl font-body text-white/80">{profile.age}</span>
        </div>

        <div className="flex items-center gap-1.5 text-white/60 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{profile.city}</span>
        </div>

        <p className="text-white/80 line-clamp-2 mb-6 leading-relaxed">
          {profile.bio}
        </p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 text-white/80 rounded-full font-medium">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

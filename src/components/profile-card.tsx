"use client";

import React from 'react';
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';

export function ProfileCard({ profile }: { profile: UserProfile }) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: 28 }}>
      {/* Photo */}
      <Image
        src={profile.photoURL}
        alt={profile.displayName}
        fill
        className="object-cover"
        unoptimized
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)' }}
      />

      {/* City / distance badge */}
      <div
        className="absolute top-5 left-5 px-3 py-1.5 text-[11px] font-semibold text-white"
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
        }}
      >
        📍 {profile.distanceKm !== undefined ? `~${profile.distanceKm} km` : profile.city}
      </div>

      {/* Info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
        <h2 className="font-headline font-bold text-white mb-1" style={{ fontSize: 28 }}>
          {profile.displayName}
        </h2>
        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {profile.age} ans · {profile.city}
          {profile.distanceKm !== undefined && ` · ~${profile.distanceKm} km`}
        </p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium"
              style={{
                borderRadius: 20,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';

export function ProfileCard({ profile }: { profile: UserProfile }) {
  const photos = [profile.photoURL, ...(profile.photos ?? [])].filter(Boolean);
  const [photoIdx, setPhotoIdx] = useState(0);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const width = (e.currentTarget as HTMLElement).offsetWidth;
    if (x < width / 2) {
      setPhotoIdx(prev => Math.max(0, prev - 1));
    } else {
      setPhotoIdx(prev => Math.min(photos.length - 1, prev + 1));
    }
  };

  const bio = profile.bio ?? '';
  const bioExcerpt = bio.length > 90 ? bio.slice(0, 90) + '…' : bio;

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none"
      style={{ borderRadius: 28 }}
      onClick={handleTap}
    >
      {/* Photo */}
      <Image
        src={photos[photoIdx] ?? profile.photoURL}
        alt={profile.displayName}
        fill
        className="object-cover"
        unoptimized
      />

      {/* Dark gradient - stronger at bottom */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 45%, transparent 68%)' }}
      />

      {/* Photo progress bars */}
      {photos.length > 1 && (
        <div className="absolute top-4 left-3 right-3 flex gap-1">
          {photos.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 3,
                background: i === photoIdx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      )}

      {/* City / distance badge */}
      <div
        className="absolute px-3 py-1.5 text-[11px] font-semibold text-white"
        style={{
          top: photos.length > 1 ? 24 : 20,
          left: 16,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
        }}
      >
        📍 {profile.distanceKm !== undefined ? `~${profile.distanceKm} km` : profile.city}
      </div>

      {/* Info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
        {/* Name + age */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <h2 className="font-headline font-black text-white leading-tight" style={{ fontSize: 32 }}>
            {profile.displayName}
          </h2>
          <span className="font-headline font-bold" style={{ fontSize: 26, color: '#FFB300' }}>
            {profile.age}
          </span>
        </div>

        {/* City + distance */}
        <p className="text-[12px] mb-2.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {profile.city}{profile.distanceKm !== undefined && ` · ~${profile.distanceKm} km`}
        </p>

        {/* Bio excerpt */}
        {bioExcerpt && (
          <p className="text-[13px] mb-3 leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {bioExcerpt}
          </p>
        )}

        {/* Interest tags */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] font-semibold"
              style={{
                borderRadius: 20,
                background: 'rgba(255,179,0,0.18)',
                border: '1px solid rgba(255,179,0,0.3)',
                color: 'rgba(255,255,255,0.9)',
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

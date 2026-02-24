"use client";

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { listenToInboundLikes, listenToMatches } from '@/lib/firestore';
import type { InboundLike, Match } from '@/lib/types';
import { MangoIcon } from '@/components/mango-icons';

export default function LikesPage() {
  const { user, loading } = useRequireAuth();
  const [likes, setLikes] = useState<InboundLike[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubLikes = listenToInboundLikes(user.uid, setLikes);
    const unsubMatches = listenToMatches(user.uid, setMatches);
    return () => { unsubLikes(); unsubMatches(); };
  }, [user]);

  // Filter out people we already matched with (they're in Messages)
  const matchedUids = new Set(
    matches.flatMap(m => m.users.filter(uid => uid !== user?.uid))
  );
  const unmatched = likes.filter(l => !matchedUids.has(l.fromUid));
  const count = unmatched.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
        <MangoIcon className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: '#0D0D0D' }}>
      <header className="flex items-center px-6" style={{ paddingTop: 58, paddingBottom: 16 }}>
        <h1 className="font-headline font-black text-white" style={{ fontSize: 28, letterSpacing: -0.5 }}>
          Likes <em className="not-italic" style={{ color: '#FFB300' }}>🥭</em>
        </h1>
        {count > 0 && (
          <span
            className="ml-3 px-2.5 py-1 text-xs font-bold"
            style={{ borderRadius: 20, background: 'rgba(255,179,0,0.15)', color: '#FFB300', border: '1px solid rgba(255,179,0,0.25)' }}
          >
            {count}
          </span>
        )}
      </header>

      <main className="px-6 flex flex-col gap-6">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <MangoIcon className="w-14 h-14 opacity-30" />
            <p className="text-lg font-headline italic text-white">Personne n'a encore liké…</p>
            <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Continue à swiper, ça arrive vite !
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex flex-col items-center gap-3 p-5 text-center"
              style={{ borderRadius: 24, background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)' }}
            >
              <p className="font-bold text-white" style={{ fontSize: 16 }}>
                {count} {count === 1 ? 'personne a liké' : 'personnes ont liké'} ton profil
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Va dans Découverte pour matcher avec eux !
              </p>
            </div>

            {/* Blurred photo grid */}
            <div className="grid grid-cols-2 gap-3">
              {unmatched.map((like) => (
                <div
                  key={like.fromUid}
                  className="relative overflow-hidden"
                  style={{ borderRadius: 20, aspectRatio: '3/4', background: '#1a1a1a' }}
                >
                  {/* Blurred photo */}
                  {like.photoURL ? (
                    <img
                      src={like.photoURL}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ filter: 'blur(18px)', transform: 'scale(1.15)' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl" style={{ filter: 'blur(8px)' }}>
                      🌟
                    </div>
                  )}
                  {/* Dark overlay */}
                  <div className="absolute inset-0" style={{ background: 'rgba(13,13,13,0.4)' }} />
                  {/* Lock icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div
                      className="flex items-center justify-center w-10 h-10"
                      style={{ borderRadius: '50%', background: 'rgba(255,179,0,0.9)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    {/* Blurred name */}
                    <span
                      className="text-white font-semibold text-sm"
                      style={{ filter: 'blur(6px)', userSelect: 'none' }}
                    >
                      {like.displayName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

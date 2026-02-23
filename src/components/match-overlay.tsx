"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Match, UserProfile } from '@/lib/types';

const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3) % 100}%`,
  delay: `${(i * 0.3) % 2}s`,
  duration: `${2.5 + (i % 3) * 0.7}s`,
}));

interface Props {
  match: Match;
  myProfile: Pick<UserProfile, 'uid' | 'displayName' | 'photoURL'>;
  onClose: () => void;
}

export function MatchOverlay({ match, myProfile, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const otherUid = match.users.find(uid => uid !== myProfile.uid) ?? '';
  const otherProfile = match.userProfiles[otherUid];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#1A0A00' }}
    >
      {/* Center glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,0,0.35) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'glow-pulse 2s ease-in-out infinite',
        }}
      />

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute text-3xl"
            style={{ left: c.left, top: '-60px', animation: `confetti-fall ${c.duration} ${c.delay} linear infinite`, opacity: 0 }}
          >
            🥭
          </span>
        ))}
      </div>

      <div
        className="relative z-10 flex flex-col items-center px-8 w-full max-w-sm"
        style={{ gap: 20, paddingTop: 48, paddingBottom: 32 }}
      >
        {/* Mango pack */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', animation: 'pack-in 0.8s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          {[36,42,36,32,48,32,36,40,36].map((size, i) => (
            <span
              key={i}
              className="block text-center"
              style={{ fontSize: size, animation: `mango-wiggle 2s ${[0,0.15,0.3,0.1,0.25,0.2,0.05,0.35,0.15][i]}s ease-in-out infinite` }}
            >
              🥭
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          className="font-headline font-black text-white text-center leading-tight"
          style={{ fontSize: 46, letterSpacing: -1, animation: 'match-bounce 0.8s 0.2s cubic-bezier(0.34,1.56,0.64,1) both', opacity: 0, animationFillMode: 'forwards' }}
        >
          C&apos;est <em className="italic" style={{ color: '#FFB300' }}>mûr&nbsp;!</em>
        </h2>

        <p
          className="text-center font-light leading-relaxed"
          style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', animation: 'match-bounce 0.8s 0.35s cubic-bezier(0.34,1.56,0.64,1) both', opacity: 0, animationFillMode: 'forwards' }}
        >
          Vous et <strong className="text-white font-semibold">{otherProfile?.displayName}</strong> vous êtes mutuellem. plû.
        </p>

        {/* Avatars */}
        <div
          className="flex items-center"
          style={{ animation: 'match-bounce 0.8s 0.45s cubic-bezier(0.34,1.56,0.64,1) both', opacity: 0, animationFillMode: 'forwards' }}
        >
          <ProfileAvatar src={myProfile.photoURL} name={myProfile.displayName} />
          <span className="text-2xl z-10" style={{ margin: '0 -6px', filter: 'drop-shadow(0 0 10px rgba(255,100,0,0.7))', animation: 'heart-pulse 1.5s ease-in-out infinite' }}>
            ❤️
          </span>
          <ProfileAvatar src={otherProfile?.photoURL ?? ''} name={otherProfile?.displayName ?? ''} style={{ marginLeft: -16 }} />
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col gap-2.5 w-full"
          style={{ animation: 'match-bounce 0.8s 0.6s cubic-bezier(0.34,1.56,0.64,1) both', opacity: 0, animationFillMode: 'forwards' }}
        >
          <button
            onClick={() => { onClose(); router.push(`/jus/${match.id}`); }}
            className="w-full flex items-center justify-center gap-2 font-semibold text-white"
            style={{ height: 58, borderRadius: 18, background: 'linear-gradient(135deg, #FFB300, #FF7A00)', boxShadow: '0 8px 30px rgba(255,120,0,0.4)', fontSize: 16 }}
          >
            💬 Envoyer un Jus
          </button>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center font-medium"
            style={{ height: 52, borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 15 }}
          >
            Continuer à découvrir
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow-pulse { 0%, 100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        @keyframes confetti-fall { 0% { transform: translateY(-60px) rotate(0deg) scale(0.5); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg) scale(1.2); opacity: 0; } }
        @keyframes pack-in { from { opacity: 0; transform: scale(0.3) rotate(-10deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes mango-wiggle { 0%, 100% { transform: translateY(0) rotate(-3deg) scale(1); } 50% { transform: translateY(-8px) rotate(3deg) scale(1.08); } }
        @keyframes match-bounce { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes heart-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
      `}</style>
    </div>
  );
}

function ProfileAvatar({ src, name, style }: { src: string; name: string; style?: React.CSSProperties }) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden"
      style={{
        width: 80, height: 80, borderRadius: '50%',
        border: '3px solid #1A0A00',
        background: 'linear-gradient(135deg, #FFB300, #FF6000)',
        fontSize: 32, ...style,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        '😊'
      )}
    </div>
  );
}

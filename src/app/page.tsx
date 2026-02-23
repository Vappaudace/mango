"use client";

import Link from 'next/link';
import { MangoIcon } from '@/components/mango-icons';

const FLOAT_MANGOES = [
  { left: '10%', delay: '0s', duration: '8s' },
  { left: '25%', delay: '1.5s', duration: '10s' },
  { left: '45%', delay: '3s', duration: '7s' },
  { left: '65%', delay: '0.8s', duration: '9s' },
  { left: '80%', delay: '2s', duration: '11s' },
  { left: '90%', delay: '4s', duration: '8s' },
];

export default function Home() {
  return (
    <main
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#1A0A00' }}
    >
      {/* Glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,0,0.35) 0%, transparent 70%)',
          top: -100, left: -80,
          animation: 'glow-pulse 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,80,0,0.2) 0%, transparent 70%)',
          bottom: 100, right: -100,
          animation: 'glow-pulse 4s 2s ease-in-out infinite',
        }}
      />

      {/* Floating mango emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOAT_MANGOES.map((m, i) => (
          <span
            key={i}
            className="absolute text-xl"
            style={{
              left: m.left,
              bottom: '-60px',
              animation: `float-mango ${m.duration} ${m.delay} linear infinite`,
              opacity: 0,
            }}
          >
            🥭
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 max-w-[390px] mx-auto w-full">

        {/* Top area */}
        <div
          className="pt-20 px-9"
          style={{ animation: 'fade-down 1s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <h1
            className="font-headline font-black text-white leading-none"
            style={{ fontSize: 72, letterSpacing: -3, textShadow: '0 0 60px rgba(255,160,0,0.4)' }}
          >
            MAN<em className="italic" style={{ color: '#FFB300' }}>GO</em>
          </h1>
          <p className="mt-3.5 text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Rencontres authentiques au cœur de l'Afrique 🌍
          </p>
        </div>

        {/* Hero */}
        <div
          className="flex-1 flex items-center justify-center relative"
          style={{ animation: 'hero-in 1.2s 0.2s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <div className="relative" style={{ width: 260, height: 260 }}>
            {/* Orbit rings */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: -40,
                border: '1px solid rgba(255,179,0,0.12)',
                animation: 'orbit-spin 20s linear infinite',
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: -80,
                border: '1px solid rgba(255,179,0,0.07)',
                animation: 'orbit-spin 30s linear infinite reverse',
              }}
            />

            {/* Floating hero mango */}
            <div
              className="flex items-center justify-center w-full h-full"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              <MangoIcon className="w-48 h-48" />
            </div>

            {/* Shadow under mango */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: -20, left: '50%',
                transform: 'translateX(-50%)',
                width: 160, height: 30,
                background: 'radial-gradient(ellipse, rgba(255,120,0,0.5) 0%, transparent 70%)',
                filter: 'blur(10px)',
                animation: 'shadow-pulse 6s ease-in-out infinite',
              }}
            />

            {/* Match bubble left */}
            <div
              className="absolute glass rounded-[20px] flex items-center gap-2 py-2 px-3.5"
              style={{
                left: -10, top: 30,
                animation: 'float-gentle 4s 0.5s ease-in-out infinite',
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, #FFB300, #FF6000)' }}
              >
                🌟
              </div>
              <div>
                <strong className="block text-white text-xs font-semibold">Awa, 24</strong>
                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Dakar · 3 km</span>
              </div>
            </div>

            {/* Match bubble right */}
            <div
              className="absolute glass rounded-[20px] flex items-center gap-2 py-2 px-3.5"
              style={{
                right: -10, bottom: 60,
                animation: 'float-gentle 4s 1.5s ease-in-out infinite',
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, #FF6000, #C84000)' }}
              >
                💫
              </div>
              <div>
                <strong className="block text-white text-xs font-semibold">Moussa, 27</strong>
                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Thiès · 5 km</span>
              </div>
            </div>

            {/* Stars rating */}
            <div
              className="absolute glass-amber rounded-2xl px-3 py-1.5 text-sm font-semibold"
              style={{
                bottom: -10, left: 20,
                color: '#FFB300',
                animation: 'float-gentle 5s 1s ease-in-out infinite',
              }}
            >
              ⭐ 4.9 · 12k matchs
            </div>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div
          className="px-7 pb-14 flex flex-col gap-3"
          style={{ animation: 'slide-up 1s 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <Link
            href="/discover"
            className="relative overflow-hidden w-full h-[60px] rounded-[20px] flex items-center justify-center text-white font-semibold text-[17px] btn-shine active:scale-[0.97] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #FFB300 0%, #FF7A00 60%, #E84000 100%)',
              boxShadow: '0 10px 40px rgba(255,100,0,0.45)',
            }}
          >
            Commencer gratuitement
          </Link>

          <Link
            href="/discover"
            className="w-full h-14 rounded-[20px] flex items-center justify-center text-base font-medium active:scale-[0.97] transition-transform"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            J'ai déjà un compte
          </Link>

          <p className="text-center text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.2)' }}>
            En continuant vous acceptez nos{' '}
            <span style={{ color: 'rgba(255,179,0,0.5)' }}>Conditions</span>{' '}
            et notre{' '}
            <span style={{ color: 'rgba(255,179,0,0.5)' }}>Politique de confidentialité</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-mango {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-100vh) rotate(20deg); opacity: 0; }
        }
        @keyframes shadow-pulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.3; transform: translateX(-50%) scaleX(0.7); }
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-in {
          from { opacity: 0; transform: scale(0.8) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-18px) rotate(2deg); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </main>
  );
}

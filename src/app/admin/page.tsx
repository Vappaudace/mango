"use client";

import { useState } from 'react';
import { seedAIProfiles, AI_PROFILES } from '@/lib/seed-profiles';
import { MangoIcon } from '@/components/mango-icons';

export default function AdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [log, setLog] = useState('');

  const handleSeed = async () => {
    setStatus('loading');
    setLog('Injection des profils en cours…');
    try {
      await seedAIProfiles();
      setStatus('done');
      setLog(`✅ ${AI_PROFILES.length} profils injectés avec succès dans Firestore.`);
    } catch (e: unknown) {
      setStatus('error');
      setLog(`❌ Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-8"
      style={{ background: '#0D0D0D' }}
    >
      <div className="flex flex-col items-center gap-3">
        <MangoIcon className="w-12 h-12" />
        <h1 className="font-headline font-black text-white text-3xl italic">Admin — Seed</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
          Injecte {AI_PROFILES.length} profils IA dans Firestore pour simuler de l&apos;activité.
          <br />⚠️ Réserver à l&apos;environnement de dev.
        </p>
      </div>

      {/* Profile preview */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        {AI_PROFILES.map(p => (
          <div
            key={p.uid}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.photoURL} alt="" className="rounded-full object-cover" style={{ width: 36, height: 36 }} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{p.displayName}, {p.age}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{p.city} · {p.gender}</p>
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,179,0,0.5)' }}>{p.uid}</span>
          </div>
        ))}
      </div>

      {/* Seed button */}
      <button
        onClick={handleSeed}
        disabled={status === 'loading' || status === 'done'}
        className="w-full max-w-sm h-14 font-semibold text-white rounded-[20px] transition-all active:scale-95"
        style={{
          background: status === 'done'
            ? 'rgba(0,200,100,0.15)'
            : status === 'loading'
            ? 'rgba(255,255,255,0.06)'
            : 'linear-gradient(135deg, #FFB300, #FF7A00)',
          border: status === 'done' ? '1px solid rgba(0,200,100,0.3)' : 'none',
          color: status === 'done' ? 'rgb(0,200,100)' : 'white',
        }}
      >
        {status === 'loading' ? '⏳ Injection…' : status === 'done' ? '✅ Profils injectés' : `🚀 Injecter ${AI_PROFILES.length} profils`}
      </button>

      {log && (
        <p
          className="text-center text-sm max-w-sm"
          style={{ color: status === 'error' ? '#FF6B6B' : 'rgba(255,255,255,0.5)' }}
        >
          {log}
        </p>
      )}
    </main>
  );
}

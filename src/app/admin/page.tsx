"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { seedAIProfiles, AI_PROFILES } from '@/lib/seed-profiles';
import { MangoIcon } from '@/components/mango-icons';

export default function AdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [log, setLog] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [testLog, setTestLog] = useState('');

  const handleCreateTestAccount = async () => {
    setTestStatus('loading');
    setTestLog('Création du compte test…');
    try {
      const cred = await createUserWithEmailAndPassword(auth, 'test@mango.sn', 'MangoTest2026!');
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        displayName: 'Testeur Apple',
        age: 25,
        city: 'Dakar',
        gender: 'homme',
        lookingFor: 'femme',
        bio: 'Compte de test pour la review Apple.',
        interests: ['Tech', 'Voyage'],
        photoURL: 'https://i.pravatar.cc/400?img=33',
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      });
      setTestStatus('done');
      setTestLog('✅ Compte test créé : test@mango.sn / MangoTest2026!');
    } catch (e: unknown) {
      setTestStatus('error');
      const msg = e instanceof Error ? e.message : String(e);
      setTestLog(msg.includes('email-already-in-use') ? '✅ Compte déjà existant.' : `❌ ${msg}`);
      if (msg.includes('email-already-in-use')) setTestStatus('done');
    }
  };

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

      {/* Test account button */}
      <button
        onClick={handleCreateTestAccount}
        disabled={testStatus === 'loading' || testStatus === 'done'}
        className="w-full max-w-sm h-14 font-semibold text-white rounded-[20px] transition-all active:scale-95"
        style={{
          background: testStatus === 'done'
            ? 'rgba(0,200,100,0.15)'
            : testStatus === 'loading'
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.08)',
          border: testStatus === 'done' ? '1px solid rgba(0,200,100,0.3)' : '1px solid rgba(255,255,255,0.1)',
          color: testStatus === 'done' ? 'rgb(0,200,100)' : 'white',
        }}
      >
        {testStatus === 'loading' ? '⏳ Création…' : testStatus === 'done' ? testLog : '🧪 Créer compte test Apple'}
      </button>

      {testLog && testStatus === 'error' && (
        <p className="text-center text-sm max-w-sm" style={{ color: '#FF6B6B' }}>{testLog}</p>
      )}

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

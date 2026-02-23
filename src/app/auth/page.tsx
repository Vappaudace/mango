"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { MangoIcon } from '@/components/mango-icons';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const afterAuth = async (uid: string) => {
    const profile = await getUserProfile(uid);
    router.replace(profile ? '/discover' : '/auth/setup');
  };

  const handleEmail = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await afterAuth(cred.user.uid);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await afterAuth(cred.user.uid);
      }
    } catch (e: any) {
      const msgs: Record<string, string> = {
        'auth/email-already-in-use': 'Cet email est déjà utilisé.',
        'auth/invalid-credential': 'Email ou mot de passe incorrect.',
        'auth/weak-password': 'Mot de passe trop court (min. 6 caractères).',
        'auth/invalid-email': 'Email invalide.',
      };
      setError(msgs[e.code] ?? 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await afterAuth(cred.user.uid);
    } catch {
      setError('Connexion Google annulée.');
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      const cred = await signInWithPopup(auth, provider);
      await afterAuth(cred.user.uid);
    } catch {
      setError('Connexion Apple annulée.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: '#0D0D0D' }}
    >
      <div className="flex-1 flex flex-col max-w-[390px] mx-auto w-full px-7 pt-16 pb-12">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <MangoIcon className="w-10 h-10" />
          <h1
            className="font-headline font-black text-white italic"
            style={{ fontSize: 32, letterSpacing: -1 }}
          >
            MANGO
          </h1>
        </div>

        {/* Title */}
        <h2
          className="font-headline font-black text-white mb-2"
          style={{ fontSize: 34, letterSpacing: -0.5 }}
        >
          {mode === 'signup' ? 'Créer un compte' : 'Bon retour 👋'}
        </h2>
        <p className="text-sm font-light mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {mode === 'signup'
            ? 'Rejoins des milliers de célibataires au Sénégal'
            : 'Connecte-toi pour retrouver tes matchs'}
        </p>

        {/* Social buttons */}
        <div className="flex gap-2.5 mb-5">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 h-[52px] font-medium text-sm"
            style={{
              borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            onClick={handleApple}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 h-[52px] font-medium text-sm"
            style={{
              borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.06 2.24.74 3.01.8.87-.16 1.71-.85 3.13-.91 1.72.05 3.03.82 3.87 2.12-3.51 2.23-2.92 6.52.58 8.02-.71 1.44-1.63 2.87-2.59 3.85zM12.03 7.3c-.14-2.2 1.77-4.12 3.78-4.3.27 2.33-1.88 4.28-3.78 4.3z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Divider */}
        <div
          className="flex items-center gap-2.5 text-xs mb-5"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          ou avec ton email
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label
                className="block font-semibold uppercase mb-2"
                style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)' }}
              >
                Prénom
              </label>
              <input
                type="text"
                placeholder="Ton prénom"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full outline-none text-white"
                style={{
                  height: 56,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  fontSize: 16,
                  padding: '0 18px',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor = '#FFB300'; e.target.style.background = 'rgba(255,179,0,0.05)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>
          )}

          <div>
            <label
              className="block font-semibold uppercase mb-2"
              style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)' }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full outline-none text-white"
              style={{
                height: 56,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                fontSize: 16,
                padding: '0 18px',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = '#FFB300'; e.target.style.background = 'rgba(255,179,0,0.05)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />
          </div>

          <div>
            <label
              className="block font-semibold uppercase mb-2"
              style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)' }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full outline-none text-white"
              style={{
                height: 56,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                fontSize: 16,
                padding: '0 18px',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = '#FFB300'; e.target.style.background = 'rgba(255,179,0,0.05)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              onKeyDown={e => e.key === 'Enter' && handleEmail()}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-center" style={{ color: '#FF4444' }}>
            {error}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={handleEmail}
          disabled={loading}
          className="relative overflow-hidden mt-6 w-full h-[60px] font-semibold text-white text-[17px] btn-shine active:scale-[0.97] transition-transform"
          style={{
            borderRadius: 20,
            background: 'linear-gradient(135deg, #FFB300 0%, #FF7A00 60%, #E84000 100%)',
            boxShadow: '0 10px 40px rgba(255,100,0,0.45)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '…' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
        </button>

        {/* Toggle */}
        <p className="mt-auto pt-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {mode === 'signup' ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
          <span
            onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
            className="font-semibold cursor-pointer"
            style={{ color: '#FFB300' }}
          >
            {mode === 'signup' ? 'Se connecter' : 'S\'inscrire'}
          </span>
        </p>
      </div>
    </main>
  );
}

"use client";

import { useState, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/lib/firebase';
import { updateUserProfile } from '@/lib/firestore';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { BottomNav } from '@/components/bottom-nav';
import { MangoIcon } from '@/components/mango-icons';
import { useRouter } from 'next/navigation';

export default function MoiPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useRequireAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `photos/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateUserProfile(user.uid, { photoURL: url });
      await refreshProfile();
    } finally {
      setUploading(false);
    }
  };

  const saveBio = async () => {
    if (!user) return;
    await updateUserProfile(user.uid, { bio });
    await refreshProfile();
    setEditing(false);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/auth');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
        <MangoIcon className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: '#0D0D0D' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6"
        style={{ paddingTop: 58, paddingBottom: 16 }}
      >
        <h1 className="font-headline font-black text-white" style={{ fontSize: 28, letterSpacing: -0.5 }}>Moi</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center"
          style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 18 }}
          title="Se déconnecter"
        >
          🚪
        </button>
      </header>

      <main className="px-6 flex flex-col items-center gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              style={{ width: 120, height: 120, borderRadius: 36, background: 'linear-gradient(135deg, #FFB300, #FF6000)', padding: 3 }}
            >
              <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                style={{ borderRadius: 34, background: '#0D0D0D', fontSize: 56 }}
              >
                {profile.photoURL
                  ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" style={{ borderRadius: 32 }} />
                  : '😊'}
              </div>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute flex items-center justify-center"
              style={{ bottom: -6, right: -6, width: 34, height: 34, borderRadius: '50%', background: '#FFB300', border: '3px solid #0D0D0D', fontSize: 16 }}
            >
              {uploading ? '…' : '📷'}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

          <div className="text-center">
            <h2 className="font-headline font-bold text-white italic" style={{ fontSize: 28 }}>
              {profile.displayName}, {profile.age}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{profile.city} 🇸🇳</p>
          </div>
        </div>

        {/* Bio */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold uppercase tracking-widest" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Bio</p>
            <button
              onClick={() => { setEditing(!editing); setBio(profile.bio); }}
              style={{ fontSize: 12, color: '#FFB300', fontWeight: 600 }}
            >
              {editing ? 'Annuler' : '✏️ Modifier'}
            </button>
          </div>
          {editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full outline-none text-white resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #FFB300', borderRadius: 16, fontSize: 14, padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}
              />
              <button
                onClick={saveBio}
                className="self-end px-5 py-2 rounded-[14px] text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #FFB300, #FF7A00)' }}
              >
                Sauvegarder
              </button>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              {profile.bio || <span style={{ color: 'rgba(255,255,255,0.2)' }}>Pas encore de bio…</span>}
            </p>
          )}
        </div>

        {/* Interests */}
        {profile.interests?.length > 0 && (
          <div className="w-full">
            <p className="font-bold uppercase tracking-widest mb-3" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Intérêts</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-medium"
                  style={{ borderRadius: 20, background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.2)', color: '#FFB300' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
}

"use client";

import { useState, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, storage, db } from '@/lib/firebase';
import { updateUserProfile } from '@/lib/firestore';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { BottomNav } from '@/components/bottom-nav';
import { MangoIcon } from '@/components/mango-icons';
import { useRouter } from 'next/navigation';

export default function MoiPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useRequireAuth();
  const mainPhotoRef = useRef<HTMLInputElement>(null);
  const addPhotoRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ok' | 'denied'>('idle');

  const handleMainPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const currentPhotos = profile?.photos ?? [];
    if (currentPhotos.length >= 5) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `photos/${user.uid}/photo_${Date.now()}.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', user.uid), { photos: arrayUnion(url) });
      await refreshProfile();
    } finally {
      setUploading(false);
      if (addPhotoRef.current) addPhotoRef.current.value = '';
    }
  };

  const handleRemovePhoto = async (url: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { photos: arrayRemove(url) });
    await refreshProfile();
  };

  const saveBio = async () => {
    if (!user) return;
    await updateUserProfile(user.uid, { bio });
    await refreshProfile();
    setEditing(false);
  };

  const updateLocation = async () => {
    if (!user || locStatus === 'loading') return;
    setLocStatus('loading');
    try {
      const pos = await Geolocation.getCurrentPosition({ timeout: 8000 });
      await updateUserProfile(user.uid, { lat: pos.coords.latitude, lng: pos.coords.longitude });
      setLocStatus('ok');
    } catch {
      setLocStatus('denied');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/auth');
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center" style={{ height: '100dvh', background: '#0D0D0D' }}>
        <MangoIcon className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  const extraPhotos = profile.photos ?? [];
  const totalPhotos = 1 + extraPhotos.length;
  const canAddMore = totalPhotos < 6;

  return (
    <div className="flex flex-col pb-24 overflow-y-auto" style={{ minHeight: '100dvh', background: '#0D0D0D' }}>
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
        >
          🚪
        </button>
      </header>

      <main className="px-6 flex flex-col gap-8">
        {/* Name + city */}
        <div className="text-center">
          <h2 className="font-headline font-bold text-white italic" style={{ fontSize: 28 }}>
            {profile.displayName}, {profile.age}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{profile.city} 🇸🇳</p>
        </div>

        {/* Photo grid */}
        <div>
          <p className="font-bold uppercase tracking-widest mb-3" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            Photos ({totalPhotos}/6)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* Main photo */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {profile.photoURL
                ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-4xl">😊</div>
              }
              <button
                onClick={() => mainPhotoRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-end justify-end p-1.5"
              >
                <span className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: '50%', background: '#FFB300', fontSize: 13 }}>
                  {uploading ? '…' : '📷'}
                </span>
              </button>
            </div>

            {/* Extra photos */}
            {extraPhotos.map((url) => (
              <div key={url} className="relative aspect-[3/4] rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemovePhoto(url)}
                  className="absolute top-1.5 right-1.5 flex items-center justify-center"
                  style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', fontSize: 12 }}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add photo slot */}
            {canAddMore && (
              <button
                onClick={() => addPhotoRef.current?.click()}
                disabled={uploading}
                className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center gap-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)' }}
              >
                <span style={{ fontSize: 24, opacity: 0.5 }}>+</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Photo</span>
              </button>
            )}
          </div>
          <input ref={mainPhotoRef} type="file" accept="image/*" className="hidden" onChange={handleMainPhotoChange} />
          <input ref={addPhotoRef} type="file" accept="image/*" className="hidden" onChange={handleAddPhoto} />
        </div>

        {/* Bio */}
        <div>
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
          <div>
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

        {/* Location */}
        <div>
          <p className="font-bold uppercase tracking-widest mb-3" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Localisation</p>
          <button
            onClick={updateLocation}
            disabled={locStatus === 'loading'}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all active:scale-[0.97]"
            style={{
              background: locStatus === 'ok' ? 'rgba(76,217,100,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${locStatus === 'ok' ? 'rgba(76,217,100,0.2)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span style={{ fontSize: 18 }}>
              {locStatus === 'loading' ? '⏳' : locStatus === 'ok' ? '✅' : locStatus === 'denied' ? '❌' : '📍'}
            </span>
            <span style={{ fontSize: 13, color: locStatus === 'ok' ? '#4CD964' : locStatus === 'denied' ? '#FF6B6B' : 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              {locStatus === 'loading' && 'Détection en cours…'}
              {locStatus === 'ok' && 'Position mise à jour'}
              {locStatus === 'denied' && 'Autorisation refusée — vérifie tes réglages'}
              {locStatus === 'idle' && (profile.lat ? 'Mettre à jour ma position' : 'Activer ma localisation')}
            </span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

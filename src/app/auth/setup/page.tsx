"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Geolocation } from '@capacitor/geolocation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore';
import { useAuth } from '@/context/auth-context';
import { MangoIcon } from '@/components/mango-icons';
import { generateProfileBio } from '@/ai/flows/ai-profile-bio-generator';

const CITIES = ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Mbour', 'Touba', 'Autre'];

// ── QUIZ pour construire le profil sans effort ───────────────────────────
const QUIZ = [
  {
    question: "C'est quoi ta soirée idéale ?",
    options: [
      { emoji: '🍿', label: 'Netflix à la maison', interests: ['Cinéma', 'Lecture'] },
      { emoji: '🍽️', label: 'Restau avec une belle ambiance', interests: ['Cuisine', 'Mode'] },
      { emoji: '🎉', label: 'Concert ou soirée animée', interests: ['Musique', 'Danse', 'Mbalax'] },
      { emoji: '🏖️', label: 'Feu de camp à la plage', interests: ['Plage', 'Nature'] },
    ],
  },
  {
    question: 'Ton week-end parfait c\'est…',
    options: [
      { emoji: '✈️', label: 'Partir en voyage spontané', interests: ['Voyage', 'Photographie'] },
      { emoji: '💪', label: 'Sport et grand air', interests: ['Sport', 'Nature'] },
      { emoji: '🎨', label: 'Créer ou apprendre quelque chose', interests: ['Art', 'Tech'] },
      { emoji: '🥘', label: 'Cuisiner pour les amis', interests: ['Cuisine', 'Tiébou'] },
    ],
  },
  {
    question: 'Si tu devais tout lâcher demain…',
    options: [
      { emoji: '🚀', label: 'Lancer ton propre projet', interests: ['Entrepreneuriat', 'Tech'] },
      { emoji: '🌍', label: 'Voyager partout en Afrique', interests: ['Voyage', 'Nature'] },
      { emoji: '🎵', label: 'Vivre de ta passion artistique', interests: ['Musique', 'Art', 'Danse'] },
      { emoji: '🎮', label: 'Jouer et décompresser à fond', interests: ['Gaming', 'Cinéma'] },
    ],
  },
];

const STEPS = ['Photo', 'Profil', 'Vibes'];

export default function SetupPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Form state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('Dakar');
  const [gender, setGender] = useState<'homme' | 'femme' | 'autre'>('femme');
  const [lookingFor, setLookingFor] = useState<'homme' | 'femme' | 'tous'>('homme');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  // Location state
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ok' | 'denied'>('idle');

  // Quiz state (step 2)
  const [quizStep, setQuizStep] = useState(0); // 0-2 = questions, 3 = bio preview
  const [quizDone, setQuizDone] = useState(false);

  // Auto-request location when reaching step 1
  useEffect(() => {
    if (step !== 1 || locStatus !== 'idle') return;
    setLocStatus('loading');
    Geolocation.getCurrentPosition({ timeout: 8000 })
      .then(pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('ok');
      })
      .catch(() => setLocStatus('denied'));
  }, [step, locStatus]);

  const totalSteps = STEPS.length + QUIZ.length; // for finer progress
  const progressPct = step < 2
    ? ((step + 1) / totalSteps) * 100
    : ((STEPS.length + quizStep) / totalSteps) * 100;

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleQuizAnswer = async (optionInterests: string[]) => {
    // Merge new interests (dedup)
    const merged = Array.from(new Set([...interests, ...optionInterests]));
    setInterests(merged);

    if (quizStep < QUIZ.length - 1) {
      setQuizStep(q => q + 1);
    } else {
      // Last question answered → generate bio
      setQuizStep(QUIZ.length); // show bio screen
      setAiLoading(true);
      try {
        const result = await generateProfileBio({ interests: merged, personalityTraits: [], maxLength: 180 });
        setBio(result.bio);
      } catch { /* ignore */ }
      finally {
        setAiLoading(false);
        setQuizDone(true);
      }
    }
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let photoURL = user.photoURL ?? '';

      if (photoFile) {
        const storageRef = ref(storage, `photos/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await createUserProfile({
        uid: user.uid,
        displayName: displayName || user.displayName || 'Anonyme',
        age: parseInt(age) || 25,
        city,
        bio,
        interests,
        photoURL,
        gender,
        lookingFor,
        ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
      });

      await refreshProfile();
      router.replace('/discover');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const canAdvance = [
    true, // photo optional
    displayName.length >= 2 && age !== '' && parseInt(age) >= 18,
    quizDone, // quiz done + bio generated
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <div className="flex-1 flex flex-col max-w-[390px] mx-auto w-full px-7 pt-16 pb-12">

        {/* Progress bar */}
        <div
          className="h-[3px] rounded-full mb-9 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #FFB300, #FF7A00)' }}
          />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <MangoIcon className="w-8 h-8" />
          <span
            className="font-semibold uppercase"
            style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)' }}
          >
            {step < 2
              ? `Étape ${step + 1} / ${totalSteps} · ${STEPS[step]}`
              : quizStep < QUIZ.length
              ? `Question ${quizStep + 1} / ${QUIZ.length}`
              : 'Ton profil est prêt ✨'}
          </span>
        </div>

        {/* ── STEP 0: PHOTO ── */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-8">
            <h2
              className="font-headline font-black text-white text-center"
              style={{ fontSize: 30, letterSpacing: -0.5 }}
            >
              Ta meilleure <em className="italic" style={{ color: '#FFB300' }}>photo</em>
            </h2>

            <button
              onClick={() => fileRef.current?.click()}
              className="relative flex flex-col items-center justify-center gap-2"
              style={{
                width: 160, height: 160, borderRadius: 40,
                background: photoPreview ? 'transparent' : 'rgba(255,179,0,0.08)',
                border: photoPreview ? 'none' : '2px dashed rgba(255,179,0,0.35)',
                overflow: 'hidden',
              }}
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <span className="text-4xl">📸</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,179,0,0.6)', fontWeight: 600 }}>
                    Ajouter une photo
                  </span>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />

            <p className="text-sm text-center font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Une bonne photo augmente tes chances de match de 3×
            </p>
          </div>
        )}

        {/* ── STEP 1: PROFIL ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2
              className="font-headline font-black text-white"
              style={{ fontSize: 30, letterSpacing: -0.5 }}
            >
              Ton <em className="italic" style={{ color: '#FFB300' }}>profil</em>
            </h2>

            {[
              { label: 'Prénom', value: displayName, set: setDisplayName, placeholder: 'Ton prénom', type: 'text' },
              { label: 'Âge', value: age, set: setAge, placeholder: 'Ex: 24', type: 'number' },
            ].map(({ label, value, set, placeholder, type }) => (
              <div key={label}>
                <label
                  className="block font-semibold uppercase mb-2"
                  style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)' }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={e => set(e.target.value)}
                  className="w-full outline-none text-white"
                  style={{
                    height: 56, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
                    fontSize: 16, padding: '0 18px', fontFamily: 'DM Sans, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#FFB300'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
              </div>
            ))}

            {/* City */}
            <div>
              <label
                className="block font-semibold uppercase mb-2"
                style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)' }}
              >
                Ville
              </label>
              <div className="flex flex-wrap gap-2">
                {CITIES.map(c => {
                  const sel = city === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setCity(c)}
                      className="font-semibold transition-all active:scale-95"
                      style={{
                        borderRadius: 24,
                        padding: '9px 18px',
                        fontSize: 15,
                        background: sel ? '#FFB300' : 'rgba(255,255,255,0.05)',
                        border: sel ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        color: sel ? '#1A0A00' : 'rgba(255,255,255,0.7)',
                        boxShadow: sel ? '0 4px 16px rgba(255,179,0,0.3)' : 'none',
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location status */}
            {locStatus !== 'idle' && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                style={{
                  background: locStatus === 'ok' ? 'rgba(76,217,100,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${locStatus === 'ok' ? 'rgba(76,217,100,0.2)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <span style={{ fontSize: 13 }}>
                  {locStatus === 'loading' ? '📍' : locStatus === 'ok' ? '✅' : '📍'}
                </span>
                <span style={{ fontSize: 12, color: locStatus === 'ok' ? '#4CD964' : 'rgba(255,255,255,0.35)' }}>
                  {locStatus === 'loading' && 'Détection de ta position…'}
                  {locStatus === 'ok' && 'Position détectée — tu apparaîtras près de toi'}
                  {locStatus === 'denied' && 'Localisation désactivée — active-la pour apparaître en "À proximité"'}
                </span>
              </div>
            )}

            {/* Gender */}
            <div>
              <label
                className="block font-semibold uppercase mb-2"
                style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)' }}
              >
                Je suis
              </label>
              <div className="flex gap-2">
                {(['femme', 'homme', 'autre'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g);
                      // Auto-inverse lookingFor par défaut
                      if (g === 'homme') setLookingFor('femme');
                      else if (g === 'femme') setLookingFor('homme');
                    }}
                    className="flex-1 py-3 text-sm font-medium capitalize transition-all"
                    style={{
                      borderRadius: 14,
                      background: gender === g ? '#FFB300' : 'rgba(255,255,255,0.05)',
                      border: gender === g ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      color: gender === g ? '#1A0A00' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Looking For */}
            <div>
              <label
                className="block font-semibold uppercase mb-2"
                style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)' }}
              >
                Je cherche
              </label>
              <div className="flex gap-2">
                {([
                  { value: 'femme', label: 'Des femmes' },
                  { value: 'homme', label: 'Des hommes' },
                  { value: 'tous',  label: 'Tout le monde' },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setLookingFor(value)}
                    className="flex-1 py-3 text-xs font-medium transition-all"
                    style={{
                      borderRadius: 14,
                      background: lookingFor === value ? '#FFB300' : 'rgba(255,255,255,0.05)',
                      border: lookingFor === value ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      color: lookingFor === value ? '#1A0A00' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: QUIZ VIBES ── */}
        {step === 2 && quizStep < QUIZ.length && (
          <div className="flex flex-col gap-6">
            <h2
              className="font-headline font-black text-white leading-tight"
              style={{ fontSize: 28, letterSpacing: -0.5 }}
            >
              {QUIZ[quizStep].question}
            </h2>

            <div className="flex flex-col gap-3">
              {QUIZ[quizStep].options.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => handleQuizAnswer(opt.interests)}
                  className="flex items-center gap-4 text-left transition-all active:scale-[0.97]"
                  style={{
                    borderRadius: 20,
                    padding: '18px 20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,179,0,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,179,0,0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'; }}
                >
                  <span
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(255,179,0,0.1)', fontSize: 24 }}
                  >
                    {opt.emoji}
                  </span>
                  <span className="font-medium text-white" style={{ fontSize: 15 }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Back within quiz */}
            {quizStep > 0 && (
              <button
                onClick={() => setQuizStep(q => q - 1)}
                className="text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'left' }}
              >
                ← Question précédente
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2: BIO PREVIEW (after quiz) ── */}
        {step === 2 && quizStep === QUIZ.length && (
          <div className="flex flex-col gap-5">
            <div>
              <h2
                className="font-headline font-black text-white"
                style={{ fontSize: 28, letterSpacing: -0.5 }}
              >
                Voilà ta <em className="italic" style={{ color: '#FFB300' }}>bio</em> ✨
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                Générée depuis tes réponses — tu peux la modifier.
              </p>
            </div>

            {/* Interests chips (read-only recap) */}
            <div className="flex flex-wrap gap-2">
              {interests.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold"
                  style={{ borderRadius: 20, background: 'rgba(255,179,0,0.12)', border: '1px solid rgba(255,179,0,0.25)', color: '#FFB300' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bio textarea */}
            {aiLoading ? (
              <div
                className="flex items-center justify-center gap-3"
                style={{ height: 120, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <MangoIcon className="w-6 h-6 animate-pulse" />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Génération en cours…</span>
              </div>
            ) : (
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={5}
                className="w-full outline-none text-white resize-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,179,0,0.3)',
                  borderRadius: 16,
                  fontSize: 15,
                  padding: '14px 18px',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.7,
                }}
              />
            )}
          </div>
        )}

        {/* Navigation buttons — hidden during active quiz questions */}
        {!(step === 2 && quizStep < QUIZ.length) && (
          <div className="mt-auto pt-10 flex flex-col gap-3">
            <button
              onClick={() => {
                if (step < STEPS.length - 1) {
                  setStep(s => s + 1);
                } else {
                  finish();
                }
              }}
              disabled={saving || !canAdvance[step] || aiLoading}
              className="relative overflow-hidden w-full h-[60px] font-semibold text-white text-[17px] btn-shine active:scale-[0.97] transition-transform"
              style={{
                borderRadius: 20,
                background: canAdvance[step] && !aiLoading
                  ? 'linear-gradient(135deg, #FFB300 0%, #FF7A00 60%, #E84000 100%)'
                  : 'rgba(255,255,255,0.06)',
                boxShadow: canAdvance[step] && !aiLoading ? '0 10px 40px rgba(255,100,0,0.45)' : 'none',
                color: canAdvance[step] && !aiLoading ? 'white' : 'rgba(255,255,255,0.2)',
              }}
            >
              {saving ? 'Sauvegarde…' : aiLoading ? '✨ Génération…' : step < STEPS.length - 1 ? 'Continuer →' : 'C\'est parti 🥭'}
            </button>

            {step > 0 && !(step === 2 && quizStep === QUIZ.length) && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="w-full h-12 font-medium text-sm"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                ← Retour
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

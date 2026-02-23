/**
 * Génère des portraits réalistes avec Imagen 4.0 (Gemini)
 * et les stocke dans Firebase Storage, puis met à jour Firestore.
 */
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync } from 'fs';

const PROJECT_ID  = 'studio-3482489049-5e5d0';
const BUCKET      = 'studio-3482489049-5e5d0.firebasestorage.app';
const GEMINI_KEY  = 'AIzaSyBJJy3hJF9On9NaLiERr784IHncPidiSmQ';
const IMAGEN_URL  = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${GEMINI_KEY}`;

if (!getApps().length) initializeApp({ projectId: PROJECT_ID, storageBucket: BUCKET });
const db      = getFirestore();
const storage = getStorage().bucket();

// Profils à mettre à jour
const PROFILES = [
  // FEMMES
  { uid: 'ai_001', name: 'Awa',       gender: 'femme', prompt: 'Portrait photo of a 23-year-old Senegalese woman named Awa, fashion designer, warm smile, natural light, dark skin, elegant, wearing colorful wax fabric, neutral background' },
  { uid: 'ai_002', name: 'Fatou',     gender: 'femme', prompt: 'Portrait photo of a 26-year-old Senegalese woman named Fatou, dance teacher, joyful expression, dark skin, natural hair, vibrant, neutral studio background' },
  { uid: 'ai_003', name: 'Mariama',   gender: 'femme', prompt: 'Portrait photo of a 24-year-old Senegalese woman named Mariama, computer science student, intelligent look, dark skin, glasses, casual style, neutral background' },
  { uid: 'ai_004', name: 'Aminata',   gender: 'femme', prompt: 'Portrait photo of a 28-year-old Senegalese woman journalist, confident smile, dark skin, natural hair, professional but approachable, neutral background' },
  { uid: 'ai_005', name: 'Khady',     gender: 'femme', prompt: 'Portrait photo of a 22-year-old Senegalese woman artist, expressive eyes, dark skin, colorful head wrap, artistic background' },
  { uid: 'ai_006', name: 'Ndéye',     gender: 'femme', prompt: 'Portrait photo of a 27-year-old Senegalese woman nurse, caring smile, dark skin, natural hair, simple background, warm tone' },
  { uid: 'ai_007', name: 'Rokhaya',   gender: 'femme', prompt: 'Portrait photo of a 25-year-old Senegalese woman entrepreneur, confident posture, dark skin, modern style, slight smile, neutral background' },
  { uid: 'ai_008', name: 'Coumba',    gender: 'femme', prompt: 'Portrait photo of a 29-year-old Senegalese woman hotel manager, relaxed smile, dark skin, natural hair, casual elegance, neutral background' },
  { uid: 'ai_009', name: 'Astou',     gender: 'femme', prompt: 'Portrait photo of a 21-year-old Senegalese woman student, bright smile, dark skin, natural hair, youthful, casual style, neutral background' },
  { uid: 'ai_010', name: 'Binta',     gender: 'femme', prompt: 'Portrait photo of a 31-year-old Senegalese woman lawyer, serious but warm expression, dark skin, elegant, natural hair, professional background' },
  { uid: 'ai_021', name: 'Dieynaba', gender: 'femme', prompt: 'Portrait photo of a 26-year-old Senegalese woman influencer content creator, stylish, dark skin, modern fashion, bright smile, neutral background' },
  { uid: 'ai_022', name: 'Seynabou', gender: 'femme', prompt: 'Portrait photo of a 23-year-old West African woman English teacher from Louga Senegal, intellectual look, dark skin, natural hair, books nearby, soft background' },
  { uid: 'ai_023', name: 'Oumou',    gender: 'femme', prompt: 'Portrait photo of a 27-year-old Senegalese woman medical doctor, warm confident smile, dark skin, white coat, professional background' },
  { uid: 'ai_024', name: 'Aïssatou', gender: 'femme', prompt: 'Portrait photo of a 29-year-old Senegalese woman fintech executive, sharp look, dark skin, professional modern attire, city background' },
  { uid: 'ai_025', name: 'Nabou',    gender: 'femme', prompt: 'Portrait photo of a 22-year-old Senegalese woman fashion designer, creative style, dark skin, wearing hand-crafted wax fabric outfit, warm smile, neutral background' },
  // HOMMES
  { uid: 'ai_011', name: 'Moussa',     gender: 'homme', prompt: 'Portrait photo of a 27-year-old Senegalese man web developer and musician, relaxed smile, dark skin, casual modern style, neutral background' },
  { uid: 'ai_012', name: 'Ibrahima',   gender: 'homme', prompt: 'Portrait photo of a 30-year-old Senegalese athletic man, sports coach, confident, dark skin, athletic build, warm smile, outdoor background' },
  { uid: 'ai_013', name: 'Ousmane',   gender: 'homme', prompt: 'Portrait photo of a 25-year-old Senegalese civil engineer, intelligent look, dark skin, professional attire, slight smile, office background' },
  { uid: 'ai_014', name: 'Cheikh',    gender: 'homme', prompt: 'Portrait photo of a 28-year-old Senegalese documentary photographer, artistic look, dark skin, casual style, camera nearby, urban background' },
  { uid: 'ai_015', name: 'Abdou',     gender: 'homme', prompt: 'Portrait photo of a 24-year-old Senegalese tour guide Casamance, warm friendly smile, dark skin, natural outdoor setting, earthy tones' },
  { uid: 'ai_016', name: 'Samba',     gender: 'homme', prompt: 'Portrait photo of a 32-year-old Senegalese chef, friendly warm smile, dark skin, chef coat, kitchen background' },
  { uid: 'ai_017', name: 'Modou',     gender: 'homme', prompt: 'Portrait photo of a 26-year-old Senegalese entrepreneur businessman, confident smile, dark skin, business casual attire, neutral background' },
  { uid: 'ai_018', name: 'Pape',      gender: 'homme', prompt: 'Portrait photo of a 29-year-old Senegalese fisherman and musician, peaceful expression, dark skin, casual style, ocean background' },
  { uid: 'ai_019', name: 'Lamine',    gender: 'homme', prompt: 'Portrait photo of a 23-year-old Senegalese gamer esports player, energetic young look, dark skin, casual gaming style, neutral background' },
  { uid: 'ai_020', name: 'Bouba',     gender: 'homme', prompt: 'Portrait photo of a 34-year-old Senegalese architect, thoughtful expression, dark skin, sophisticated style, architectural background' },
  { uid: 'ai_026', name: 'Assane',    gender: 'homme', prompt: 'Portrait photo of a 28-year-old Senegalese football coach, energetic smile, dark skin, athletic style, sports background' },
  { uid: 'ai_027', name: 'Mame Diop', gender: 'homme', prompt: 'Portrait photo of a 31-year-old Senegalese music composer beatmaker, creative expression, dark skin, musical studio background' },
  { uid: 'ai_028', name: 'Souleymane',gender: 'homme', prompt: 'Portrait photo of a 26-year-old Senegalese veterinarian, gentle kind smile, dark skin, rural countryside background, professional but approachable' },
  { uid: 'ai_029', name: 'Omar',      gender: 'homme', prompt: 'Portrait photo of a 24-year-old Senegalese medical student from Saint-Louis, studious look, dark skin, books, university background' },
  { uid: 'ai_030', name: 'Babacar',   gender: 'homme', prompt: 'Portrait photo of a 30-year-old Senegalese financial consultant, sharp confident look, dark skin, business suit, professional background' },
];

async function generateImage(prompt) {
  const res = await fetch(IMAGEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: '3:4' },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error('No image returned: ' + JSON.stringify(data));
  return Buffer.from(b64, 'base64');
}

async function uploadToStorage(uid, imageBuffer) {
  const path = `ai-profiles/${uid}.jpg`;
  const file = storage.file(path);
  await file.save(imageBuffer, {
    metadata: { contentType: 'image/jpeg', cacheControl: 'public,max-age=31536000' },
    public: true,
  });
  return `https://storage.googleapis.com/${BUCKET}/${path}`;
}

async function run() {
  console.log(`🎨 Génération de ${PROFILES.length} portraits avec Imagen 4.0…\n`);
  let ok = 0, err = 0;

  for (const p of PROFILES) {
    process.stdout.write(`  ⏳ ${p.uid}  ${p.name}… `);
    try {
      const img = await generateImage(p.prompt);
      const url = await uploadToStorage(p.uid, img);
      await db.collection('users').doc(p.uid).update({ photoURL: url });
      console.log(`✅  ${url.split('/').pop()}`);
      ok++;
    } catch (e) {
      console.log(`❌  ${e.message.slice(0, 120)}`);
      err++;
    }
    // Petit délai pour éviter le rate-limit
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`✅ ${ok} photos générées   ❌ ${err} erreurs`);
  process.exit(err > 0 ? 1 : 0);
}

run();

/**
 * Script de seed Firestore via Admin SDK (bypass des règles de sécurité)
 * Usage: node scripts/seed-admin.mjs
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = 'studio-3482489049-5e5d0';

// Initialise avec Application Default Credentials (disponibles dans Firebase Studio / GCP)
if (!getApps().length) {
  initializeApp({ projectId: PROJECT_ID });
}

const db = getFirestore();

const photo  = (n)          => `https://i.pravatar.cc/400?img=${n}`;
const rphoto = (gender, n)  => `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

const AI_PROFILES = [
  // ── FEMMES ──────────────────────────────────────────────────────────────
  {
    uid: 'ai_001', displayName: 'Awa', age: 23, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Passionnée de mode et de cuisine sénégalaise 🍛 Je suis designer de mode, j'adore mélanger les tissus wax avec les tendances modernes. Le week-end je vais à la plage de N'Gor.",
    interests: ['Mode', 'Cuisine', 'Plage', 'Art'], photoURL: photo(1),
  },
  {
    uid: 'ai_002', displayName: 'Fatou', age: 26, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Professeure de danse mbalax et afrobeats 💃 La musique est ma vie. J'organise des soirées culturelles aux Almadies. Je cherche quelqu'un qui aime vibrer et s'amuser.",
    interests: ['Danse', 'Musique', 'Mbalax', 'Photographie'], photoURL: photo(5),
  },
  {
    uid: 'ai_003', displayName: 'Mariama', age: 24, city: 'Thiès',
    gender: 'femme', lookingFor: 'homme',
    bio: "Étudiante en informatique à l'École Supérieure Polytechnique 💻 Je code le jour, je lis la nuit. Fan de science-fi et de cuisine thiéboudienne.",
    interests: ['Tech', 'Lecture', 'Cuisine', 'Nature'], photoURL: photo(9),
  },
  {
    uid: 'ai_004', displayName: 'Aminata', age: 28, city: 'Saint-Louis',
    gender: 'femme', lookingFor: 'homme',
    bio: "Journaliste à RFM, amoureuse de Saint-Louis la belle 🏛️ J'ai voyagé dans 12 pays africains et je veux découvrir le monde entier.",
    interests: ['Voyage', 'Photographie', 'Lecture', 'Art'], photoURL: photo(10),
  },
  {
    uid: 'ai_005', displayName: 'Khady', age: 22, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Artiste peintre et photographe 🎨 J'expose régulièrement à la Galerie Nationale. L'Afrique est ma source d'inspiration infinie.",
    interests: ['Art', 'Photographie', 'Musique', 'Voyage'], photoURL: photo(11),
  },
  {
    uid: 'ai_006', displayName: 'Ndéye', age: 27, city: 'Ziguinchor',
    gender: 'femme', lookingFor: 'homme',
    bio: "Infirmière en Casamance, militante pour la santé communautaire 🌿 J'aime la nature, les balades en pirogue et le calme de la Casamance.",
    interests: ['Nature', 'Voyage', 'Sport', 'Cuisine'], photoURL: photo(12),
  },
  {
    uid: 'ai_007', displayName: 'Rokhaya', age: 25, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Entrepreneuse dans l'agroalimentaire 🚀 J'ai lancé ma marque de jus de bissap bio. Ambitieuse, positive et je crois fort au Made in Senegal.",
    interests: ['Entrepreneuriat', 'Cuisine', 'Plage', 'Mode'], photoURL: photo(16),
  },
  {
    uid: 'ai_008', displayName: 'Coumba', age: 29, city: 'Mbour',
    gender: 'femme', lookingFor: 'homme',
    bio: "Manager d'hôtel à Saly 🏖️ La mer est mon habitat naturel. Je fais du surf, du yoga sur la plage et je cuisine bien.",
    interests: ['Plage', 'Sport', 'Voyage', 'Cuisine'], photoURL: photo(20),
  },
  {
    uid: 'ai_009', displayName: 'Astou', age: 21, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Étudiante en gestion, fan de cinéma 🎬 Les films africains me passionnent, de Sembène Ousmane à Mati Diop. Je rêve de produire des films un jour.",
    interests: ['Cinéma', 'Musique', 'Art', 'Danse'], photoURL: photo(25),
  },
  {
    uid: 'ai_010', displayName: 'Binta', age: 31, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Avocate et militante des droits des femmes ⚖️ Je crois en l'amour authentique et les relations équilibrées. Non aux faux profils.",
    interests: ['Lecture', 'Danse', 'Voyage', 'Art'], photoURL: photo(27),
  },
  // ── FEMMES SUPPLÉMENTAIRES ───────────────────────────────────────────────
  {
    uid: 'ai_021', displayName: 'Dieynaba', age: 26, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Créatrice de contenu et influenceuse lifestyle 📱 Je partage la beauté du Sénégal sur Instagram. Mode, voyages, gastronomie — ma vie est une inspiration.",
    interests: ['Mode', 'Voyage', 'Photographie', 'Art'], photoURL: rphoto('women', 44),
  },
  {
    uid: 'ai_022', displayName: 'Seynabou', age: 23, city: 'Louga',
    gender: 'femme', lookingFor: 'homme',
    bio: "Prof d'anglais et passionnée de littérature africaine 📚 Chimamanda, Mariama Bâ, Ousmane Sembène — mes héros. Je rêve d'écrire mon propre roman un jour.",
    interests: ['Lecture', 'Écriture', 'Musique', 'Voyage'], photoURL: rphoto('women', 55),
  },
  {
    uid: 'ai_023', displayName: 'Oumou', age: 27, city: 'Kaolack',
    gender: 'femme', lookingFor: 'homme',
    bio: "Médecin en internat à l'hôpital régional 🩺 Je sauve des vies le jour, je lis des romans la nuit. Cherche quelqu'un de solide.",
    interests: ['Sport', 'Lecture', 'Cuisine', 'Nature'], photoURL: rphoto('women', 63),
  },
  {
    uid: 'ai_024', displayName: 'Aïssatou', age: 29, city: 'Dakar',
    gender: 'femme', lookingFor: 'homme',
    bio: "Chef de projet digital dans une startup fintech 💳 Je travaille sur l'inclusion financière en Afrique de l'Ouest. Femme ambitieuse cherche homme qui n'en a pas peur.",
    interests: ['Tech', 'Entrepreneuriat', 'Voyage', 'Danse'], photoURL: rphoto('women', 71),
  },
  {
    uid: 'ai_025', displayName: 'Nabou', age: 22, city: 'Rufisque',
    gender: 'femme', lookingFor: 'homme',
    bio: "Styliste et créatrice de mode wax 🧵 Ma collection mêle l'artisanat de Rufisque et les tendances mondiales. Simple, créative et bien dans ma peau.",
    interests: ['Mode', 'Art', 'Musique', 'Plage'], photoURL: rphoto('women', 42),
  },
  // ── HOMMES ───────────────────────────────────────────────────────────────
  {
    uid: 'ai_011', displayName: 'Moussa', age: 27, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Développeur web freelance et musicien le week-end 🎵 Je joue du kora et je code des apps. Passionné par la tech africaine et le mbalax de Youssou Ndour.",
    interests: ['Tech', 'Musique', 'Mbalax', 'Voyage'], photoURL: photo(33),
  },
  {
    uid: 'ai_012', displayName: 'Ibrahima', age: 30, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Coach sportif et nutritionniste 💪 La lutte sénégalaise et le football sont mes sports de cœur. La santé c'est la richesse.",
    interests: ['Sport', 'Lutte', 'Cuisine', 'Nature'], photoURL: photo(35),
  },
  {
    uid: 'ai_013', displayName: 'Ousmane', age: 25, city: 'Thiès',
    gender: 'homme', lookingFor: 'femme',
    bio: "Ingénieur en génie civil, bâtisseur de ponts 🏗️ Thiès est ma base mais Dakar est mon playground. J'aime le cinéma et les bonnes discussions autour d'un attaya.",
    interests: ['Cinéma', 'Voyage', 'Tech', 'Lecture'], photoURL: photo(36),
  },
  {
    uid: 'ai_014', displayName: 'Cheikh', age: 28, city: 'Saint-Louis',
    gender: 'homme', lookingFor: 'femme',
    bio: "Photographe documentaire basé à Saint-Louis 📸 Je capture les visages, les marchés, les sourires du Sénégal. Lauréat du prix Dak'Art.",
    interests: ['Photographie', 'Art', 'Voyage', 'Lecture'], photoURL: photo(51),
  },
  {
    uid: 'ai_015', displayName: 'Abdou', age: 24, city: 'Ziguinchor',
    gender: 'homme', lookingFor: 'femme',
    bio: "Guide touristique en Casamance et amateur de botanique 🌿 Je connais chaque arbre de la forêt de Casamance. La nature, les oiseaux, le fleuve — ma vie c'est ça.",
    interests: ['Nature', 'Voyage', 'Sport', 'Photographie'], photoURL: photo(52),
  },
  {
    uid: 'ai_016', displayName: 'Samba', age: 32, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Chef cuisinier dans un restaurant des Almadies 🐟 Le tiébou dieune de ma mère est ma religion. Je cherche quelqu'un à qui cuisiner.",
    interests: ['Cuisine', 'Tiébou', 'Plage', 'Musique'], photoURL: photo(53),
  },
  {
    uid: 'ai_017', displayName: 'Modou', age: 26, city: 'Kaolack',
    gender: 'homme', lookingFor: 'femme',
    bio: "Entrepreneur dans le commerce de noix de cajou 🚀 Kaolack c'est mes racines mais je voyage entre Paris et Abidjan pour le business.",
    interests: ['Entrepreneuriat', 'Voyage', 'Sport', 'Mode'], photoURL: photo(54),
  },
  {
    uid: 'ai_018', displayName: 'Pape', age: 29, city: 'Mbour',
    gender: 'homme', lookingFor: 'femme',
    bio: "Pêcheur et fondateur d'une coop de pêche durable 🐟 La mer est ma maison. Le matin je pêche, le soir je joue de la guitare sur la plage.",
    interests: ['Plage', 'Musique', 'Nature', 'Sport'], photoURL: photo(57),
  },
  {
    uid: 'ai_019', displayName: 'Lamine', age: 23, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Gamer pro et streamer sur YouTube 🎮 Je participe aux tournois e-sport d'Afrique de l'Ouest. Oui je suis gamer mais je sors aussi.",
    interests: ['Gaming', 'Tech', 'Sport', 'Musique'], photoURL: photo(60),
  },
  {
    uid: 'ai_020', displayName: 'Bouba', age: 34, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Architecte et passionné de patrimoine africain 🏛️ Je dessine des maisons qui parlent de l'Afrique. L'art, l'histoire, la famille — mes piliers.",
    interests: ['Art', 'Voyage', 'Lecture', 'Cinéma'], photoURL: photo(65),
  },
  // ── HOMMES SUPPLÉMENTAIRES ───────────────────────────────────────────────
  {
    uid: 'ai_026', displayName: 'Assane', age: 28, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Footballeur amateur et coach de jeunes à Parcelles Assainies ⚽ J'entraîne les U15 du quartier chaque weekend. Fan inconditionnel du Casa Sports.",
    interests: ['Sport', 'Musique', 'Voyage', 'Cuisine'], photoURL: rphoto('men', 43),
  },
  {
    uid: 'ai_027', displayName: 'Mame Diop', age: 31, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Compositeur et beatmaker afrobeat/hip-hop 🎹 J'ai collaboré avec des artistes de 6 pays africains. La musique est ma langue maternelle.",
    interests: ['Musique', 'Art', 'Voyage', 'Cinéma'], photoURL: rphoto('men', 38),
  },
  {
    uid: 'ai_028', displayName: 'Souleymane', age: 26, city: 'Thiès',
    gender: 'homme', lookingFor: 'femme',
    bio: "Vétérinaire passionné par l'élevage durable 🐄 Je travaille avec les éleveurs de la région de Thiès pour moderniser leurs pratiques.",
    interests: ['Nature', 'Sport', 'Lecture', 'Voyage'], photoURL: rphoto('men', 74),
  },
  {
    uid: 'ai_029', displayName: 'Omar', age: 24, city: 'Saint-Louis',
    gender: 'homme', lookingFor: 'femme',
    bio: "Étudiant en médecine à l'UGB de Saint-Louis 🏥 Entre les cours et les stages, je trouve le temps de peindre et de jouer aux échecs.",
    interests: ['Art', 'Lecture', 'Cinéma', 'Sport'], photoURL: rphoto('men', 22),
  },
  {
    uid: 'ai_030', displayName: 'Babacar', age: 30, city: 'Dakar',
    gender: 'homme', lookingFor: 'femme',
    bio: "Consultant financier et entrepreneur dans l'immobilier 🏢 J'aide les Sénégalais de la diaspora à investir au pays. Cherche une partenaire de vie, pas juste une relation.",
    interests: ['Entrepreneuriat', 'Voyage', 'Sport', 'Cuisine'], photoURL: rphoto('men', 91),
  },
];

async function seed() {
  console.log(`🚀 Injection de ${AI_PROFILES.length} profils dans Firestore…\n`);
  let ok = 0, err = 0;

  for (const profile of AI_PROFILES) {
    try {
      const { uid, ...data } = profile;
      await db.collection('users').doc(uid).set({
        ...data,
        uid,
        createdAt: FieldValue.serverTimestamp(),
        lastSeen: FieldValue.serverTimestamp(),
      });
      console.log(`  ✅  ${uid}  ${profile.displayName}, ${profile.age} — ${profile.city}`);
      ok++;
    } catch (e) {
      console.error(`  ❌  ${profile.uid}  ${e.message}`);
      err++;
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅ ${ok} profils injectés   ❌ ${err} erreurs`);
  process.exit(err > 0 ? 1 : 0);
}

seed();

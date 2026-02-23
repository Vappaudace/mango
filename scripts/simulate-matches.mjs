/**
 * Simule des matchs entre le vrai user et des profils IA féminins.
 */
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = 'studio-3482489049-5e5d0';
if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

const REAL_UID = 'kPJM7fdJ2uUkYpjDEC5rXkNfV1k2';

// IDs des profils IA féminins avec qui on simule un match
const AI_MATCH_UIDS = ['ai_001', 'ai_002', 'ai_005', 'ai_007', 'ai_021', 'ai_024'];

function getMatchId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

async function run() {
  // Récupère le profil du vrai user
  const userDoc = await db.collection('users').doc(REAL_UID).get();
  const userProfile = userDoc.data();
  console.log(`\n💘 Simulation de matchs pour ${userProfile.displayName}\n`);

  for (const aiUid of AI_MATCH_UIDS) {
    const aiDoc = await db.collection('users').doc(aiUid).get();
    const aiProfile = aiDoc.data();

    const matchId = getMatchId(REAL_UID, aiUid);

    // 1. Swipe du vrai user → IA (liked)
    await db.collection('swipes').doc(REAL_UID).collection('liked').doc(aiUid).set({
      timestamp: FieldValue.serverTimestamp(),
    });

    // 2. Swipe de l'IA → vrai user (liked) — simule le like retour
    await db.collection('swipes').doc(aiUid).collection('liked').doc(REAL_UID).set({
      timestamp: FieldValue.serverTimestamp(),
    });

    // 3. Crée le document match
    await db.collection('matches').doc(matchId).set({
      users: [REAL_UID, aiUid],
      userProfiles: {
        [REAL_UID]: {
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL ?? '',
        },
        [aiUid]: {
          displayName: aiProfile.displayName,
          photoURL: aiProfile.photoURL ?? '',
        },
      },
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(`  💛  Match créé : ${userProfile.displayName} ↔ ${aiProfile.displayName} (${aiUid})`);
  }

  console.log(`\n✅ ${AI_MATCH_UIDS.length} matchs simulés avec succès !`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

/**
 * Backfill inbound_likes for demo purposes.
 * Creates one-way likes (AI → user) from profiles NOT yet matched with the user.
 * Run: node scripts/backfill-inbound-likes.mjs
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'studio-3482489049-5e5d0';
if (!getApps().length) {
  initializeApp({ projectId: PROJECT_ID });
}
const db = getFirestore();

// The real user UID
const USER_UID = 'kPJM7fdJ2uUkYpjDEC5rXkNfV1k2';

// AI profiles that are already matched with the user (skip these)
const ALREADY_MATCHED = new Set(['ai_001', 'ai_002', 'ai_005', 'ai_007', 'ai_021', 'ai_024']);

// Pick a handful of unmatched female AI profiles to simulate likes
const LIKERS = ['ai_003', 'ai_004', 'ai_006', 'ai_008', 'ai_022', 'ai_023', 'ai_025'];

async function run() {
  let seeded = 0;
  for (const uid of LIKERS) {
    if (ALREADY_MATCHED.has(uid)) continue;

    // Fetch profile
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) {
      console.log(`  ⚠️  ${uid} not found in Firestore`);
      continue;
    }
    const profile = snap.data();

    // Write inbound_like
    await db
      .collection('inbound_likes')
      .doc(USER_UID)
      .collection('from')
      .doc(uid)
      .set({
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        timestamp: new Date(),
      });

    console.log(`  ✅  ${profile.displayName} (${uid}) → inbound_like créé`);
    seeded++;
  }
  console.log(`\n${seeded} inbound_likes créés.`);
}

run().catch(console.error);

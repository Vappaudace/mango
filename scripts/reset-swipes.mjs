/**
 * Efface tous les swipes de Firestore pour repartir de zéro.
 */
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'studio-3482489049-5e5d0';
if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

async function deleteCollection(ref) {
  const snap = await ref.limit(100).get();
  if (snap.empty) return 0;
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  return snap.size;
}

async function run() {
  console.log('🗑️  Suppression de tous les swipes…\n');

  // Liste tous les docs dans /swipes (chaque doc = un user)
  const usersSnap = await db.collection('swipes').get();
  let total = 0;

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const liked  = await deleteCollection(db.collection('swipes').doc(uid).collection('liked'));
    const passed = await deleteCollection(db.collection('swipes').doc(uid).collection('passed'));
    await userDoc.ref.delete();
    const count = liked + passed;
    if (count > 0) console.log(`  ✅  ${uid}  — ${liked} likes + ${passed} passes supprimés`);
    total += count;
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ ${total} swipes supprimés au total`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

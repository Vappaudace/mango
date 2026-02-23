/**
 * Affiche tous les vrais users (non-IA) et corrige leur lookingFor si nécessaire.
 */
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'studio-3482489049-5e5d0';
if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

async function run() {
  const snap = await db.collection('users').get();
  const realUsers = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(u => !u.id.startsWith('ai_'));

  console.log(`\n👤 Vrais utilisateurs trouvés : ${realUsers.length}\n`);

  for (const u of realUsers) {
    console.log(`  uid       : ${u.id}`);
    console.log(`  nom       : ${u.displayName}`);
    console.log(`  genre     : ${u.gender}`);
    console.log(`  lookingFor: ${u.lookingFor}`);

    // Si genre = 'homme' mais lookingFor = 'homme' → corrige en 'femme'
    // Si genre = 'femme' mais lookingFor = 'femme' → corrige en 'homme'
    const wronglySetSame = u.gender === u.lookingFor && u.lookingFor !== 'tous';
    if (wronglySetSame) {
      const fixed = u.gender === 'homme' ? 'femme' : 'homme';
      await db.collection('users').doc(u.id).update({ lookingFor: fixed });
      console.log(`  ✅ lookingFor corrigé : ${u.lookingFor} → ${fixed}`);
    } else {
      console.log(`  ✅ lookingFor OK`);
    }
    console.log();
  }
}

run().catch(e => { console.error(e); process.exit(1); });

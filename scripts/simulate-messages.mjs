/**
 * Simule des premiers messages des profils IA dans les matchs existants.
 */
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = 'studio-3482489049-5e5d0';
if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

const REAL_UID = 'kPJM7fdJ2uUkYpjDEC5rXkNfV1k2';

function getMatchId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

const AI_MESSAGES = [
  { aiUid: 'ai_001', messages: [
    "Salut 😊 j'ai vu ton profil et j'ai bien aimé",
    "T'es de Dakar aussi ?",
  ]},
  { aiUid: 'ai_002', messages: [
    "Waw match ! 💃 T'aimes la danse ?",
  ]},
  { aiUid: 'ai_005', messages: [
    "Salut ! Ton profil m'a vraiment parlé 🎨",
    "T'es dans quel quartier à Dakar ?",
  ]},
  { aiUid: 'ai_007', messages: [
    "Hey ! Ça match 🥭 Comment tu vas ?",
  ]},
  { aiUid: 'ai_021', messages: [
    "Bonjour ! J'espère que tu vas bien 😊",
    "Tu fais quoi comme boulot ?",
  ]},
  { aiUid: 'ai_024', messages: [
    "Salut ! T'es dans la tech toi aussi ? 💻",
  ]},
];

async function run() {
  console.log('\n💬 Simulation de messages IA…\n');

  for (const { aiUid, messages } of AI_MESSAGES) {
    const matchId = getMatchId(REAL_UID, aiUid);
    const aiDoc = await db.collection('users').doc(aiUid).get();
    const aiName = aiDoc.data()?.displayName ?? aiUid;

    let lastMsg = '';
    for (const text of messages) {
      await db.collection('messages').doc(matchId).collection('msgs').add({
        senderId: aiUid,
        text,
        createdAt: FieldValue.serverTimestamp(),
        read: false,
      });
      lastMsg = text;
      // Petit délai pour avoir des timestamps différents
      await new Promise(r => setTimeout(r, 300));
    }

    // Met à jour le match avec le dernier message
    await db.collection('matches').doc(matchId).update({
      lastMessage: lastMsg,
      lastMessageAt: FieldValue.serverTimestamp(),
      lastMessageSenderId: aiUid,
    });

    console.log(`  💬  ${aiName} → "${lastMsg}"`);
  }

  console.log('\n✅ Messages simulés avec succès !');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

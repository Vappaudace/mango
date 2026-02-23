import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
  onSnapshot,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, Match, Message, InboundLike } from './types';

// ─── USERS ────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'lastSeen'>): Promise<void> {
  await setDoc(doc(db, 'users', profile.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
  });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { ...data, lastSeen: serverTimestamp() });
}

/** Returns profiles not yet swiped by the current user, filtered by gender preference. */
export async function getDiscoveryProfiles(
  currentUid: string,
  currentProfile: UserProfile
): Promise<UserProfile[]> {
  // Get already-swiped UIDs
  const likedSnap = await getDocs(collection(db, 'swipes', currentUid, 'liked'));
  const passedSnap = await getDocs(collection(db, 'swipes', currentUid, 'passed'));
  const swipedUids = new Set([
    ...likedSnap.docs.map(d => d.id),
    ...passedSnap.docs.map(d => d.id),
    currentUid,
  ]);

  const usersSnap = await getDocs(query(collection(db, 'users'), limit(100)));
  return usersSnap.docs
    .map(d => d.data() as UserProfile)
    .filter(u => {
      if (swipedUids.has(u.uid)) return false;
      // L'autre profil doit correspondre à ce que je cherche
      const iWantThem =
        currentProfile.lookingFor === 'tous' || u.gender === currentProfile.lookingFor;
      // L'autre profil doit chercher mon genre (ou chercher tout le monde)
      const theyWantMe =
        u.lookingFor === 'tous' || u.lookingFor === currentProfile.gender;
      return iWantThem && theyWantMe;
    });
}

// ─── SWIPES & MATCHES ─────────────────────────────────────────────────────

/** matchId is deterministic: sorted UIDs joined by '_' */
export function getMatchId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_');
}

/**
 * Records a swipe. Returns the match object if it's a mutual like, null otherwise.
 */
export async function recordSwipe(
  fromUid: string,
  toUid: string,
  direction: 'liked' | 'passed',
  fromProfile: Pick<UserProfile, 'displayName' | 'photoURL'>,
  toProfile: Pick<UserProfile, 'displayName' | 'photoURL'>
): Promise<Match | null> {
  const batch = writeBatch(db);

  // Save swipe
  batch.set(doc(db, 'swipes', fromUid, direction, toUid), {
    timestamp: serverTimestamp(),
  });

  // Track inbound likes so the recipient can see who liked them
  if (direction === 'liked') {
    batch.set(doc(db, 'inbound_likes', toUid, 'from', fromUid), {
      displayName: fromProfile.displayName,
      photoURL: fromProfile.photoURL,
      timestamp: serverTimestamp(),
    });
  }

  await batch.commit();

  if (direction === 'passed') return null;

  // Check if the other person already liked us
  const theyLikedMe = await getDoc(doc(db, 'swipes', toUid, 'liked', fromUid));
  if (!theyLikedMe.exists()) return null;

  // 🎉 Mutual like → create match
  const matchId = getMatchId(fromUid, toUid);
  const matchData: Omit<Match, 'id'> = {
    users: [fromUid, toUid],
    userProfiles: {
      [fromUid]: fromProfile,
      [toUid]: toProfile,
    },
    createdAt: serverTimestamp() as any,
  };

  await setDoc(doc(db, 'matches', matchId), matchData);
  return { id: matchId, ...matchData };
}

// ─── INBOUND LIKES ────────────────────────────────────────────────────────

/** Listen to profiles who liked the current user (not yet matched) */
export function listenToInboundLikes(
  uid: string,
  callback: (likes: InboundLike[]) => void
): Unsubscribe {
  return onSnapshot(collection(db, 'inbound_likes', uid, 'from'), snap => {
    callback(snap.docs.map(d => ({ fromUid: d.id, ...d.data() } as InboundLike)));
  });
}

// ─── MATCHES ──────────────────────────────────────────────────────────────

/** Listen to all matches for a user in real time */
export function listenToMatches(
  uid: string,
  callback: (matches: Match[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'matches'),
    where('users', 'array-contains', uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Match)));
  });
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────

/** Listen to messages in a match conversation */
export function listenToMessages(
  matchId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'messages', matchId, 'msgs'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
  });
}

/** Send a message and update the match's lastMessage */
export async function sendMessage(
  matchId: string,
  senderId: string,
  text: string
): Promise<void> {
  await addDoc(collection(db, 'messages', matchId, 'msgs'), {
    senderId,
    text,
    createdAt: serverTimestamp(),
    read: false,
  });
  await updateDoc(doc(db, 'matches', matchId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: senderId,
  });
}

/** Mark all messages from the other user as read */
export async function markMessagesRead(matchId: string, myUid: string): Promise<void> {
  const q = query(
    collection(db, 'messages', matchId, 'msgs'),
    where('senderId', '!=', myUid),
    where('read', '==', false)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
}

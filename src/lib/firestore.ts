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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { UserProfile, Match, Message, InboundLike } from './types';

// ─── GEO HELPERS ──────────────────────────────────────────────────────────

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
  const blockedSnap = await getDocs(collection(db, 'blocks', currentUid, 'blocked'));
  const swipedUids = new Set([
    ...likedSnap.docs.map(d => d.id),
    ...passedSnap.docs.map(d => d.id),
    ...blockedSnap.docs.map(d => d.id),
    currentUid,
  ]);

  const usersSnap = await getDocs(query(collection(db, 'users'), limit(100)));
  const myLat = currentProfile.lat;
  const myLng = currentProfile.lng;

  return usersSnap.docs
    .map(d => {
      const u = d.data() as UserProfile;
      if (myLat !== undefined && myLng !== undefined && u.lat !== undefined && u.lng !== undefined) {
        u.distanceKm = Math.round(haversineKm(myLat, myLng, u.lat, u.lng));
      }
      return u;
    })
    .filter(u => {
      if (swipedUids.has(u.uid)) return false;
      const iWantThem =
        currentProfile.lookingFor === 'tous' || u.gender === currentProfile.lookingFor;
      const theyWantMe =
        u.lookingFor === 'tous' || u.lookingFor === currentProfile.gender;
      return iWantThem && theyWantMe;
    })
    .sort((a, b) => {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
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

/** Upload a voice note blob and send it as an audio message */
export async function sendAudioMessage(
  matchId: string,
  senderId: string,
  audioBlob: Blob,
  duration: number
): Promise<void> {
  const filename = `audio/${matchId}/${senderId}_${Date.now()}.webm`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, audioBlob, { contentType: 'audio/webm' });
  const audioURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'messages', matchId, 'msgs'), {
    senderId,
    text: '🎤 Vocal',
    type: 'audio',
    audioURL,
    audioDuration: Math.round(duration),
    createdAt: serverTimestamp(),
    read: false,
  });
  await updateDoc(doc(db, 'matches', matchId), {
    lastMessage: '🎤 Vocal',
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: senderId,
  });
}

// ─── BLOCK & REPORT ───────────────────────────────────────────────────────

/** Block a user — they'll disappear from discovery and chat */
export async function blockUser(myUid: string, targetUid: string): Promise<void> {
  await setDoc(doc(db, 'blocks', myUid, 'blocked', targetUid), {
    timestamp: serverTimestamp(),
  });
}

/** Report a user for inappropriate behavior */
export async function reportUser(
  myUid: string,
  targetUid: string,
  reason: string
): Promise<void> {
  await addDoc(collection(db, 'reports'), {
    reportedBy: myUid,
    reportedUid: targetUid,
    reason,
    createdAt: serverTimestamp(),
    status: 'pending',
  });
}

/** Get list of UIDs blocked by the current user */
export async function getBlockedUids(myUid: string): Promise<Set<string>> {
  const snap = await getDocs(collection(db, 'blocks', myUid, 'blocked'));
  return new Set(snap.docs.map(d => d.id));
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

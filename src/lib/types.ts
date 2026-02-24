import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  photoURL: string;
  gender: 'homme' | 'femme' | 'autre';
  lookingFor: 'homme' | 'femme' | 'tous';
  createdAt: Timestamp;
  lastSeen: Timestamp;
  lat?: number;
  lng?: number;
  /** Computed at runtime only — never stored in Firestore */
  distanceKm?: number;
}

export interface Match {
  id: string;
  users: string[];
  userProfiles: {
    [uid: string]: {
      displayName: string;
      photoURL: string;
    };
  };
  createdAt: Timestamp;
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  lastMessageSenderId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  type?: 'text' | 'audio';
  audioURL?: string;
  audioDuration?: number; // seconds
  createdAt: Timestamp;
  read: boolean;
}

export interface InboundLike {
  fromUid: string;
  displayName: string;
  photoURL: string;
  timestamp: Timestamp;
}

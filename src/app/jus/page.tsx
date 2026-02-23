"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { listenToMatches } from '@/lib/firestore';
import type { Match } from '@/lib/types';
import { MangoIcon } from '@/components/mango-icons';

function timeAgo(ts: any): string {
  if (!ts?.seconds) return '';
  const d = new Date(ts.seconds * 1000);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'maintenant';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
}

export default function MessagesPage() {
  const { user, loading } = useRequireAuth();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToMatches(user.uid, setMatches);
    return unsub;
  }, [user]);

  const newMatches = matches.filter(m => !m.lastMessage);
  const conversations = matches.filter(m => !!m.lastMessage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
        <MangoIcon className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: '#0D0D0D' }}>
      <header className="flex items-center px-6" style={{ paddingTop: 58, paddingBottom: 16 }}>
        <h1 className="font-headline font-black text-white" style={{ fontSize: 28, letterSpacing: -0.5 }}>
          Messages
        </h1>
        {matches.length > 0 && (
          <span
            className="ml-3 px-2.5 py-1 text-xs font-bold"
            style={{ borderRadius: 20, background: 'rgba(255,179,0,0.15)', color: '#FFB300', border: '1px solid rgba(255,179,0,0.25)' }}
          >
            {matches.length}
          </span>
        )}
      </header>

      <main className="px-6 flex flex-col gap-8">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <MangoIcon className="w-14 h-14 opacity-30" />
            <p className="text-lg font-headline italic text-white">Aucun match pour l'instant…</p>
            <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Continue à swiper pour trouver des matchs !
            </p>
            <Link
              href="/discover"
              className="mt-2 px-6 py-3 rounded-[20px] text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #FFB300, #FF7A00)' }}
            >
              Découvrir des profils
            </Link>
          </div>
        ) : (
          <>
            {/* New matches — no messages yet */}
            {newMatches.length > 0 && (
              <section>
                <p className="font-bold uppercase tracking-widest mb-4" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  Nouveaux matchs
                </p>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                  {newMatches.map(m => {
                    const otherUid = m.users.find(uid => uid !== user?.uid) ?? '';
                    const other = m.userProfiles[otherUid];
                    return (
                      <Link key={m.id} href={`/jus/${m.id}`} className="flex flex-col items-center gap-2 shrink-0">
                        <div style={{ padding: 2, borderRadius: '50%', background: 'linear-gradient(135deg, #FFB300, #FF6000)' }}>
                          <div
                            className="flex items-center justify-center overflow-hidden"
                            style={{ width: 68, height: 68, borderRadius: '50%', background: '#1a1a1a', border: '2px solid #0D0D0D' }}
                          >
                            {other?.photoURL
                              ? <img src={other.photoURL} alt={other.displayName} className="w-full h-full object-cover" />
                              : <span style={{ fontSize: 28 }}>🌟</span>}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-white truncate" style={{ maxWidth: 72 }}>
                          {other?.displayName?.split(' ')[0]}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Active conversations */}
            {conversations.length > 0 && (
              <section>
                <p className="font-bold uppercase tracking-widest mb-4" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  Conversations
                </p>
                <div className="flex flex-col gap-3">
                  {conversations.map(m => {
                    const otherUid = m.users.find(uid => uid !== user?.uid) ?? '';
                    const other = m.userProfiles[otherUid];
                    const isFromMe = m.lastMessageSenderId === user?.uid;
                    return (
                      <Link
                        key={m.id}
                        href={`/jus/${m.id}`}
                        className="flex items-center gap-4"
                        style={{ padding: '14px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <div
                          className="flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ width: 52, height: 52, borderRadius: '50%', background: '#1a1a1a', position: 'relative' }}
                        >
                          {other?.photoURL
                            ? <img src={other.photoURL} alt="" className="w-full h-full object-cover" />
                            : <span style={{ fontSize: 22 }}>🌟</span>}
                          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#4CD964', border: '2px solid #0D0D0D' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-semibold" style={{ fontSize: 15 }}>{other?.displayName}</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{timeAgo(m.lastMessageAt)}</span>
                          </div>
                          <p className="truncate" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                            {isFromMe ? 'Toi : ' : ''}{m.lastMessage}
                          </p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

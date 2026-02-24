"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { listenToMessages, sendMessage, sendAudioMessage, markMessagesRead, blockUser, reportUser } from '@/lib/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message, Match } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MangoIcon } from '@/components/mango-icons';
import { generateIcebreakers } from '@/ai/flows/ai-jus-icebreaker';

// ── Audio bubble ─────────────────────────────────────────────────────────
function AudioBubble({ url, duration, isMine }: { url: string; duration: number; isMine: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.ontimeupdate = () => {
        const a = audioRef.current!;
        setProgress(a.currentTime / (a.duration || 1));
        setElapsed(Math.floor(a.currentTime));
      };
      audioRef.current.onended = () => { setPlaying(false); setProgress(0); setElapsed(0); };
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const bars = [6,10,14,10,18,8,14,10,6,18,10,14,8,16,10,6,14,10,18,8,12,8];

  return (
    <div className="flex items-center gap-2.5" style={{ minWidth: 160 }}>
      <button
        onClick={toggle}
        className="flex items-center justify-center shrink-0"
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isMine ? 'rgba(255,255,255,0.25)' : 'rgba(255,179,0,0.15)',
          border: isMine ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,179,0,0.3)',
        }}
      >
        {playing
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill={isMine ? 'white' : '#FFB300'}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill={isMine ? 'white' : '#FFB300'}><polygon points="5 3 19 12 5 21 5 3"/></svg>
        }
      </button>

      {/* Waveform bars */}
      <div className="flex items-center gap-[2px] flex-1" style={{ height: 28 }}>
        {bars.map((h, i) => {
          const filled = (i / bars.length) <= progress;
          return (
            <div
              key={i}
              style={{
                width: 3, borderRadius: 2, height: h,
                background: filled
                  ? (isMine ? 'rgba(255,255,255,0.9)' : '#FFB300')
                  : (isMine ? 'rgba(255,255,255,0.3)' : 'rgba(255,179,0,0.3)'),
                transition: 'background 0.1s',
              }}
            />
          );
        })}
      </div>

      <span style={{ fontSize: 11, color: isMine ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)', minWidth: 32, textAlign: 'right' }}>
        {playing ? fmt(elapsed) : fmt(duration)}
      </span>
    </div>
  );
}

// ── Main chat page ────────────────────────────────────────────────────────
export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;
  const { user, loading: authLoading } = useRequireAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load match info
  useEffect(() => {
    if (!matchId) return;
    getDoc(doc(db, 'matches', matchId)).then(snap => {
      if (snap.exists()) setMatch({ id: snap.id, ...snap.data() } as Match);
    });
  }, [matchId]);

  // Real-time messages
  useEffect(() => {
    if (!matchId) return;
    const unsub = listenToMessages(matchId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });
    return unsub;
  }, [matchId]);

  // Mark messages as read
  useEffect(() => {
    if (!user || !matchId) return;
    markMessagesRead(matchId, user.uid).catch(() => {});
  }, [messages, matchId, user]);

  const otherProfile = match && user
    ? match.userProfiles[match.users.find(uid => uid !== user.uid) ?? '']
    : null;

  const loadIcebreakers = async () => {
    if (!otherProfile || icebreakers.length > 0) {
      setShowIcebreakers(v => !v);
      return;
    }
    try {
      const result = await generateIcebreakers({ bio: '', interests: [] });
      setIcebreakers(result);
      setShowIcebreakers(true);
    } catch { /* ignore */ }
  };

  const handleBlock = async () => {
    if (!user || !match) return;
    const otherUid = match.users.find(uid => uid !== user.uid) ?? '';
    if (!otherUid) return;
    await blockUser(user.uid, otherUid);
    setShowMenu(false);
    router.back();
  };

  const handleReport = async () => {
    if (!user || !match) return;
    const otherUid = match.users.find(uid => uid !== user.uid) ?? '';
    if (!otherUid) return;
    await reportUser(user.uid, otherUid, 'inappropriate_behavior');
    await blockUser(user.uid, otherUid);
    setShowMenu(false);
    router.back();
  };

  const handleSend = async () => {
    if (!text.trim() || !user || sending) return;
    const msg = text.trim();
    setText('');
    setSending(true);
    try {
      await sendMessage(matchId, user.uid, msg);
    } finally {
      setSending(false);
    }
  };

  // ── Voice recording ──────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mr = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start(100);
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordSecs(0);
      recordTimerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    } catch {
      // Microphone permission denied
    }
  }, [recording]);

  const stopRecording = useCallback(async (cancel = false) => {
    if (!recording || !mediaRecorderRef.current) return;
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    const duration = recordSecs;
    setRecording(false);
    setRecordSecs(0);

    const mr = mediaRecorderRef.current;
    mediaRecorderRef.current = null;

    if (cancel) {
      mr.stop();
      mr.stream.getTracks().forEach(t => t.stop());
      audioChunksRef.current = [];
      return;
    }

    await new Promise<void>(resolve => { mr.onstop = () => resolve(); mr.stop(); });
    mr.stream.getTracks().forEach(t => t.stop());

    if (audioChunksRef.current.length === 0 || duration < 1 || !user) return;
    const mimeType = audioChunksRef.current[0].type || 'audio/webm';
    const blob = new Blob(audioChunksRef.current, { type: mimeType });
    audioChunksRef.current = [];
    setSending(true);
    try {
      await sendAudioMessage(matchId, user.uid, blob, duration);
    } finally {
      setSending(false);
    }
  }, [recording, recordSecs, matchId, user]);

  const fmtSecs = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
        <MangoIcon className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0D0D0D' }}>

      {/* Header */}
      <header
        className="flex items-center gap-3 shrink-0"
        style={{ paddingTop: 54, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0D0D0D' }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center shrink-0"
          style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5 flex-1">
          <div className="relative shrink-0">
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #FFB300, #FF6000)', border: '2px solid rgba(255,179,0,0.4)', fontSize: 20 }}
            >
              {otherProfile?.photoURL
                ? <img src={otherProfile.photoURL} alt="" className="w-full h-full object-cover" />
                : '🌟'}
            </div>
            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#4CD964', border: '2px solid #0D0D0D' }} />
          </div>
          <div>
            <p className="text-white font-semibold" style={{ fontSize: 16 }}>{otherProfile?.displayName ?? '…'}</p>
            <p style={{ fontSize: 11, color: '#4CD964' }}>En ligne</p>
          </div>
        </div>

        <button
          onClick={loadIcebreakers}
          className="flex items-center justify-center"
          style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.2)' }}
          title="Suggestions IA"
        >
          <MangoIcon className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(v => !v)}
            className="flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', top: 48, right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', zIndex: 50, minWidth: 160 }}>
              <button onClick={handleBlock} className="w-full text-left px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                🚫 Bloquer
              </button>
              <button onClick={handleReport} className="w-full text-left px-4 py-3 text-sm" style={{ color: '#ff4444', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                ⚠️ Signaler
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Match banner */}
      <div
        className="flex items-center gap-2.5 shrink-0 px-5"
        style={{ paddingTop: 10, paddingBottom: 10, background: 'rgba(255,179,0,0.07)', borderBottom: '1px solid rgba(255,179,0,0.12)' }}
      >
        <span style={{ fontSize: 14 }}>🥭 ❤️ 🥭</span>
        <p style={{ fontSize: 11, color: 'rgba(255,179,0,0.8)', lineHeight: 1.4 }}>
          Vous vous êtes mutuellem. plû · Commencez à discuter !
        </p>
      </div>

      {/* AI icebreakers */}
      {showIcebreakers && icebreakers.length > 0 && (
        <div
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {icebreakers.map((ice, i) => (
            <button
              key={i}
              onClick={() => { setText(ice); setShowIcebreakers(false); }}
              className="shrink-0 text-xs font-medium px-3 py-2 text-left"
              style={{
                maxWidth: 220, borderRadius: 14,
                background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.2)',
                color: 'rgba(255,255,255,0.8)', lineHeight: 1.4,
              }}
            >
              {ice}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <main
        className="flex-1 overflow-y-auto flex flex-col gap-2.5 scrollbar-hide"
        style={{ padding: '16px 16px 8px' }}
      >
        {messages.length === 0 && (
          <p className="text-center text-sm font-light mt-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Commencez la conversation 🥭
          </p>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === user?.uid;
          return (
            <div
              key={msg.id}
              className={cn(
                'flex items-end gap-2 max-w-[85%]',
                isMine ? 'self-end flex-row-reverse' : 'self-start'
              )}
            >
              {!isMine && (
                <div
                  className="shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', fontSize: 14 }}
                >
                  {otherProfile?.photoURL
                    ? <img src={otherProfile.photoURL} alt="" className="w-full h-full object-cover" />
                    : '🌟'}
                </div>
              )}
              <div
                className="px-3.5 py-2.5"
                style={{
                  borderRadius: 20,
                  ...(isMine
                    ? { background: 'linear-gradient(135deg, #FFB300, #FF7A00)', borderBottomRightRadius: 6, boxShadow: '0 4px 16px rgba(255,120,0,0.3)' }
                    : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius: 6 }),
                }}
              >
                {msg.type === 'audio' && msg.audioURL ? (
                  <AudioBubble url={msg.audioURL} duration={msg.audioDuration ?? 0} isMine={isMine} />
                ) : (
                  <p style={{ fontSize: 14, color: isMine ? 'white' : 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <footer
        className="flex items-center gap-2 shrink-0"
        style={{ padding: '10px 12px 30px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0D0D0D' }}
      >
        {recording ? (
          /* ── Recording mode ── */
          <>
            <button
              onPointerUp={() => stopRecording(true)}
              style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(255,68,68,0.15)', fontSize: 16, cursor: 'pointer' }}
            >
              🗑️
            </button>

            <div
              className="flex-1 flex items-center gap-2 justify-center"
              style={{ height: 42, background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 21 }}
            >
              <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF4444', display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                🎤 {fmtSecs(recordSecs)}
              </span>
            </div>

            <button
              onPointerUp={() => stopRecording(false)}
              className="flex items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #FFB300, #FF7A00)', border: 'none', cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </>
        ) : (
          /* ── Normal mode ── */
          <>
            <button style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'transparent', fontSize: 18, opacity: 0.5 }}>
              😊
            </button>

            <input
              type="text"
              placeholder="Écris ton Jus…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 outline-none"
              style={{ height: 42, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 21, color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: 14, padding: '0 16px' }}
            />

            {text.trim() ? (
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center justify-center transition-all"
                style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #FFB300, #FF7A00)', border: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            ) : (
              <button
                onPointerDown={startRecording}
                className="flex items-center justify-center transition-all active:scale-90"
                style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,179,0,0.12)', border: '1px solid rgba(255,179,0,0.25)', fontSize: 18 }}
              >
                🎤
              </button>
            )}
          </>
        )}
      </footer>
    </div>
  );
}


"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send, Image as ImageIcon, Music, MoreVertical, Smile } from 'lucide-react';
import { MangoIcon } from '@/components/mango-icons';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MOCK_CHAT = [
  { id: '1', sender: 'other', text: 'Salut ! J\'ai adoré ton profil MANGO.', time: '12:30' },
  { id: '2', sender: 'me', text: 'Merci Awa ! C\'est gentil. Comment vas-tu ?', time: '12:35' },
  { id: '3', sender: 'other', text: 'Je vais bien, je profite du soleil de Dakar. Et toi ?', time: '12:36' },
];

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-20 bg-card/50 backdrop-blur-lg border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full overflow-hidden border border-primary/30">
              <Image src="https://picsum.photos/seed/dakar1/200/200" alt="Avatar" fill className="object-cover" />
            </div>
            <div>
              <h1 className="font-headline italic text-lg leading-tight">Awa</h1>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-leaf-green" style={{ backgroundColor: '#5DB800' }} />
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">En ligne</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
            <MangoIcon className="h-6 w-6" />
          </button>
          <button className="p-2 text-white/40 hover:text-white rounded-full transition-colors">
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
        <div className="self-center bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">
          C&apos;est mûr ! 🥭
        </div>

        {MOCK_CHAT.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "max-w-[80%] flex flex-col gap-1",
              msg.sender === 'me' ? "self-end items-end" : "self-start items-start"
            )}
          >
            <div 
              className={cn(
                "px-5 py-3 rounded-mango-input text-sm leading-relaxed",
                msg.sender === 'me' 
                  ? "mango-gradient text-white rounded-tr-none" 
                  : "bg-white/10 text-white/90 rounded-tl-none"
              )}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-white/30 font-medium">{msg.time}</span>
          </div>
        ))}

        <div className="flex items-center gap-2 self-start bg-white/5 px-4 py-2 rounded-full">
          <div className="flex gap-1">
            <div className="h-1 w-1 bg-white/40 rounded-full animate-bounce" />
            <div className="h-1 w-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="h-1 w-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </main>

      {/* Input */}
      <footer className="p-6 pb-10 bg-background shrink-0">
        <div className="bg-white/5 border border-white/10 rounded-mango-btn p-1.5 flex items-center gap-2">
          <button className="p-2 text-white/40 hover:text-primary transition-colors">
            <Smile className="h-6 w-6" />
          </button>
          <input 
            type="text" 
            placeholder="Écris ton Jus..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex items-center gap-1">
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <ImageIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <Music className="h-5 w-5" />
            </button>
            <button 
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-full transition-all",
                message.length > 0 ? "mango-gradient text-white scale-100" : "bg-white/5 text-white/20 scale-90"
              )}
              disabled={message.length === 0}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

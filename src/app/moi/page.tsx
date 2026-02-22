
import { BottomNav } from '@/components/bottom-nav';
import { MangoIcon } from '@/components/mango-icons';
import { Settings, Edit2, ShieldCheck, Camera } from 'lucide-react';
import Image from 'next/image';

export default function MoiPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-background/50 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <MangoIcon className="h-8 w-8" />
          <h1 className="text-2xl font-headline italic text-primary">Moi</h1>
        </div>
        <button className="p-2 bg-white/5 rounded-full border border-white/10 text-white/60">
          <Settings className="h-5 w-5" />
        </button>
      </header>

      <main className="px-6 py-8 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="h-40 w-40 rounded-full border-4 border-primary/20 p-2">
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <Image src="https://picsum.photos/seed/me/400/400" alt="Profile" fill className="object-cover" />
            </div>
          </div>
          <button className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-3 rounded-full shadow-lg border-4 border-background hover:scale-105 transition-transform">
            <Camera className="h-5 w-5" />
          </button>
          <div className="absolute top-1 right-1 bg-leaf-green p-1.5 rounded-full border-4 border-background shadow-lg" style={{ backgroundColor: '#5DB800' }}>
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-headline italic mb-1">Amadou, 29</h2>
          <p className="text-white/40 font-medium">Dakar, Sénégal 🇸🇳</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <button className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-mango-card border border-white/10 group">
            <div className="p-3 rounded-full bg-white/5 mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <Edit2 className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-white/60">Modifier</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-mango-card border border-white/10 group">
            <div className="p-3 rounded-full bg-white/5 mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <MangoIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-white/60">Boost</span>
          </button>
        </div>

        <div className="mt-12 w-full p-6 bg-primary/5 rounded-mango-card border border-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-headline italic text-primary mb-2">Passez au mode Mûr Premium</h3>
            <p className="text-white/60 text-sm mb-4 leading-relaxed">Voyez qui vous a liké et profitez des likes illimités.</p>
            <button className="w-full py-3 mango-gradient rounded-mango-btn text-sm font-bold uppercase tracking-widest">
              Devenir Premium
            </button>
          </div>
          <MangoIcon className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 rotate-12" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

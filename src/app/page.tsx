
import Link from 'next/link';
import { MangoIcon, SenegalFlag } from '@/components/mango-icons';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
      
      <div className="z-10 flex flex-col items-center text-center px-6">
        <div className="relative mb-8">
          <MangoIcon className="h-32 w-32 animate-float" />
          <div className="absolute -top-2 -right-2 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
            <SenegalFlag className="h-6 w-9 rounded-sm" />
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-headline italic mb-4 text-white">
          MANGO
        </h1>
        
        <p className="text-xl md:text-2xl font-body text-white/80 max-w-xs md:max-w-md leading-relaxed mb-12">
          Rencontres authentiques au cœur de l&apos;Afrique 🌍
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button asChild size="lg" className="rounded-mango-btn h-14 text-lg font-bold mango-gradient hover:opacity-90 transition-opacity">
            <Link href="/auth">Commencer gratuitement</Link>
          </Button>
          
          <Button variant="ghost" asChild size="lg" className="rounded-mango-btn h-14 text-lg font-medium text-white/70 hover:text-white hover:bg-white/5">
            <Link href="/auth">J&apos;ai déjà un compte</Link>
          </Button>
        </div>

        <div className="mt-16 flex items-center gap-2 text-white/40 text-sm">
          <Globe className="h-4 w-4" />
          <span>Sénégal Edition 🇸🇳</span>
        </div>
      </div>
    </main>
  );
}

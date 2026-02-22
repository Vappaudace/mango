
import { BottomNav } from '@/components/bottom-nav';
import { DiscoveryFeed } from '@/components/discovery-feed';
import { MangoIcon } from '@/components/mango-icons';
import { Settings2 } from 'lucide-react';

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <MangoIcon className="h-8 w-8" />
          <h1 className="text-2xl font-headline italic text-primary">Découvrir</h1>
        </div>
        <button className="p-2 bg-white/5 rounded-full border border-white/10 text-white/60 hover:text-white transition-colors">
          <Settings2 className="h-5 w-5" />
        </button>
      </header>

      <main className="px-4 max-w-md mx-auto">
        <DiscoveryFeed />
      </main>

      <BottomNav />
    </div>
  );
}

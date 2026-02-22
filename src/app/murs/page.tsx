
import { BottomNav } from '@/components/bottom-nav';
import { MangoIcon } from '@/components/mango-icons';
import Image from 'next/image';
import Link from 'next/link';

const MOCK_MURS = [
  { id: '1', name: 'Awa', photo: 'https://picsum.photos/seed/dakar1/200/200', new: true },
  { id: '2', name: 'Fatou', photo: 'https://picsum.photos/seed/nature1/200/200', new: false },
  { id: '4', name: 'Yasmine', photo: 'https://picsum.photos/seed/city1/200/200', new: false },
];

export default function MursPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-8 pb-4 flex items-center gap-2 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <MangoIcon className="h-8 w-8" />
        <h1 className="text-2xl font-headline italic text-primary">Mûrs</h1>
      </header>

      <main className="px-6 py-6">
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Nouveaux Matchs</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {MOCK_MURS.filter(m => m.new).map(mur => (
              <Link key={mur.id} href={`/jus/${mur.id}`} className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative h-20 w-20 rounded-full p-1 border-2 border-primary">
                  <div className="relative h-full w-full rounded-full overflow-hidden">
                    <Image src={mur.photo} alt={mur.name} fill className="object-cover" />
                  </div>
                </div>
                <span className="text-sm font-medium">{mur.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Tous les Mûrs</h2>
          <div className="grid grid-cols-3 gap-4">
            {MOCK_MURS.map(mur => (
              <Link key={mur.id} href={`/jus/${mur.id}`} className="flex flex-col items-center gap-2">
                <div className="relative w-full aspect-square rounded-mango-card overflow-hidden">
                  <Image src={mur.photo} alt={mur.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-xs font-bold">{mur.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

import { BottomNav } from '@/components/bottom-nav';
import { DiscoveryFeed } from '@/components/discovery-feed';

export default function DiscoverPage() {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: '100dvh', background: '#0D0D0D' }}
    >
      {/* Header */}
      <header
        className="px-6 flex items-center justify-between shrink-0"
        style={{ paddingTop: 58, paddingBottom: 12 }}
      >
        <h1
          className="font-headline font-black text-white"
          style={{ fontSize: 28, letterSpacing: -0.5 }}
        >
          Décou<em className="italic" style={{ color: '#FFB300' }}>vrir</em>
        </h1>
        <button
          className="flex items-center justify-center"
          style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-4 pb-24 min-h-0">
        <DiscoveryFeed />
      </main>

      <BottomNav />
    </div>
  );
}

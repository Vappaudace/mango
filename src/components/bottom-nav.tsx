"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MangoIcon } from './mango-icons';

const NAV_ITEMS = [
  {
    href: '/discover',
    label: 'Découvrir',
    icon: ({ active }: { active: boolean }) => (
      <MangoIcon className={`w-6 h-6 transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`} />
    ),
  },
  {
    href: '/murs',
    label: 'Likes',
    icon: ({ active }: { active: boolean }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#FFB300' : 'none'} stroke={active ? '#FFB300' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 1 }}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    href: '/jus',
    label: 'Messages',
    icon: ({ active }: { active: boolean }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFB300' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/moi',
    label: 'Moi',
    icon: ({ active }: { active: boolean }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFB300' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center"
      style={{
        padding: '12px 28px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(13,13,13,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1"
            style={{ cursor: 'pointer' }}
          >
            <Icon active={isActive} />
            <span
              className="font-bold uppercase"
              style={{
                fontSize: 9,
                letterSpacing: '0.5px',
                color: isActive ? '#FFB300' : 'rgba(255,255,255,0.3)',
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

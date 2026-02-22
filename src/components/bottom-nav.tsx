
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MangoIcon } from './mango-icons';
import { Flame, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Découvrir', href: '/discover', icon: MangoIcon, mango: true },
    { name: 'Mûrs', href: '/murs', icon: Flame },
    { name: 'Jus', href: '/jus', icon: MessageCircle },
    { name: 'Moi', href: '/moi', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-white/10 px-6 py-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && item.mango && "animate-pulse")} />
              <span className="text-[10px] font-medium uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

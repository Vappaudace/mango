"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

/**
 * Redirect to /auth if not logged in.
 * Redirect to /auth/setup if logged in but no Firestore profile yet.
 */
export function useRequireAuth() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth');
      return;
    }
    if (!profile) {
      router.replace('/auth/setup');
    }
  }, [user, profile, loading, router]);

  return { user, profile, loading, refreshProfile };
}

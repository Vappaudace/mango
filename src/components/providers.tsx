"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Load AuthProvider client-only — Firebase Auth cannot run on the server
const AuthProvider = dynamic(
  () => import('@/context/auth-context').then(m => ({ default: m.AuthProvider })),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from 'sonner';

export function RootClientProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

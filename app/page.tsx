'use client';

import { RoleSelector } from '@/components/auth/RoleSelector';
import { useApp } from '@/context/AppContext';
import { redirect } from 'next/navigation';

export default function Page() {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <div className="w-12 h-12 bg-primary rounded-lg"></div>
          </div>
          <p className="mt-4 text-muted-foreground">Loading Jordanian Construction Company...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    redirect('/dashboard');
  }

  return <RoleSelector />;
}

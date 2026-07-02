'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { BarChart3, CheckSquare, Clock, DollarSign, FileText, FolderOpen, LayoutDashboard, Link as LinkIcon, Search, Settings, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageLayout({ children, title, breadcrumbs }: PageLayoutProps) {
  const { currentUser, loading } = useApp();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!currentUser) {
      router.replace('/');
      return;
    }

    setAuthChecked(true);
  }, [currentUser, loading, router]);

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm font-semibold text-slate-500">
        Loading workspace...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm font-semibold text-slate-500">
        Returning to role selection...
      </div>
    );
  }

  const mobileNavItems = [
    { href: '/dashboard', label: 'Dash', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/records', label: 'Records', icon: FileText },
    { href: '/linking', label: 'Links', icon: LinkIcon },
    { href: '/timeline', label: 'Time', icon: Clock },
    { href: '/actions', label: 'Actions', icon: CheckSquare },
    { href: '/programme', label: 'Plan', icon: TrendingUp },
    { href: '/cost-impact', label: 'Cost', icon: DollarSign },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
        <Header title={title} breadcrumbs={breadcrumbs} />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0">{children}</main>
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex overflow-x-auto px-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex min-w-16 flex-col items-center gap-1 py-2 text-[10px] font-semibold text-slate-500 hover:text-slate-950">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

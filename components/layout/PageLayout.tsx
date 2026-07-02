'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { BarChart3, CheckSquare, FileText, FolderOpen, LayoutDashboard, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROLE_ROUTE_PERMISSIONS } from '@/lib/constants';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageLayout({ children, title, breadcrumbs }: PageLayoutProps) {
  const { currentUser, loading } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [routeAllowed, setRouteAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!currentUser) {
      router.replace('/');
      return;
    }

    const allowedRoutes = ROLE_ROUTE_PERMISSIONS[currentUser.role] || [];
    const isAllowed = !pathname || allowedRoutes.some((allowedRoute) => pathname === allowedRoute || pathname.startsWith(`${allowedRoute}/`));

    if (!isAllowed && pathname !== '/') {
      router.replace('/dashboard');
    }

    setRouteAllowed(isAllowed || pathname === '/');
  }, [currentUser, loading, pathname, router]);

  if (loading || routeAllowed === null) {
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

  if (routeAllowed === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm font-semibold text-slate-500">
        Redirecting to dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="grid grid-cols-6">
            {(
              ROLE_ROUTE_PERMISSIONS[currentUser.role] || []
            )
              .filter((href) =>
                ['/dashboard', '/projects', '/records', '/actions', '/search', '/reports'].includes(href),
              )
              .slice(0, 6)
              .map((href) => {
                const item = [
                  { href: '/dashboard', label: 'Dash', icon: LayoutDashboard },
                  { href: '/projects', label: 'Projects', icon: FolderOpen },
                  { href: '/records', label: 'Records', icon: FileText },
                  { href: '/actions', label: 'Actions', icon: CheckSquare },
                  { href: '/search', label: 'Search', icon: Search },
                  { href: '/reports', label: 'Reports', icon: BarChart3 },
                ].find((item) => item.href === href);

                if (!item) return null;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-2 text-[10px] font-semibold text-slate-500 hover:text-slate-950">
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

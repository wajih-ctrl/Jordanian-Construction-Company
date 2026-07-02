'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ROLE_NAV_PATHS } from '@/lib/constants';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  CheckSquare,
  TrendingUp,
  DollarSign,
  Search,
  BarChart3,
  Settings,
  LogOut,
  Link as LinkIcon,
  Clock,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/records', label: 'Records', icon: FileText },
    { path: '/linking', label: 'Cross-Linking', icon: LinkIcon },
    { path: '/timeline', label: 'Timeline', icon: Clock },
    { path: '/actions', label: 'Actions', icon: CheckSquare },
    { path: '/programme', label: 'Programme Impact', icon: TrendingUp },
    { path: '/cost-impact', label: 'Cost/Claim', icon: DollarSign },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  const visibleNavItems = currentUser
    ? navItems.filter((item) => ROLE_NAV_PATHS[currentUser.role].includes(item.path))
    : navItems;

  return (
    <aside className={`hidden md:flex ${collapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 h-screen flex-col shadow-sm transition-all duration-200`}>
      {/* Branded Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-200 bg-white">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-9 h-9 bg-slate-950 rounded-lg flex items-center justify-center font-bold text-white text-sm">JC</div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="max-w-[11rem] text-sm font-semibold leading-snug text-foreground break-words">Jordanian Construction Company</h1>
              <p className="mt-1 text-[11px] text-slate-500 font-medium leading-tight">Project Records & Decision Support</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="grid place-items-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg animation-subtle ${
                  active
                    ? 'bg-slate-950 text-white shadow-sm border border-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 border border-transparent'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-slate-200 space-y-3 bg-white ${collapsed ? 'items-center text-center' : ''}`}>
        {currentUser && !collapsed && (
          <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold text-slate-950">{currentUser.name}</p>
            <p className="text-xs text-slate-500 font-semibold">{currentUser.role}</p>
          </div>
        )}

        <button
          onClick={() => {
            logout();
            router.replace('/');
          }}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-700 animation-subtle border border-slate-200`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm font-medium">Exit</span>}
        </button>
      </div>
    </aside>
  );
}

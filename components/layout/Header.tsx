'use client';

import { useApp } from '@/context/AppContext';
import { ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  const { selectedProject, setSelectedProject, projects } = useApp();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  return (
    <header className="bg-white/92 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 truncate">{title}</h2>
        </div>

        {/* Project Selector */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Link href="/search" className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 hover:bg-white hover:text-slate-900">
            <Search className="w-4 h-4" />
            Global search
          </Link>
          <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-sm font-semibold transition-colors shadow-sm"
          >
            <span className="truncate max-w-[calc(100vw-4rem)] sm:max-w-xs">{selectedProject?.name || 'Select Project'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
              <div className="p-2 max-h-64 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedProject?.id === project.id
                        ? 'bg-slate-950 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className={`text-xs ${selectedProject?.id === project.id ? 'text-slate-200' : 'text-slate-500'}`}>{project.location}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-slate-700 hover:text-slate-950 hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

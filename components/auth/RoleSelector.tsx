'use client';

import { useApp } from '@/context/AppContext';
import { USER_ROLES } from '@/lib/constants';
import { useState } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

export function RoleSelector() {
  const { users, setCurrentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (role: string) => {
    setLoading(true);
    setTimeout(() => {
      const user = users.find((u) => u.role === role);
      if (user) {
        setCurrentUser(user);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 items-stretch">
          <section className="rounded-2xl bg-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[420px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white text-slate-950 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold text-white">Jordanian Construction Company</h1>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">Construction records and decision support for FIDIC-style projects.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/10 border border-white/10 p-4">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-slate-300">Mock records</p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-4">
                <p className="text-2xl font-bold text-white">6</p>
                <p className="text-slate-300">Role journeys</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-7">
              <p className="text-sm font-bold text-sky-700 uppercase tracking-wide">Clickable prototype</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Select a role to enter the workspace</h2>
              <p className="mt-2 text-sm text-slate-500">All data is mocked. Each role opens the same presentation-ready system with different user context.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {USER_ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleSelectRole(role.value)}
                  disabled={loading}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    selectedRole === role.value
                      ? 'border-slate-950 bg-slate-50'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-950 mb-1">{role.label}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{role.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 mt-1" />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-950">Demo Mode:</span> mocked data only, no backend, uploads, email, AI, or legal advice.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

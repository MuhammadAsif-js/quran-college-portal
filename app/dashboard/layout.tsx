'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Copy, Check, BookOpen } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode]               = useState<string>('');
  const [error, setError]                     = useState<string>('');
  const [isChecking, setIsChecking]           = useState<boolean>(true);
  const [copied, setCopied]                   = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('teacher_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const correctPasscode = process.env.NEXT_PUBLIC_TEACHER_PASSCODE;
    if (passcode === correctPasscode) {
      sessionStorage.setItem('teacher_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = (): void => {
    sessionStorage.removeItem('teacher_authenticated');
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleCopyLink = (): void => {
    const origin =
      typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    navigator.clipboard.writeText(`${origin}/apply`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  /* ── Auth Gate ── */
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(160deg, #0a2a22, #0F3E33)' }}
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center space-y-6 border border-gray-100">
          <div
            className="mx-auto rounded-full w-20 h-20 flex items-center justify-center"
            style={{ background: 'rgba(15,62,51,0.08)', color: '#0F3E33' }}
          >
            <Lock size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Teacher Portal
            </h2>
            <p className="text-gray-500 text-sm mt-2">Enter your passcode to access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              id="teacher-passcode"
              value={passcode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPasscode(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-emerald-500 transition-colors bg-gray-50 text-gray-900 text-center text-lg tracking-widest focus:outline-none"
              placeholder="••••••"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              id="teacher-unlock-btn"
              className="w-full text-white rounded-xl px-4 py-3.5 font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ background: '#0F3E33' }}
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Authenticated Layout ── */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center py-3 min-h-[4rem]">
            <div className="flex flex-wrap items-center w-full lg:w-auto overflow-x-auto no-scrollbar gap-y-2">

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center mr-6">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mr-2"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)' }}
                >
                  <BookOpen className="text-white" size={14} />
                </div>
                <span className="text-xl font-bold" style={{ color: '#0F3E33' }}>
                  Quran College
                </span>
              </div>

              {/* Nav */}
              <nav className="flex space-x-6 mr-6">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    pathname === '/dashboard'
                      ? 'border-emerald-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard (Students)
                </Link>
                <Link
                  href="/dashboard/attendance"
                  className={`inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    pathname === '/dashboard/attendance'
                      ? 'border-emerald-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Attendance
                </Link>
              </nav>

              {/* Actions */}
              <div className="flex items-center space-x-3 ml-auto lg:ml-0 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center text-sm font-bold text-white px-3 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                  style={{ background: '#16a34a' }}
                >
                  {copied ? (
                    <>
                      <Check size={16} className="mr-1.5" />
                      Copied! ✅
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1.5" />
                      Copy Admission Link
                    </>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Lock size={16} className="mr-1.5" />
                  Lock Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

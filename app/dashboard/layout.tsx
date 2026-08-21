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

  const handleWhatsAppShare = (): void => {
    const origin =
      typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const admissionLink = `${origin}/apply`;
    const message = encodeURIComponent(
      `Assalamu Alaikum! 🌟 Admissions are now open at our Quran Academy. Begin your journey of Ilm & Hidayah here: ${admissionLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
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
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F6EE' }}>
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

              {/* Nav tabs — Gold underline for active */}
              <nav className="flex space-x-1 mr-6">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors rounded-t-sm ${
                    pathname === '/dashboard'
                      ? 'text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  style={
                    pathname === '/dashboard'
                      ? { borderBottomColor: '#D4AF37', color: '#0F3E33' }
                      : {}
                  }
                >
                  Dashboard (Students)
                </Link>
                <Link
                  href="/dashboard/attendance"
                  className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors rounded-t-sm ${
                    pathname === '/dashboard/attendance'
                      ? 'text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  style={
                    pathname === '/dashboard/attendance'
                      ? { borderBottomColor: '#D4AF37', color: '#0F3E33' }
                      : {}
                  }
                >
                  Attendance
                </Link>
              </nav>

              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-auto lg:ml-0 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-start flex-wrap">

                {/* Copy Admission Link — solid Gold */}
                <button
                  onClick={handleCopyLink}
                  id="copy-admission-link-btn"
                  className="flex items-center text-sm font-bold px-3 py-2 rounded-lg transition-all shadow-sm whitespace-nowrap active:scale-95"
                  style={{
                    background: copied
                      ? '#16a34a'
                      : 'linear-gradient(135deg, #D4AF37, #b8962e)',
                    color: copied ? '#fff' : '#0F3E33',
                  }}
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

                {/* Share on WhatsApp */}
                <button
                  onClick={handleWhatsAppShare}
                  id="whatsapp-share-btn"
                  className="flex items-center text-sm font-bold text-white px-3 py-2 rounded-lg transition-all shadow-sm whitespace-nowrap active:scale-95"
                  style={{ background: '#25D366' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1.5 shrink-0"
                    width={16}
                    height={16}
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share on WhatsApp
                </button>

                {/* Lock Portal — outline red */}
                <button
                  onClick={handleLogout}
                  id="lock-portal-btn"
                  className="flex items-center text-sm font-bold text-red-600 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
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

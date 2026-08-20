"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Copy, Check } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check session storage on mount
    const authStatus = sessionStorage.getItem('teacher_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e) => {
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

  const handleLogout = () => {
    sessionStorage.removeItem('teacher_authenticated');
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    navigator.clipboard.writeText(`${origin}/apply`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isChecking) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center space-y-6 border border-gray-100">
          <div className="mx-auto bg-blue-50 text-blue-500 rounded-full w-20 h-20 flex items-center justify-center">
            <Lock size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Teacher Portal</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your passcode to access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 text-center text-lg tracking-widest"
                placeholder="••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-xl px-4 py-3.5 font-bold hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center py-3 min-h-[4rem]">
            <div className="flex flex-wrap items-center w-full lg:w-auto overflow-x-auto no-scrollbar gap-y-2">
              <div className="flex-shrink-0 flex items-center mr-6">
                <span className="text-xl font-bold text-blue-900">Quran College</span>
              </div>
              
              <nav className="flex space-x-6 mr-6">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
                    pathname === '/dashboard'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard (Students)
                </Link>
                <Link
                  href="/dashboard/attendance"
                  className={`inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
                    pathname === '/dashboard/attendance'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Attendance
                </Link>
              </nav>

              {/* Action Buttons Group for Mobile Layout wrapping */}
              <div className="flex items-center space-x-3 ml-auto lg:ml-0 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center text-sm font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

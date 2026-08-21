'use client';

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import type { CheckInStatus } from '@/types';
import { CheckCircle, AlertTriangle, Loader2, ArrowLeft, BookOpen, Lock } from 'lucide-react';

// ─── localStorage key helpers ──────────────────────────────────────────────
const getTodayKey = (): string => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `checkInComplete_${today}`;
};

const markDeviceCheckedIn = (): void => {
  try {
    localStorage.setItem(getTodayKey(), 'true');
  } catch {
    // localStorage may be unavailable in private browsing — fail silently
  }
};

const isDeviceAlreadyCheckedIn = (): boolean => {
  try {
    return localStorage.getItem(getTodayKey()) === 'true';
  } catch {
    return false;
  }
};

// ─── Inline toast component ─────────────────────────────────────────────────
interface ToastProps {
  message: string;
  onDismiss: () => void;
}

function ErrorToast({ message, onDismiss }: ToastProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 px-5 py-4 rounded-2xl border"
      style={{ background: '#fff5f5', borderColor: '#fed7d7', color: '#c53030' }}
    >
      <AlertTriangle className="mt-0.5 shrink-0" size={20} />
      <p className="flex-1 text-base font-semibold leading-snug">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="shrink-0 text-red-400 hover:text-red-600 transition-colors text-xl leading-none font-bold"
      >
        ×
      </button>
    </div>
  );
}

// ─── Shared decorative background orbs ─────────────────────────────────────
function BgOrbs() {
  return (
    <>
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1a5c4a, transparent 70%)' }}
      />
    </>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function ZoomCheckIn() {
  const [phone, setPhone]               = useState<string>('');
  const [pin, setPin]                   = useState<string>('');
  const [status, setStatus]             = useState<CheckInStatus>('idle');
  const [message, setMessage]           = useState<string>('');
  const [studentName, setStudentName]   = useState<string>('');
  const [toastMsg, setToastMsg]         = useState<string>('');
  const [deviceLocked, setDeviceLocked] = useState<boolean>(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  // ── Device lockout check on mount ──────────────────────────────────────
  useEffect(() => {
    if (isDeviceAlreadyCheckedIn()) {
      setDeviceLocked(true);
    }
  }, []);

  // ── Auto-focus phone field when form is shown ───────────────────────────
  useEffect(() => {
    if (!deviceLocked && status === 'idle') {
      phoneRef.current?.focus();
    }
  }, [deviceLocked, status]);

  const showToast = (msg: string): void => setToastMsg(msg);
  const clearToast = (): void => setToastMsg('');

  const handleCheckIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    clearToast();

    const trimmedPhone = phone.trim();
    const trimmedPin   = pin.trim();

    if (!trimmedPhone || !trimmedPin) return;

    // ── Frontend PIN validation ─────────────────────────────────────────
    const digitsOnly  = trimmedPhone.replace(/\D/g, '');
    const expectedPin = digitsOnly.slice(-4);

    if (trimmedPin !== expectedPin) {
      showToast(
        'Incorrect PIN. Your PIN must match the last 4 digits of your registered phone number.'
      );
      return;
    }

    setStatus('loading');

    try {
      // 1. Find student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, name, payment_status')
        .eq('phone', trimmedPhone)
        .single();

      if (studentError || !student) {
        setStatus('error');
        setMessage("We couldn't find a student with that phone number.");
        return;
      }

      const typedStudent = student as { id: string; name: string; payment_status: string | null };
      setStudentName(typedStudent.name);

      // 2. Check payment status
      if (typedStudent.payment_status !== 'Confirmed') {
        setStatus('blocked');
        setMessage(
          'Your admission is currently pending payment verification. Please contact management.'
        );
        return;
      }

      // 3. Mark present — upsert for today
      const today = new Date().toISOString().split('T')[0];

      const { error: attendanceError } = await supabase.from('attendance').upsert(
        {
          student_id: typedStudent.id,
          date: today,
          status: 'Present',
        },
        { onConflict: 'student_id, date' }
      );

      if (attendanceError) {
        // Fallback: plain insert if upsert fails (missing unique constraint)
        const { error: insertError } = await supabase.from('attendance').insert({
          student_id: typedStudent.id,
          date: today,
          status: 'Present',
        });
        if (insertError) throw insertError;
      }

      // 4. Lock this device for the rest of the day
      markDeviceCheckedIn();

      setStatus('success');
    } catch (error: unknown) {
      console.error('Check-in error:', error);
      setStatus('error');
      setMessage('A server error occurred. Please try again.');
    }
  };

  const resetForm = (): void => {
    setStatus('idle');
    setPhone('');
    setPin('');
    setMessage('');
    clearToast();
  };

  // ─── DEVICE LOCKED SCREEN ────────────────────────────────────────────────
  if (deviceLocked) {
    return (
      <div
        className="relative min-h-screen flex flex-col justify-center items-center px-4"
        style={{ background: 'linear-gradient(160deg, #0a2a22 0%, #0F3E33 100%)' }}
      >
        <BgOrbs />
        <div
          className="relative z-10 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden"
          style={{ background: '#F9F6EE' }}
        >
          {/* Lock screen header */}
          <div
            className="px-8 pt-10 pb-8 text-center"
            style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
          >
            <div
              className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.18)' }}
            >
              <Lock size={40} style={{ color: '#D4AF37' }} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Device Locked</h1>
          </div>

          {/* Lock screen body */}
          <div className="px-8 py-10 flex flex-col items-center text-center space-y-5">
            <p className="text-xl font-bold leading-relaxed" style={{ color: '#0F3E33' }}>
              🔒 Attendance has already been recorded from this device today.
            </p>
            <p className="text-base text-gray-500 font-medium">You may close this window.</p>
            <div
              className="w-full py-5 px-4 rounded-2xl border-2"
              style={{ borderColor: '#D4AF37', background: 'rgba(212,175,55,0.07)' }}
            >
              <p
                className="text-4xl font-semibold mb-1"
                style={{ color: '#0F3E33', fontFamily: 'serif', direction: 'rtl', lineHeight: 1.7 }}
              >
                جَزَاكَ اللَّهُ خَيْرًا
              </p>
              <p className="text-sm text-gray-500 font-semibold tracking-wide uppercase">
                JazakAllah Khair
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN KIOSK ──────────────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6"
      style={{ background: 'linear-gradient(160deg, #0a2a22 0%, #0F3E33 100%)' }}
    >
      <BgOrbs />

      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden"
        style={{ background: '#F9F6EE' }}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div
          className="px-8 pt-8 pb-7 text-center"
          style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
        >
          <div
            className="mx-auto mb-3 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.2)' }}
          >
            <BookOpen size={28} style={{ color: '#D4AF37' }} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Class Check-In
          </h1>
          <p className="text-white/60 text-sm font-medium">Mark your attendance instantly</p>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="px-8 py-8">

          {/* ── IDLE — form ──────────────────────────────────────────── */}
          {status === 'idle' && (
            <form onSubmit={handleCheckIn} className="space-y-6" noValidate>
              {toastMsg && <ErrorToast message={toastMsg} onDismiss={clearToast} />}

              {/* Phone field */}
              <div className="space-y-2">
                <label htmlFor="checkin-phone" className="block text-base font-bold text-gray-700">
                  Registered Phone Number
                </label>
                <input
                  ref={phoneRef}
                  id="checkin-phone"
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPhone(e.target.value);
                    clearToast();
                  }}
                  className="w-full px-5 py-5 bg-white border-2 border-gray-200 rounded-2xl text-xl text-center font-semibold tracking-wider focus:outline-none transition-colors"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0F3E33')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              {/* PIN field */}
              <div className="space-y-2">
                <label htmlFor="checkin-pin" className="block text-base font-bold text-gray-700">
                  4-Digit PIN
                </label>
                <input
                  id="checkin-pin"
                  type="password"
                  required
                  maxLength={4}
                  inputMode="numeric"
                  pattern="\d{4}"
                  placeholder="••••"
                  value={pin}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPin(val);
                    clearToast();
                  }}
                  className="w-full px-5 py-5 bg-white border-2 border-gray-200 rounded-2xl text-3xl text-center font-bold tracking-[0.5em] focus:outline-none transition-colors"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0F3E33')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
                <p className="text-center text-sm text-gray-400 font-medium">
                  Hint: Your PIN is the last 4 digits of your registered phone number.
                </p>
              </div>

              {/* Gold submit button */}
              <button
                type="submit"
                id="checkin-submit-btn"
                disabled={phone.trim().length < 4 || pin.length !== 4}
                className="w-full font-black text-2xl py-5 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #b8962e)',
                  color: '#0F3E33',
                }}
              >
                Mark Present ✓
              </button>
            </form>
          )}

          {/* ── LOADING ──────────────────────────────────────────────── */}
          {status === 'loading' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-5">
              <Loader2 className="animate-spin" size={64} style={{ color: '#0F3E33' }} />
              <p className="text-xl font-bold text-gray-600">Verifying...</p>
            </div>
          )}

          {/* ── SUCCESS ──────────────────────────────────────────────── */}
          {status === 'success' && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              {/* Check mark */}
              <div
                className="h-28 w-28 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.15)' }}
              >
                <CheckCircle size={64} style={{ color: '#0F3E33' }} />
              </div>

              {/* Arabic blessing */}
              <div
                className="w-full py-5 px-4 rounded-2xl border-2"
                style={{ borderColor: '#D4AF37', background: 'rgba(212,175,55,0.07)' }}
              >
                <p
                  className="text-4xl font-semibold mb-1"
                  style={{
                    color: '#0F3E33',
                    fontFamily: 'serif',
                    direction: 'rtl',
                    lineHeight: 1.7,
                  }}
                >
                  بَارَكَ اللَّهُ فِيكَ
                </p>
                <p className="text-sm text-gray-500 font-semibold tracking-wide uppercase">
                  Barakallahu Feek
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#0F3E33' }}>
                  Attendance Recorded
                </h2>
                <p className="text-base text-gray-500 font-medium">
                  Welcome to class, {studentName}. 📖
                </p>
              </div>

              {/* Device lock notice */}
              <div className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                <Lock size={16} className="text-gray-400 shrink-0" />
                <p className="text-xs text-gray-400 font-medium text-left">
                  This device is now locked for the day to prevent proxy attendance.
                </p>
              </div>
            </div>
          )}

          {/* ── BLOCKED ──────────────────────────────────────────────── */}
          {status === 'blocked' && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                  Verification Pending
                </h2>
                <p className="text-lg text-gray-700 font-medium leading-relaxed bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  {message}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="flex items-center justify-center font-bold text-lg p-4 hover:underline w-full mt-4"
                style={{ color: '#0F3E33' }}
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
              </button>
            </div>
          )}

          {/* ── ERROR ────────────────────────────────────────────────── */}
          {status === 'error' && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Oops!</h2>
                <p className="text-lg text-gray-600">{message}</p>
              </div>
              <button
                onClick={resetForm}
                className="w-full text-white font-bold text-xl py-4 rounded-2xl transition-colors shadow-lg"
                style={{ background: '#0F3E33' }}
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-6 text-white/30 text-xs font-medium text-center">
        Quran College Portal · Attendance Kiosk
      </p>
    </div>
  );
}

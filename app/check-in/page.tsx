'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import type { CheckInStatus } from '@/types';
import { CheckCircle, AlertTriangle, Loader2, ArrowLeft, BookOpen } from 'lucide-react';

export default function ZoomCheckIn() {
  const [phone, setPhone]               = useState<string>('');
  const [status, setStatus]             = useState<CheckInStatus>('idle');
  const [message, setMessage]           = useState<string>('');
  const [studentName, setStudentName]   = useState<string>('');

  const handleCheckIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!phone.trim()) return;

    setStatus('loading');

    try {
      // 1. Find student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, name, payment_status')
        .eq('phone', phone.trim())
        .single();

      if (studentError || !student) {
        setStatus('error');
        setMessage("We couldn't find a student with that WhatsApp number.");
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
    setMessage('');
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6"
      style={{ background: 'linear-gradient(160deg, #0a2a22 0%, #0F3E33 100%)' }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1a5c4a, transparent 70%)' }}
      />

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative z-10">

        {/* Header */}
        <div
          className="p-8 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
        >
          <div className="flex items-center justify-center mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
              style={{ background: 'rgba(212,175,55,0.2)' }}
            >
              <BookOpen style={{ color: '#D4AF37' }} size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Class Check-In</h1>
          <p className="text-white/65 font-medium text-sm">Mark your attendance instantly</p>
        </div>

        <div className="p-8">
          {/* ── IDLE ── */}
          {status === 'idle' && (
            <form onSubmit={handleCheckIn} className="space-y-8 mt-2">
              <div className="space-y-3">
                <label
                  htmlFor="checkin-phone"
                  className="block text-lg font-bold text-gray-800 text-center"
                >
                  Enter your WhatsApp Number
                </label>
                <input
                  id="checkin-phone"
                  type="tel"
                  required
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-emerald-500 transition-colors text-2xl text-center font-semibold tracking-wider focus:outline-none"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                id="checkin-submit-btn"
                className="w-full text-white font-black text-2xl py-5 rounded-2xl transition-all shadow-lg active:scale-95"
                style={{ background: '#0F3E33' }}
              >
                Mark Present
              </button>
            </form>
          )}

          {/* ── LOADING ── */}
          {status === 'loading' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin" style={{ color: '#0F3E33' }} />
              <p className="text-xl font-bold text-gray-600">Verifying...</p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {status === 'success' && (
            <div className="py-10 flex flex-col items-center text-center space-y-6">
              <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="h-20 w-20 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                  You&apos;re Checked In!
                </h2>
                <p className="text-lg text-gray-600">
                  JazakAllah Khair, {studentName}. Have a great class. 📖
                </p>
              </div>
              <button
                onClick={resetForm}
                className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors w-full"
              >
                Check in another student
              </button>
            </div>
          )}

          {/* ── BLOCKED ── */}
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

          {/* ── ERROR ── */}
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
    </div>
  );
}

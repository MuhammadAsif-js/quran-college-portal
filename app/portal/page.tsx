'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import type { Student, AttendanceRecord } from '@/types';
import { LogOut, CalendarCheck, Loader2, AlertCircle } from 'lucide-react';

/* ── Component ────────────────────────────────────────────────── */

export default function StudentPortal() {
  const [studentId, setStudentId]           = useState<string | null>(null);
  const [loading, setLoading]               = useState<boolean>(true);
  const [studentData, setStudentData]       = useState<Student | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  // Login state
  const [phone, setPhone]           = useState<string>('');
  const [dob, setDob]               = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem('student_id');
    if (storedId) {
      setStudentId(storedId);
      fetchDashboardData(storedId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (studentError) throw studentError;
      setStudentData(student as Student);

      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', id)
        .order('date', { ascending: false });

      if (attendanceError && attendanceError.code !== 'PGRST116') {
        throw attendanceError;
      }

      setAttendanceData((attendance as AttendanceRecord[]) ?? []);
    } catch (error: unknown) {
      console.error('Error fetching dashboard:', error);
      sessionStorage.removeItem('student_id');
      setStudentId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('phone', phone.trim())
        .eq('date_of_birth', dob.trim())
        .single();

      if (error || !data) {
        setLoginError('Invalid WhatsApp Number or Date of Birth.');
      } else {
        const id = (data as { id: string }).id;
        sessionStorage.setItem('student_id', id);
        setStudentId(id);
        fetchDashboardData(id);
      }
    } catch (err: unknown) {
      console.error(err);
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = (): void => {
    sessionStorage.removeItem('student_id');
    setStudentId(null);
    setStudentData(null);
    setPhone('');
    setDob('');
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f9fa' }}>
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: '#0F3E33' }} />
      </div>
    );
  }

  /* ── LOGIN VIEW ── */
  if (!studentId) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center p-6"
        style={{ background: 'linear-gradient(160deg, #0a2a22, #0F3E33)' }}
      >
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className="px-8 pt-10 pb-8 text-center"
            style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
          >
            <div className="text-2xl font-amiri mb-2" style={{ color: '#D4AF37' }}>
              بِسْمِ اللهِ
            </div>
            <h1 className="text-2xl font-extrabold text-white">Student Portal</h1>
            <p className="text-white/60 text-sm mt-1">Log in to view your dashboard</p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {loginError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start text-sm border border-red-100">
                <AlertCircle className="shrink-0 mr-2 h-5 w-5 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="portal-phone" className="block text-sm font-semibold text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  id="portal-phone"
                  type="text"
                  required
                  placeholder="e.g. +1234567890"
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:border-emerald-500 transition-all text-lg focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="portal-dob" className="block text-sm font-semibold text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="portal-dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDob(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:border-emerald-500 transition-all text-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                id="portal-login-btn"
                disabled={isLoggingIn}
                className="w-full text-white font-bold text-xl py-4 rounded-2xl transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center"
                style={{ background: '#0F3E33' }}
              >
                {isLoggingIn ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  'Access Portal'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ── DASHBOARD VIEW ── */
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div
        className="text-white pt-12 pb-6 px-6"
        style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
      >
        <div className="max-w-2xl mx-auto flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Assalamu Alaikum,</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {studentData?.name}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-8 space-y-8">
        {/* Status Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Enrolled Course</p>
            <p className="text-lg font-bold text-gray-900">{studentData?.course}</p>
          </div>
          <div className="flex flex-col sm:items-end">
            <p className="text-sm text-gray-500 font-medium mb-1">Payment Status</p>
            <span
              className={`px-4 py-2 inline-flex text-sm font-bold rounded-full ${
                studentData?.payment_status === 'Confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {studentData?.payment_status ?? 'Pending'}
            </span>
          </div>
        </div>

        {/* Attendance */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CalendarCheck className="mr-2" size={24} style={{ color: '#0F3E33' }} />
            My Attendance
          </h3>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            {attendanceData.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <p>No attendance records found yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {attendanceData.map((record) => (
                  <div key={record.id} className="p-5 flex justify-between items-center">
                    <p className="font-semibold text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        record.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

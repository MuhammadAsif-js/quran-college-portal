'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { AttendanceRecord, AttendanceMap } from '@/types';
import {
  Calendar,
  UserCheck,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  MonitorSmartphone,
  PenLine,
} from 'lucide-react';

type AttendanceStatus = 'Present' | 'Absent';

/** Minimal student shape needed for the attendance grid */
interface AttendanceStudent {
  id: string;
  name: string;
  course: string;
}

export default function AttendancePage() {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split('T')[0];
  });

  const [students, setStudents]     = useState<AttendanceStudent[]>([]);
  const [attendances, setAttendances] = useState<AttendanceMap>({});
  const [loading, setLoading]       = useState<boolean>(false);
  const [error, setError]           = useState<string | null>(null);

  // Track which studentIds already had a record when the page loaded (= kiosk check-in)
  const kioskCheckedIn = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (date) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 1. ALL students — no teacher filter
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, name, course');

      if (studentsError) throw studentsError;

      // 2. Attendance for this date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date);

      if (attendanceError) throw attendanceError;

      // Build map
      const attendanceMap: AttendanceMap = {};
      const selfCheckedInIds = new Set<string>();

      (attendanceData as AttendanceRecord[]).forEach((record) => {
        attendanceMap[record.student_id] = record;
        if (record.id) selfCheckedInIds.add(record.student_id);
      });

      kioskCheckedIn.current = selfCheckedInIds;

      const sorted = ((studentsData as AttendanceStudent[]) ?? []).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setStudents(sorted);
      setAttendances(attendanceMap);
    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      setError(
        'Failed to load data. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (
    studentId: string,
    status: AttendanceStatus
  ): Promise<void> => {
    const previousAttendances = { ...attendances };
    const existingRecord = attendances[studentId];

    // Optimistic update
    setAttendances((prev) => ({
      ...prev,
      [studentId]: {
        ...(existingRecord ?? { id: '', student_id: studentId, date }),
        status,
      } as AttendanceRecord,
    }));

    try {
      if (existingRecord?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('attendance')
          .update({ status })
          .eq('id', existingRecord.id);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { data, error: insertError } = await supabase
          .from('attendance')
          .insert([{ student_id: studentId, date, status }])
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setAttendances((prev) => ({
            ...prev,
            [studentId]: data as AttendanceRecord,
          }));
        }
      }
    } catch (err: unknown) {
      console.error('Error saving attendance:', err);
      setAttendances(previousAttendances);
      alert('Failed to save attendance. Please try again.');
    }
  };

  // ── Derived daily stats ──────────────────────────────────────────────────
  const totalStudents = students.length;
  const presentCount  = students.filter((s) => attendances[s.id]?.status === 'Present').length;
  const absentCount   = students.filter((s) => attendances[s.id]?.status === 'Absent').length;
  const unmarkedCount = totalStudents - presentCount - absentCount;

  const todayLabel = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-lg mx-auto sm:max-w-2xl">

      {/* ── Command Center Controls ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm border"
        style={{ borderColor: 'rgba(15,62,51,0.15)' }}
      >
        {/* Header strip */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
        >
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Attendance Command Center
            </h1>
            <p className="text-white/55 text-xs mt-0.5">{todayLabel}</p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.2)' }}
          >
            <UserCheck size={20} style={{ color: '#D4AF37' }} />
          </div>
        </div>

        {/* Date picker only */}
        <div className="bg-white px-6 py-5">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0F3E33' }}>
            Select Date
          </label>
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Calendar size={16} />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors font-medium"
              onFocus={(e) => (e.currentTarget.style.borderColor = '#D4AF37')}
              onBlur={(e)  => (e.currentTarget.style.borderColor = '#e5e7eb')}
            />
          </div>
        </div>
      </div>

      {/* ── Daily Stats Cards ───────────────────────────────────────────────── */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {/* Total */}
          <div
            className="bg-white rounded-2xl px-3 py-4 border shadow-sm flex flex-col items-center text-center"
            style={{ borderColor: 'rgba(15,62,51,0.12)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-2"
              style={{ background: 'rgba(15,62,51,0.08)' }}
            >
              <Users size={18} style={{ color: '#0F3E33' }} />
            </div>
            <p className="text-2xl font-extrabold" style={{ color: '#0F3E33' }}>
              {totalStudents}
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
              Total
            </p>
          </div>

          {/* Present */}
          <div className="bg-white rounded-2xl px-3 py-4 border border-emerald-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2 bg-emerald-50">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">{presentCount}</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
              Present
            </p>
          </div>

          {/* Absent */}
          <div className="bg-white rounded-2xl px-3 py-4 border border-red-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2 bg-red-50">
              <XCircle size={18} className="text-red-500" />
            </div>
            <p className="text-2xl font-extrabold text-red-500">{absentCount}</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
              Absent
            </p>
          </div>

          {/* Unmarked */}
          <div className="bg-white rounded-2xl px-3 py-4 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2 bg-gray-50">
              <UserCheck size={18} className="text-gray-400" />
            </div>
            <p className="text-2xl font-extrabold text-gray-400">{unmarkedCount}</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
              Unmarked
            </p>
          </div>
        </div>
      )}

      {/* ── Tip banner ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border text-sm"
        style={{
          background: 'rgba(212,175,55,0.07)',
          borderColor: 'rgba(212,175,55,0.3)',
          color: '#7a5c00',
        }}
      >
        <span className="text-lg leading-none">💡</span>
        <p className="font-medium mt-0.5">
          <strong>Tip:</strong> Tap Present or Absent to override. Changes are saved automatically.
          Rows marked <span className="inline-flex items-center gap-1 font-bold"><MonitorSmartphone size={12} /> Self Check-In</span> were recorded by the student via kiosk.
        </p>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 font-medium">
          {error}
        </div>
      )}

      {/* ── Student list ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl shadow-sm border border-gray-200">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F3E33' }} />
          <p className="text-base font-medium text-gray-500">Loading students, please wait...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.length > 0 ? (
            students.map((student) => {
              const currentStatus   = attendances[student.id]?.status;
              const wasKioskCheckin = kioskCheckedIn.current.has(student.id);

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border transition-shadow hover:shadow-md"
                  style={{ borderColor: 'rgba(15,62,51,0.10)' }}
                >
                  {/* Student info row */}
                  <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-gray-900 truncate">{student.name}</h3>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{student.course}</p>
                    </div>

                    {/* Kiosk / Override badge */}
                    {currentStatus && (
                      <div className="ml-3 shrink-0">
                        {wasKioskCheckin ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(15,62,51,0.08)', color: '#0F3E33' }}
                          >
                            <MonitorSmartphone size={11} />
                            Self Check-In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                            <PenLine size={11} />
                            Teacher Override
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Toggle buttons */}
                  <div className="flex gap-3 p-3">
                    {/* Present */}
                    <button
                      onClick={() => handleAttendance(student.id, 'Present')}
                      className={`flex-1 flex items-center justify-center py-3.5 px-2 rounded-xl text-sm font-extrabold transition-all focus:outline-none active:scale-95 ${
                        currentStatus === 'Present'
                          ? 'text-white shadow-md'
                          : 'border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white'
                      } ${currentStatus === 'Absent' ? 'opacity-40' : ''}`}
                      style={
                        currentStatus === 'Present'
                          ? { background: '#0F3E33' }
                          : {}
                      }
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Present
                    </button>

                    {/* Absent */}
                    <button
                      onClick={() => handleAttendance(student.id, 'Absent')}
                      className={`flex-1 flex items-center justify-center py-3.5 px-2 rounded-xl text-sm font-extrabold transition-all focus:outline-none active:scale-95 ${
                        currentStatus === 'Absent'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'border-2 border-red-200 text-red-600 hover:bg-red-50 bg-white'
                      } ${currentStatus === 'Present' ? 'opacity-40' : ''}`}
                    >
                      <XCircle size={18} className="mr-2" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-14 flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl shadow-sm border border-gray-200">
              <UserCheck className="h-10 w-10 text-gray-300" />
              <p className="text-base font-medium text-gray-400">
                No students found. Make sure students have applied via the admission form.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

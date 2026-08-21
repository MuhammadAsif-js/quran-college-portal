'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Student, AttendanceRecord, AttendanceMap } from '@/types';
import { Calendar, UserCheck, CheckCircle, XCircle, Loader2 } from 'lucide-react';

type AttendanceStatus = 'Present' | 'Absent';

/** Minimal student shape needed for the attendance grid */
interface AttendanceStudent {
  id: string;
  name: string;
  course: string;
  assigned_teacher: string;
}

export default function AttendancePage() {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split('T')[0];
  });

  const [selectedTeacher, setSelectedTeacher] = useState<string>('Teacher 1');
  const [students, setStudents]               = useState<AttendanceStudent[]>([]);
  const [attendances, setAttendances]         = useState<AttendanceMap>({});
  const [loading, setLoading]                 = useState<boolean>(false);
  const [error, setError]                     = useState<string | null>(null);

  useEffect(() => {
    if (selectedTeacher && date) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeacher, date]);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 1. Students for this teacher
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, name, course, assigned_teacher')
        .eq('assigned_teacher', selectedTeacher);

      if (studentsError) throw studentsError;

      // 2. Attendance for this date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date);

      if (attendanceError) throw attendanceError;

      // Build map
      const attendanceMap: AttendanceMap = {};
      (attendanceData as AttendanceRecord[]).forEach((record) => {
        attendanceMap[record.student_id] = record;
      });

      const sorted = ((studentsData as AttendanceStudent[]) ?? []).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setStudents(sorted);
      setAttendances(attendanceMap);
    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      setError(
        'Failed to load data. Please check connection and ensure the "attendance" table exists with student_id, date, and status columns.'
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

  return (
    <div className="space-y-6 max-w-lg mx-auto sm:max-w-2xl">
      {/* Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Daily Attendance</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Teacher selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Teacher
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <UserCheck size={18} />
              </div>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white focus:outline-none"
              >
                <option value="Teacher 1">Teacher 1</option>
                <option value="Teacher 2">Teacher 2</option>
                <option value="Teacher 3">Teacher 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm flex items-start shadow-sm">
        <span className="text-xl mr-3 leading-none">💡</span>
        <p className="font-medium mt-0.5">
          <strong>Tip:</strong> Just tap Present or Absent. The system saves your changes
          automatically in the background!
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Student list */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-200">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-lg font-medium">Loading data, please wait...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {students.length > 0 ? (
            students.map((student) => {
              const currentStatus = attendances[student.id]?.status;

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-5 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{student.name}</h3>
                    <p className="text-sm text-gray-500 truncate mt-1">{student.course}</p>
                  </div>
                  <div className="flex p-3 gap-3 bg-gray-50">
                    {/* Present */}
                    <button
                      onClick={() => handleAttendance(student.id, 'Present')}
                      className={`flex-1 flex items-center justify-center py-4 px-2 rounded-xl text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-95 ${
                        currentStatus === 'Present'
                          ? 'bg-green-500 text-white shadow-md border border-green-600'
                          : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
                      } ${currentStatus === 'Absent' ? 'opacity-40 grayscale-[50%]' : ''}`}
                    >
                      <CheckCircle size={24} className="mr-2" />
                      Present
                    </button>

                    {/* Absent */}
                    <button
                      onClick={() => handleAttendance(student.id, 'Absent')}
                      className={`flex-1 flex items-center justify-center py-4 px-2 rounded-xl text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:scale-95 ${
                        currentStatus === 'Absent'
                          ? 'bg-red-500 text-white shadow-md border border-red-600'
                          : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
                      } ${currentStatus === 'Present' ? 'opacity-40 grayscale-[50%]' : ''}`}
                    >
                      <XCircle size={24} className="mr-2" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl shadow-sm border border-gray-200 text-gray-500">
              <UserCheck className="h-10 w-10 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                No students found for this teacher yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

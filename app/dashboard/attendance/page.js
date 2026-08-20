"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, UserCheck, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AttendancePage() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    // Use local time instead of UTC to avoid timezone issues when selecting "today"
    const offset = today.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(today - offset)).toISOString().split('T')[0];
    return localISOTime;
  });
  
  // Default to Teacher 1 to immediately load some students (or empty)
  const [selectedTeacher, setSelectedTeacher] = useState('Teacher 1');
  
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState({}); // Map of student_id -> attendance record { id, status }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedTeacher && date) {
      fetchData();
    }
  }, [selectedTeacher, date]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch students for the teacher
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, name, course, assigned_teacher')
        .eq('assigned_teacher', selectedTeacher);
        
      if (studentsError) throw studentsError;
      
      // 2. Fetch attendance for this date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date);
        
      if (attendanceError) throw attendanceError;
      
      // Map attendance data
      const attendanceMap = {};
      attendanceData.forEach(record => {
        attendanceMap[record.student_id] = record;
      });
      
      // Sort students by name alphabetically for easier navigation
      const sortedStudents = (studentsData || []).sort((a, b) => a.name.localeCompare(b.name));
      
      setStudents(sortedStudents);
      setAttendances(attendanceMap);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check connection and ensure the "attendance" table exists with student_id, date, and status columns.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (studentId, status) => {
    // Optimistic UI update
    const previousAttendances = { ...attendances };
    const existingRecord = attendances[studentId];
    
    // Update local state immediately for snappy feedback
    setAttendances(prev => ({
      ...prev,
      [studentId]: { ...existingRecord, student_id: studentId, date, status }
    }));
    
    try {
      if (existingRecord && existingRecord.id) {
        // Update existing record
        const { error } = await supabase
          .from('attendance')
          .update({ status })
          .eq('id', existingRecord.id);
          
        if (error) throw error;
      } else {
        // Since we might not have a unique constraint setup for upsert, 
        // we use insert and fetch the generated id.
        const { data, error } = await supabase
          .from('attendance')
          .insert([{ student_id: studentId, date, status }])
          .select()
          .single();
          
        if (error) throw error;
        
        // Update local state with the new database ID for future updates
        if (data) {
          setAttendances(prev => ({
            ...prev,
            [studentId]: data
          }));
        }
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      // Revert on failure
      setAttendances(previousAttendances);
      alert('Failed to save attendance. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto sm:max-w-2xl">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Daily Attendance</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Teacher</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <UserCheck size={18} />
              </div>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="Teacher 1">Teacher 1</option>
                <option value="Teacher 2">Teacher 2</option>
                <option value="Teacher 3">Teacher 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm flex items-start shadow-sm">
        <span className="text-xl mr-3 leading-none">💡</span>
        <p className="font-medium mt-0.5"><strong>Tip:</strong> Just tap Present or Absent. The system saves your changes automatically in the background!</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-200">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-lg font-medium">Loading data, please wait...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {students.length > 0 ? (
            students.map(student => {
              const currentStatus = attendances[student.id]?.status;
              
              return (
                <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transform transition-all">
                  <div className="p-4 sm:p-5 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{student.name}</h3>
                    <p className="text-sm text-gray-500 truncate mt-1">{student.course}</p>
                  </div>
                  <div className="flex p-3 gap-3 bg-gray-50">
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
              <p className="text-lg font-medium text-gray-600">No students found for this teacher yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

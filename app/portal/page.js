"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, CalendarCheck, Loader2, AlertCircle } from 'lucide-react';

export default function StudentPortal() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  // Login State
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check session on mount
    const storedId = sessionStorage.getItem('student_id');
    if (storedId) {
      setStudentId(storedId);
      fetchDashboardData(storedId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (id) => {
    setLoading(true);
    try {
      // Fetch student info
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (studentError) throw studentError;
      setStudentData(student);

      // Fetch attendance
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', id)
        .order('date', { ascending: false });

      if (attendanceError && attendanceError.code !== 'PGRST116') {
        // Ignore "not found" if table is empty, throw otherwise
        throw attendanceError;
      }
      
      setAttendanceData(attendance || []);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      // If error (like deleted student), clear session
      sessionStorage.removeItem('student_id');
      setStudentId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      // In a real app, you might want to normalize the phone/dob formats before comparing
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('phone', phone.trim())
        .eq('date_of_birth', dob.trim())
        .single();

      if (error || !data) {
        setLoginError('Invalid WhatsApp Number or Date of Birth.');
      } else {
        sessionStorage.setItem('student_id', data.id);
        setStudentId(data.id);
        fetchDashboardData(data.id);
      }
    } catch (err) {
      console.error(err);
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('student_id');
    setStudentId(null);
    setStudentData(null);
    setPhone('');
    setDob('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // LOGIN VIEW
  if (!studentId) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-500">Log in to view your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start text-sm">
                <AlertCircle className="shrink-0 mr-2 h-5 w-5" />
                <span>{loginError}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                WhatsApp Number
              </label>
              <input
                id="phone"
                type="text"
                required
                placeholder="e.g. +1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 text-white font-bold text-xl py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 flex justify-center items-center"
            >
              {isLoggingIn ? <Loader2 className="animate-spin h-6 w-6" /> : "Access Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm pt-12 pb-6 px-6">
        <div className="max-w-2xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assalamu Alaikum,</h1>
            <h2 className="text-xl text-gray-600 mt-1">{studentData?.name}</h2>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={24} />
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
            <span className={`px-4 py-2 inline-flex text-sm font-bold rounded-full ${
              studentData?.payment_status === 'Confirmed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {studentData?.payment_status || 'Pending'}
            </span>
          </div>
        </div>

        {/* Attendance Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CalendarCheck className="mr-2 text-blue-600" size={24} />
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
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
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

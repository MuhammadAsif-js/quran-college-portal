"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';

export default function ZoomCheckIn() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'blocked', 'error'
  const [message, setMessage] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setStatus('loading');
    
    try {
      // 1. Find Student
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

      setStudentName(student.name);

      // 2. Check Payment Status
      if (student.payment_status !== 'Confirmed') {
        setStatus('blocked');
        setMessage("Your admission is currently pending payment verification. Please contact management.");
        return;
      }

      // 3. Mark Present (Upsert for today)
      // We'll use the local date string for the check-in date
      const today = new Date().toISOString().split('T')[0];
      
      const { error: attendanceError } = await supabase
        .from('attendance')
        .upsert({
          student_id: student.id,
          date: today,
          status: 'Present'
        }, {
          onConflict: 'student_id, date' // Assumes a unique constraint on (student_id, date)
        });

      // If the unique constraint doesn't exist, we might get an error if inserting a duplicate, 
      // or we can just insert it anyway depending on schema. Let's just insert if upsert fails on constraint missing.
      if (attendanceError) {
        // Fallback to simple insert if upsert fails due to missing constraints
        const { error: insertError } = await supabase
          .from('attendance')
          .insert({
            student_id: student.id,
            date: today,
            status: 'Present'
          });
          
        if (insertError) throw insertError;
      }

      setStatus('success');
      
    } catch (error) {
      console.error("Check-in error:", error);
      setStatus('error');
      setMessage("A server error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        
        {/* Header Area */}
        <div className="bg-blue-600 p-8 text-center text-white">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Class Check-In</h1>
          <p className="text-blue-100 font-medium">Mark your attendance instantly</p>
        </div>

        <div className="p-8">
          {status === 'idle' && (
            <form onSubmit={handleCheckIn} className="space-y-8 mt-2">
              <div className="space-y-3">
                <label htmlFor="phone" className="block text-lg font-bold text-gray-800 text-center">
                  Enter your WhatsApp Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors text-2xl text-center font-semibold tracking-wider"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-black text-2xl py-5 rounded-2xl hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all shadow-lg"
              >
                Mark Present
              </button>
            </form>
          )}

          {status === 'loading' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <p className="text-xl font-bold text-gray-600">Verifying...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-10 flex flex-col items-center text-center space-y-6">
              <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="h-20 w-20 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You're Checked In!</h2>
                <p className="text-lg text-gray-600">JazakAllah Khair, {studentName}. Have a great class.</p>
              </div>
              <button 
                onClick={resetForm}
                className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors w-full"
              >
                Check in another student
              </button>
            </div>
          )}

          {status === 'blocked' && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Verification Pending</h2>
                <p className="text-lg text-gray-700 font-medium leading-relaxed bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  {message}
                </p>
              </div>
              <button 
                onClick={resetForm}
                className="flex items-center justify-center text-blue-600 font-bold text-lg p-4 hover:underline w-full mt-4"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
              </button>
            </div>
          )}

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
                className="w-full bg-gray-900 text-white font-bold text-xl py-4 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg"
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

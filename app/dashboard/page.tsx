'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Student, AttendanceRecord } from '@/types';
import {
  Eye,
  X,
  User,
  Users,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  BookOpen,
  GraduationCap,
  Loader2,
  CheckCircle,
} from 'lucide-react';

// ─── Reusable pill components ───────────────────────────────────────────────
function PaymentPill({ status }: { status: string | null }) {
  const isConfirmed = status === 'Confirmed';
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={
        isConfirmed
          ? { background: 'rgba(15,62,51,0.10)', color: '#0F3E33' }
          : { background: 'rgba(212,175,55,0.18)', color: '#92620A' }
      }
    >
      {isConfirmed ? '✓ Confirmed' : '⏳ Pending'}
    </span>
  );
}



export default function DashboardPage() {
  const [students, setStudents]   = useState<Student[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);
  const [error, setError]         = useState<string | null>(null);

  // Filters
  const [paymentFilter, setPaymentFilter]   = useState<string>('All');

  // Modal
  const [selectedStudent, setSelectedStudent]                 = useState<Student | null>(null);
  const [selectedStudentAttendance, setSelectedStudentAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance]             = useState<boolean>(false);

  const openStudentDetails = async (student: Student): Promise<void> => {
    setSelectedStudent(student);
    setLoadingAttendance(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', student.id)
        .order('date', { ascending: false });

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      setSelectedStudentAttendance((data as AttendanceRecord[]) ?? []);
    } catch (err: unknown) {
      console.error('Error fetching attendance:', err);
      setSelectedStudentAttendance([]);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setStudents((data as Student[]) ?? []);
    } catch (err: unknown) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const passesPayment =
      paymentFilter === 'All' ||
      (paymentFilter === 'Pending' &&
        (!student.payment_status || student.payment_status === 'Pending')) ||
      (paymentFilter === 'Confirmed' && student.payment_status === 'Confirmed');
    return passesPayment;
  });

  const verifyPayment = async (studentId: string): Promise<void> => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, payment_status: 'Confirmed' as const } : s
      )
    );

    try {
      const { error: updateError } = await supabase
        .from('students')
        .update({ payment_status: 'Confirmed' })
        .eq('id', studentId);

      if (updateError) throw updateError;
    } catch (err: unknown) {
      console.error('Error updating payment status:', err);
      fetchStudents();
      alert('Failed to verify payment. Please try again.');
    }
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* ── Header row ── */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#0F3E33' }}>
            Students Roster
            {!loading && (
              <span
                className="ml-3 text-base font-bold px-2.5 py-0.5 rounded-full align-middle"
                style={{ background: 'rgba(212,175,55,0.18)', color: '#92620A' }}
              >
                {filteredStudents.length}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            All student applications · name, course &amp; payment status.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm border-2 border-gray-200 rounded-xl bg-white focus:outline-none transition-colors font-medium"
            style={{ borderColor: paymentFilter !== 'All' ? '#D4AF37' : undefined }}
          >
            <option value="All">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>

        </div>
      </div>

      {/* ── Table card ── */}
      <div
        className="bg-white rounded-2xl shadow-sm overflow-hidden border"
        style={{ borderColor: 'rgba(15,62,51,0.12)' }}
      >
        {error ? (
          <div className="p-8 text-center text-red-500 font-medium">{error}</div>
        ) : loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F3E33' }} />
            <p className="text-lg font-medium text-gray-500">Loading data, please wait...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr style={{ background: 'rgba(15,62,51,0.05)' }}>
                  {['Name', 'Course', 'WhatsApp No', 'Location', 'Payment', ''].map(
                    (col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider"
                        style={{ color: '#0F3E33' }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm text-gray-700 font-medium truncate max-w-[200px]"
                          title={student.course}
                        >
                          {student.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">{student.city}</div>
                        <div className="text-xs text-gray-400">{student.country}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentPill status={student.payment_status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col items-end justify-center gap-2">
                          {(!student.payment_status || student.payment_status === 'Pending') && (
                            <button
                              onClick={() => verifyPayment(student.id)}
                              className="flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border transition-all active:scale-95"
                              style={{
                                background: 'rgba(15,62,51,0.07)',
                                borderColor: 'rgba(15,62,51,0.3)',
                                color: '#0F3E33',
                              }}
                            >
                              <CheckCircle size={13} className="mr-1.5" />
                              Verify Payment
                            </button>
                          )}
                          <button
                            onClick={() => openStudentDetails(student)}
                            className="flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Eye size={13} className="mr-1.5" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="h-10 w-10 text-gray-300" />
                        <p className="text-base font-medium text-gray-400">
                          No students found for this filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Student Details Modal ── */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-gray-900/60 transition-opacity"
              aria-hidden="true"
              onClick={() => setSelectedStudent(null)}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            {/* Panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              {/* Modal header strip */}
              <div
                className="px-6 pt-6 pb-5 flex justify-between items-start"
                style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
              >
                <div>
                  <h3 className="text-lg font-extrabold text-white" id="modal-title">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-0.5">
                    Application submitted {formatDate(selectedStudent.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-white/60 hover:text-white transition-colors ml-4 mt-0.5"
                >
                  <span className="sr-only">Close</span>
                  <X size={22} />
                </button>
              </div>

              <div className="bg-white px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal info */}
                  <div className="space-y-4">
                    <h4
                      className="font-bold text-xs uppercase tracking-wider pb-2 border-b"
                      style={{ color: '#0F3E33', borderColor: 'rgba(15,62,51,0.15)' }}
                    >
                      Personal Information
                    </h4>
                    {[
                      { icon: <User size={12} />, label: 'Full Name (English)', value: selectedStudent.name },
                      { icon: <User size={12} />, label: 'مکمل نام (Urdu)',     value: selectedStudent.full_name_urdu },
                      { icon: <Users size={12} />, label: "Father's Name",      value: selectedStudent.father_name },
                      { icon: <Calendar size={12} />, label: 'Date of Birth',   value: formatDate(selectedStudent.date_of_birth) },
                      { icon: <CreditCard size={12} />, label: 'CNIC',          value: selectedStudent.cnic },
                    ].map((row) => (
                      <div key={row.label}>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          {row.icon}
                          {row.label}
                        </p>
                        <p
                          className={`font-semibold text-gray-800 mt-0.5 ${row.label === 'مکمل نام (Urdu)' ? 'text-lg font-amiri' : ''}`}
                          dir={row.label === 'مکمل نام (Urdu)' ? 'rtl' : undefined}
                        >
                          {row.value || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Contact & Academics */}
                  <div className="space-y-4">
                    <h4
                      className="font-bold text-xs uppercase tracking-wider pb-2 border-b"
                      style={{ color: '#0F3E33', borderColor: 'rgba(15,62,51,0.15)' }}
                    >
                      Contact &amp; Academics
                    </h4>
                    {[
                      { icon: <Phone size={12} />,        label: 'WhatsApp',             value: selectedStudent.phone },
                      { icon: null,                         label: 'Email',                value: selectedStudent.email },
                      { icon: <MapPin size={12} />,        label: 'Location',             value: `${selectedStudent.city || 'N/A'}, ${selectedStudent.country || 'N/A'}` },
                      { icon: <GraduationCap size={12} />, label: 'Education',            value: selectedStudent.education },
                      { icon: <BookOpen size={12} />,      label: 'Islamic Qualification', value: selectedStudent.islamic_qualification },
                    ].map((row) => (
                      <div key={row.label}>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          {row.icon ?? <span className="text-gray-400">@</span>}
                          {row.label}
                        </p>
                        <p className="font-semibold text-gray-800 mt-0.5">{row.value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Course & Status */}
                  <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Selected Course</p>
                      <p className="font-extrabold text-lg mt-0.5" style={{ color: '#0F3E33' }}>
                        {selectedStudent.course || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Payment Status</p>
                      <div className="mt-1">
                        <PaymentPill status={selectedStudent.payment_status} />
                      </div>
                    </div>
                  </div>

                  {/* Attendance history */}
                  <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                    <h4
                      className="font-bold text-xs uppercase tracking-wider pb-2 border-b"
                      style={{ color: '#0F3E33', borderColor: 'rgba(15,62,51,0.15)' }}
                    >
                      Attendance History
                    </h4>
                    {loadingAttendance ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#0F3E33' }} />
                      </div>
                    ) : selectedStudentAttendance.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No attendance records found.</p>
                    ) : (
                      <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {selectedStudentAttendance.map((record) => (
                          <div
                            key={record.id}
                            className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl border border-gray-100"
                          >
                            <span className="font-medium text-gray-700">
                              {new Date(record.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                record.status === 'Present'
                                  ? 'bg-emerald-100 text-emerald-700'
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

              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="inline-flex justify-center rounded-xl border border-transparent shadow-sm px-5 py-2.5 text-sm font-bold text-white transition-colors"
                  style={{ background: '#0F3E33' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

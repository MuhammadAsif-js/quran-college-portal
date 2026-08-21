'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Student, AttendanceRecord } from '@/types';
import {
  Filter,
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
  Globe,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const [students, setStudents]   = useState<Student[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);
  const [error, setError]         = useState<string | null>(null);

  // Filters
  const [teacherFilter, setTeacherFilter]   = useState<string>('All');
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
    const passesTeacher =
      teacherFilter === 'All' || student.assigned_teacher === teacherFilter;
    const passesPayment =
      paymentFilter === 'All' ||
      (paymentFilter === 'Pending' &&
        (!student.payment_status || student.payment_status === 'Pending')) ||
      (paymentFilter === 'Confirmed' && student.payment_status === 'Confirmed');
    return passesTeacher && passesPayment;
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
      {/* Header row */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students Roster</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all student applications including their name, course, and assigned teacher.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Payment filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="block w-full sm:w-40 pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md border bg-white"
            >
              <option value="All">All Payments</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>

          {/* Teacher filter */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Filter size={16} />
            </div>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="block w-full sm:w-48 pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md border bg-white"
            >
              <option value="All">All Teachers</option>
              <option value="Teacher 1">Teacher 1</option>
              <option value="Teacher 2">Teacher 2</option>
              <option value="Teacher 3">Teacher 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-lg font-medium">Loading data, please wait...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Name',
                    'Course',
                    'WhatsApp No',
                    'Location',
                    'Assigned Teacher',
                    'Payment',
                    '',
                  ].map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm text-gray-900 truncate max-w-[200px]"
                          title={student.course}
                        >
                          {student.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.city}</div>
                        <div className="text-sm text-gray-500">{student.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.assigned_teacher === 'Teacher 1'
                              ? 'bg-green-100 text-green-800'
                              : student.assigned_teacher === 'Teacher 2'
                              ? 'bg-blue-100 text-blue-800'
                              : student.assigned_teacher === 'Teacher 3'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {student.assigned_teacher || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.payment_status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {student.payment_status ?? 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col items-end justify-center space-y-2">
                          {(!student.payment_status ||
                            student.payment_status === 'Pending') && (
                            <button
                              onClick={() => verifyPayment(student.id)}
                              className="text-green-700 hover:text-green-900 hover:bg-green-100 flex items-center bg-green-50 px-3 py-1.5 rounded-md border border-green-200 transition-colors shadow-sm"
                            >
                              <CheckCircle size={14} className="mr-1.5" />
                              Verify Payment
                            </button>
                          )}
                          <button
                            onClick={() => openStudentDetails(student)}
                            className="text-blue-600 hover:text-blue-900 flex items-center px-3 py-1.5"
                          >
                            <Eye size={16} className="mr-1.5" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="h-10 w-10 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600">
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

      {/* Student Details Modal */}
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
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setSelectedStudent(null)}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            {/* Panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                      Student Application Details
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted on {formatDate(selectedStudent.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-gray-900 border-b pb-2 uppercase tracking-wider">
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
                          <p className="text-xs text-gray-500 flex items-center">
                            {row.icon}
                            <span className="ml-1">{row.label}</span>
                          </p>
                          <p
                            className={`font-medium ${row.label === 'مکمل نام (Urdu)' ? 'text-lg font-amiri' : ''}`}
                            dir={row.label === 'مکمل نام (Urdu)' ? 'rtl' : undefined}
                          >
                            {row.value || 'N/A'}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Contact & Academics */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-gray-900 border-b pb-2 uppercase tracking-wider">
                        Contact &amp; Academics
                      </h4>
                      {[
                        { icon: <Phone size={12} />,         label: 'WhatsApp',            value: selectedStudent.phone },
                        { icon: null,                          label: 'Email',               value: selectedStudent.email },
                        { icon: <MapPin size={12} />,         label: 'Location',            value: `${selectedStudent.city || 'N/A'}, ${selectedStudent.country || 'N/A'}` },
                        { icon: <GraduationCap size={12} />,  label: 'Education',           value: selectedStudent.education },
                        { icon: <BookOpen size={12} />,       label: 'Islamic Qualification', value: selectedStudent.islamic_qualification },
                      ].map((row) => (
                        <div key={row.label}>
                          <p className="text-xs text-gray-500 flex items-center">
                            {row.icon && <span className="mr-1">{row.icon}</span>}
                            {!row.icon && <span className="mr-1 text-gray-400">@</span>}
                            {row.label}
                          </p>
                          <p className="font-medium">{row.value || 'N/A'}</p>
                        </div>
                      ))}
                    </div>

                    {/* Course & Status */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Selected Course</p>
                        <p className="font-bold text-blue-700 text-lg">
                          {selectedStudent.course || 'N/A'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Assigned Teacher</p>
                          <p className="font-bold">
                            {selectedStudent.assigned_teacher || 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment Status</p>
                          <span
                            className={`px-2 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              selectedStudent.payment_status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {selectedStudent.payment_status ?? 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance history */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-sm text-gray-900 border-b pb-2 uppercase tracking-wider">
                        Attendance History
                      </h4>
                      {loadingAttendance ? (
                        <div className="flex justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                      ) : selectedStudentAttendance.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No attendance records found.</p>
                      ) : (
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                          {selectedStudentAttendance.map((record) => (
                            <div
                              key={record.id}
                              className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border border-gray-100"
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
                                className={`px-2 py-1 text-xs font-bold rounded-full ${
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

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
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

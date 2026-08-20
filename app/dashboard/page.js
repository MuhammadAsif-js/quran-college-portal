"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Eye, X, User, Users, MapPin, Phone, Calendar, CreditCard, BookOpen, GraduationCap, Globe, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering
  const [teacherFilter, setTeacherFilter] = useState('All');
  
  // Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    if (teacherFilter === 'All') return true;
    return student.assigned_teacher === teacherFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students Roster</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all student applications including their name, course, and assigned teacher.</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center">
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Filter size={16} />
            </div>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="block w-full sm:w-48 pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-white"
            >
              <option value="All">All Teachers</option>
              <option value="Teacher 1">Teacher 1</option>
              <option value="Teacher 2">Teacher 2</option>
              <option value="Teacher 3">Teacher 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WhatsApp No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Teacher
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
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
                        <div className="text-sm text-gray-900 truncate max-w-[200px]" title={student.course}>
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.assigned_teacher === 'Teacher 1' ? 'bg-green-100 text-green-800' :
                          student.assigned_teacher === 'Teacher 2' ? 'bg-blue-100 text-blue-800' :
                          student.assigned_teacher === 'Teacher 3' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.assigned_teacher || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                        >
                          <Eye size={16} className="mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="h-10 w-10 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600">No students found for this teacher yet.</p>
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
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedStudent(null)}></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                      Student Application Details
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Submitted on {formatDate(selectedStudent.created_at)}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Close</span>
                    <X size={24} />
                  </button>
                </div>
                
                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-gray-900 border-b pb-2 uppercase tracking-wider">Personal Information</h4>
                      
                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><User size={12} className="mr-1"/> Full Name (English)</p>
                        <p className="font-medium">{selectedStudent.name || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><User size={12} className="mr-1"/> مکمل نام (Urdu)</p>
                        <p className="font-medium text-lg font-arabic" dir="rtl">{selectedStudent.full_name_urdu || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><Users size={12} className="mr-1"/> Father's Name</p>
                        <p className="font-medium">{selectedStudent.father_name || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><Calendar size={12} className="mr-1"/> Date of Birth</p>
                        <p className="font-medium">{formatDate(selectedStudent.date_of_birth)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><CreditCard size={12} className="mr-1"/> CNIC</p>
                        <p className="font-medium">{selectedStudent.cnic || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-gray-900 border-b pb-2 uppercase tracking-wider">Contact & Academics</h4>
                      
                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><Phone size={12} className="mr-1"/> WhatsApp Number</p>
                        <p className="font-medium">{selectedStudent.phone || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 flex items-center">@ Email</p>
                        <p className="font-medium">{selectedStudent.email || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><MapPin size={12} className="mr-1"/> Location</p>
                        <p className="font-medium">{selectedStudent.city || 'N/A'}, {selectedStudent.country || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><GraduationCap size={12} className="mr-1"/> Education</p>
                        <p className="font-medium">{selectedStudent.education || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 flex items-center"><BookOpen size={12} className="mr-1"/> Islamic Qualification</p>
                        <p className="font-medium">{selectedStudent.islamic_qualification || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Selected Course</p>
                        <p className="font-bold text-blue-700 text-lg">{selectedStudent.course || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Assigned Teacher</p>
                        <p className="font-bold">{selectedStudent.assigned_teacher || 'None'}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  onClick={() => setSelectedStudent(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
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

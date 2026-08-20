"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Users, MapPin, Phone, UserCheck, Send, CheckCircle2, Mail, Calendar, CreditCard, Globe, BookOpen, GraduationCap, Book } from 'lucide-react';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    full_name_urdu: '',
    father_name: '',
    phone: '',
    course: '',
    date_of_birth: '',
    cnic: '',
    city: '',
    country: '',
    islamic_qualification: '',
    education: '',
    assigned_teacher: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Direct submission to Supabase
      const { error: submitError } = await supabase
        .from('students')
        .insert([
          {
            email: formData.email,
            full_name_urdu: formData.full_name_urdu,
            course: formData.course,
            date_of_birth: formData.date_of_birth,
            cnic: formData.cnic,
            country: formData.country,
            islamic_qualification: formData.islamic_qualification,
            education: formData.education,
            name: formData.name,
            father_name: formData.father_name,
            city: formData.city,
            phone: formData.phone,
            assigned_teacher: formData.assigned_teacher,
          }
        ]);

      if (submitError) {
        console.error("Supabase Error Details:", submitError);
        throw submitError;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'An error occurred during submission. Please check your Supabase connection and table structure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({
      email: '',
      name: '',
      full_name_urdu: '',
      father_name: '',
      phone: '',
      course: '',
      date_of_birth: '',
      cnic: '',
      city: '',
      country: '',
      islamic_qualification: '',
      education: '',
      assigned_teacher: ''
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in duration-300 border border-gray-100">
          <div className="mx-auto bg-green-50 text-green-500 rounded-full w-24 h-24 flex items-center justify-center mb-6">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Success!</h2>
          <p className="text-gray-500 text-lg">Application submitted successfully! We will contact you soon.</p>
          <button 
            onClick={resetForm}
            className="mt-8 w-full bg-blue-600 text-white rounded-xl px-4 py-4 font-semibold hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  const courses = [
    "Nazra Tul Quraan",
    "Amli Tajweed Course (Level-2)",
    "دقائق صفات الحروف (دورہ تخصص)",
    "Tafseer 25th to 30th Parah",
    "Tarteel ul Quraan 24/7",
    "STC (Short Tajweed Course)",
    "CTC (Customised Tajweed Course) Level-1",
    "DTC (Detailed Tajweed Course) level-2",
    "Pre Jazzariyyah Course",
    "Al Muqadimmah-tul-Jazzariyah",
    "Summer Course for Sisters",
    "قراءۃ الإمام یعقوب حضرمی",
    "Individual Tafseer Groups",
    "Hifz-ul-Quraan",
    "The Rising LEADER",
    "Hadith Course",
    "أُولَٰئِكَ هُمُ الْفَائِزُونَ The Successful People"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="px-6 py-10 sm:p-12">
          
          {/* Header Section */}
          <div className="text-center mb-10 pb-8 border-b border-gray-100">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight mb-4">
              2026-Quraan College Admission Form
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 font-medium leading-relaxed max-w-2xl mx-auto">
              Asalam o Alikum Wa Rehmatullahi Wa Barakatuhu! Welcome to Quraan College Online registration platform. We are obliged to have you and serve you with pure teachings of Islam.
            </p>
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-200 mt-6 inline-block text-left max-w-2xl mx-auto">
              <span className="font-semibold block mb-1">Privacy Note:</span>
              These details will remain private, confidential and will only be used for Registration process and Certification purposes.
            </div>
            <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
              <Phone size={16} className="mr-2" />
              <span>Questions? WhatsApp us: <strong>+92 000 0000000</strong></span>
            </div>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. email@example.com"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. Anum Yaqoob"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Kindly enter your full name in the given format (Anum Yaqoob)</p>
              </div>

              {/* Full Name Urdu */}
              <div>
                <label htmlFor="full_name_urdu" className="block text-sm font-semibold text-gray-700 mb-2 text-right">مکمل نام</label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type="text"
                    name="full_name_urdu"
                    id="full_name_urdu"
                    required
                    dir="rtl"
                    value={formData.full_name_urdu}
                    onChange={handleChange}
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm text-right"
                    placeholder="اپنا نام اردو میں لکھیں"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 text-right" dir="rtl">اپنا مکمل نام مع ولدیت اردو میں اس طرح درج کریں</p>
              </div>

              {/* Father's Name */}
              <div>
                <label htmlFor="father_name" className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Users size={18} />
                  </div>
                  <input
                    type="text"
                    name="father_name"
                    id="father_name"
                    required
                    value={formData.father_name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="Father's Name"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp No</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. 00923334444444"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Kindly add your complete number with Country code in the given format (00923334444444)</p>
              </div>

              {/* Course Selection */}
              <div className="md:col-span-2">
                <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Book size={18} />
                  </div>
                  <select
                    name="course"
                    id="course"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 appearance-none sm:text-sm"
                  >
                    <option value="" disabled>Select a course...</option>
                    {courses.map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                  />
                </div>
              </div>

              {/* CNIC */}
              <div>
                <label htmlFor="cnic" className="block text-sm font-semibold text-gray-700 mb-2">CNIC</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <CreditCard size={18} />
                  </div>
                  <input
                    type="text"
                    name="cnic"
                    id="cnic"
                    required
                    value={formData.cnic}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. 12345-1234567-1"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Kindly add your accurate CNIC Number as this is mandatory for Admission.</p>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. Lahore"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Globe size={18} />
                  </div>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. Pakistan"
                  />
                </div>
              </div>

              {/* Islamic Qualification */}
              <div>
                <label htmlFor="islamic_qualification" className="block text-sm font-semibold text-gray-700 mb-2">Islamic Qualification</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <BookOpen size={18} />
                  </div>
                  <input
                    type="text"
                    name="islamic_qualification"
                    id="islamic_qualification"
                    required
                    value={formData.islamic_qualification}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. Nazra, Hifz"
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <label htmlFor="education" className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <GraduationCap size={18} />
                  </div>
                  <input
                    type="text"
                    name="education"
                    id="education"
                    required
                    value={formData.education}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400 sm:text-sm"
                    placeholder="e.g. Bachelors"
                  />
                </div>
              </div>

              {/* Assigned Teacher */}
              <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                <label htmlFor="assigned_teacher" className="block text-sm font-semibold text-gray-700 mb-2">Assigned Teacher (For Internal Routing)</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <UserCheck size={18} />
                  </div>
                  <select
                    name="assigned_teacher"
                    id="assigned_teacher"
                    required
                    value={formData.assigned_teacher}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 appearance-none sm:text-sm"
                  >
                    <option value="" disabled>Choose a teacher...</option>
                    <option value="Teacher 1">Teacher 1</option>
                    <option value="Teacher 2">Teacher 2</option>
                    <option value="Teacher 3">Teacher 3</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
              >
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                {!isSubmitting && <Send size={20} className="ml-2" />}
              </button>
            </div>
            
            {/* Footer Dummy Contact */}
            <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
              <p>Need help with your application? Contact us at <strong>+92 000 0000000</strong></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

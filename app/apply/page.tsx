'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  User,
  Phone,
  Mail,
  BookOpen,
  Send,
  CheckCircle,
  Copy,
  Check,
  Share2,
  CalendarDays,
  CreditCard,
  MapPin,
  Globe,
  GraduationCap,
  Users,
  Lock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AdmissionFormData } from '@/types';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Static Data
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const INITIAL_FORM: AdmissionFormData = {
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
  assigned_teacher: '',
};

const COURSES: string[] = [
  'Nazra tul Quran',
  'Hifz ul Quran',
  'Tajweed Course',
  'Tafseer ul Quran',
  'Moman ki Namaz',
  'Tajliya-Te-Nabowat Books'
];

const ISLAMIC_QUALIFICATIONS: string[] = [
  'None',
  'Nazra (Basic Reading)',
  'Hifz ul Quran',
  'Tajweed Certificate',
  'Alim / Alima',
  'Other',
];

const EDUCATION_LEVELS: string[] = [
  'Primary',
  'Middle',
  'Matric / O-Levels',
  'Intermediate / A-Levels',
  'Bachelors',
  'Masters',
  'PhD',
  'Other',
];

const TEACHERS: string[] = [
  'Not Assigned Yet',
  'Ustadh Abdullah',
  'Ustadha Fatima',
  'Ustadh Ibrahim',
  'Ustadha Khadija',
  'Ustadh Yusuf',
];

const WA_MESSAGE =
  'Assalamu Alaikum! ðŸŒŸ Admissions are now open at our Quran Academy. Begin your journey of Ilm & Hidayah here: ';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Sub-components
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function FieldWrapper({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10"
        style={{ color: '#9ca3af' }}
      >
        {icon}
      </div>
      {children}
    </div>
  );
}

function ChevronDown() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"
      style={{ color: '#9ca3af' }}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
      {children}
    </label>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#9ca3af' }}>
      {children}
    </p>
  );
}

/* Shared style strings */
const INPUT =
  'w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]';
const SELECT =
  'w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm appearance-none transition-all duration-200 outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Toast Component
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function SuccessToast({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 transition-all duration-500"
      style={{
        transform: `translate(-50%, ${visible ? '0' : '120%'})`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-medium"
        style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.25)' }}
        >
          <CheckCircle size={20} style={{ color: '#D4AF37' }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#D4AF37' }}>
            Alhamdulillah! ðŸŒ™
          </p>
          <p className="text-white/80 text-xs mt-0.5">
            Your application has been received. Jazakallah Khair!
          </p>
        </div>
      </div>
    </div>
  );
}

/* Islamic Geometric SVG Pattern */
const PATTERN_URL = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 8L8 30l22 22 22-22L30 8zM30 16l14 14-14 14-14-14L30 16zm0 6l-8 8 8 8 8-8-8-8z'/%3E%3C/g%3E%3C/svg%3E")`;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Main Component
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export default function ApplyPage() {
  const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_FORM);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [pageUrl, setPageUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  /* Capture URL client-side only */
  useEffect(() => {
    setPageUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  /* â”€â”€ Handlers â”€â”€ */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('students').insert([formData]);

    if (error) {
      console.error('Supabase insert error:', error);
      setErrorMsg(error.message ?? 'Something went wrong. Please try again.');
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleCopyLink = (): void => {
    if (!pageUrl) return;
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = (): void => {
    setSubmitStatus('idle');
    setFormData(INITIAL_FORM);
    setErrorMsg('');
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(WA_MESSAGE + pageUrl)}`;

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     Render
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <div className="min-h-screen" style={{ background: '#f5f5f0' }}>

      {/* Global shimmer + fade-up keyframes */}
      <style>{`
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .anim-fade-up   { animation: fadeUp 0.5s ease both; }
        .anim-fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
        .anim-fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
        .anim-fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }
      `}</style>

      {/* Toast */}
      <SuccessToast visible={showToast} />

      {/* â”€â”€ WhatsApp Contact Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className="text-center py-2.5 px-4 text-sm font-semibold"
        style={{ background: '#0F3E33', color: '#D4AF37' }}
      >
        Questions?{' '}
        <a
          href="https://wa.me/920000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          WhatsApp us: +92 000 0000000
        </a>
      </div>

      {/* â”€â”€ Hero Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a2a22 0%, #0F3E33 60%, #0d3028 100%)' }}
      >
        {/* Islamic pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: PATTERN_URL }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />

        <div className="relative z-10 text-center py-14 px-6 anim-fade-up">
          {/* Bismillah */}
          <div
            className="text-4xl md:text-5xl mb-4 leading-loose tracking-wide"
            style={{ fontFamily: 'var(--font-amiri)', color: '#D4AF37' }}
          >
            بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Arabic subtitle */}
          <div
            className="text-xl md:text-2xl text-white/55 mb-5"
            style={{ fontFamily: 'var(--font-amiri)' }}
          >
            مَرْحَبًا بِكُمْ
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            2026 Quran Institute Admission Form
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto leading-relaxed">
            Asalam o Alikum Wa Rehmatullahi Wa Barakatuhu!{' '}
            <span className="text-white/85 font-medium">
              Welcome to Quran Institute Online registration platform.
            </span>{' '}
            Join hundreds of students worldwide on a journey of{' '}
            <span style={{ color: '#D4AF37' }}>Ilm</span> and{' '}
            <span style={{ color: '#D4AF37' }}>Hidayah</span>. Fill in your details below to
            secure your place.
          </p>
        </div>
      </div>

      {/* —— Main Content —————————————————————————————————————————— */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Privacy Note Card */}
        <div
          className="rounded-2xl px-5 py-4 mb-8 flex gap-3 items-start anim-fade-up-1"
          style={{
            background: 'rgba(212,175,55,0.10)',
            border: '1px solid rgba(212,175,55,0.35)',
          }}
        >
          <div
            className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.2)' }}
          >
            <Lock size={15} style={{ color: '#b8962e' }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-0.5" style={{ color: '#0F3E33' }}>
              Privacy Notice
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
              🔒 Your details are <strong>private and confidential</strong>. Information provided
              is used solely for registration, scheduling, and academic management purposes within
              Quran Institute . We do not share your data with third parties.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ┌── FORM CARD (2/3 width on lg) ───────────────────────── */}
          <div className="lg:col-span-2 anim-fade-up-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Card header strip */}
              <div
                className="px-8 py-5 flex items-center gap-3"
                style={{
                  borderBottom: '1px solid rgba(212,175,55,0.18)',
                  background:
                    'linear-gradient(135deg, rgba(15,62,51,0.04), rgba(212,175,55,0.04))',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
                >
                  <BookOpen className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-gray-900 text-lg leading-tight">
                    Student Admission Form
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    All fields are required · Academic Year 2026
                  </p>
                </div>
              </div>

              {/* —— Success State —— */}
              {submitStatus === 'success' ? (
                <div className="px-8 py-16 flex flex-col items-center text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'rgba(15,62,51,0.08)' }}
                  >
                    <CheckCircle size={48} style={{ color: '#0F3E33' }} strokeWidth={1.5} />
                  </div>
                  <div
                    className="text-4xl mb-3"
                    style={{ fontFamily: 'var(--font-amiri)', color: '#D4AF37' }}
                  >
                    الحَمْدُ لِلّٰه
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                    Application Received!
                  </h3>
                  <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                    Alhamdulillah, your application has been submitted successfully. Our team
                    will be in touch soon, In Sha Allah. 🌙
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3.5 font-bold text-white rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg text-sm"
                    style={{ background: '#0F3E33' }}
                  >
                    Submit Another Application
                  </button>
                </div>

              ) : (
                /* —— Form —— */
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8">

                  {/* Error Banner */}
                  {submitStatus === 'error' && errorMsg && (
                    <div
                      className="mb-6 rounded-xl px-4 py-3 text-sm font-medium"
                      style={{
                        background: 'rgba(220,38,38,0.08)',
                        border: '1px solid rgba(220,38,38,0.25)',
                        color: '#b91c1c',
                      }}
                    >
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div className="space-y-5">

                    {/* —— Email —— */}
                    <div>
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <FieldWrapper icon={<Mail size={17} />}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={INPUT}
                          placeholder="you@example.com"
                        />
                      </FieldWrapper>
                    </div>

                    {/* —— Full Name (English) + Father's Name —— */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel htmlFor="name">Full Name (English)</FieldLabel>
                        <FieldWrapper icon={<User size={17} />}>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={INPUT}
                            placeholder="e.g. Fatima Ahmad"
                          />
                        </FieldWrapper>
                        <HelpText>Enter your full name exactly as it appears on your national ID.</HelpText>
                      </div>

                      <div>
                        <FieldLabel htmlFor="father_name">{"Father's Name"}</FieldLabel>
                        <FieldWrapper icon={<Users size={17} />}>
                          <input
                            id="father_name"
                            name="father_name"
                            type="text"
                            required
                            value={formData.father_name}
                            onChange={handleChange}
                            className={INPUT}
                            placeholder="e.g. Ahmad Khan"
                          />
                        </FieldWrapper>
                      </div>
                    </div>

                    {/* —— Full Name (Urdu) —— */}
                    <div>
                      <FieldLabel htmlFor="full_name_urdu">مکمل نام (Full Name in Urdu)</FieldLabel>
                      <FieldWrapper icon={<User size={17} />}>
                        <input
                          id="full_name_urdu"
                          name="full_name_urdu"
                          type="text"
                          required
                          dir="rtl"
                          value={formData.full_name_urdu}
                          onChange={handleChange}
                          className={`${INPUT} text-right`}
                          style={{ fontFamily: 'var(--font-amiri)' }}
                          placeholder="فاطمہ احمد"
                        />
                      </FieldWrapper>
                      <HelpText>
                        اپنا مکمل نام معہ والدیت اردو میں اس طرح درج کریں: فاطمہ بنت احمد
                      </HelpText>
                    </div>

                    {/* —— WhatsApp + CNIC —— */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel htmlFor="phone">WhatsApp Number</FieldLabel>
                        <FieldWrapper icon={<Phone size={17} />}>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className={INPUT}
                            placeholder="+92 300 0000000"
                          />
                        </FieldWrapper>
                        <HelpText>Include country code, e.g. +92 for Pakistan.</HelpText>
                      </div>

                      <div>
                        <FieldLabel htmlFor="cnic">CNIC / Passport No.</FieldLabel>
                        <FieldWrapper icon={<CreditCard size={17} />}>
                          <input
                            id="cnic"
                            name="cnic"
                            type="text"
                            required
                            value={formData.cnic}
                            onChange={handleChange}
                            className={INPUT}
                            placeholder="35202-1234567-8"
                          />
                        </FieldWrapper>
                        <HelpText>⚠️ Mandatory for enrollment verification.</HelpText>
                      </div>
                    </div>

                    {/* —— Course + Date of Birth —— */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel htmlFor="course">Course</FieldLabel>
                        <div className="relative">
                          <div
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10"
                            style={{ color: '#9ca3af' }}
                          >
                            <BookOpen size={17} />
                          </div>
                          <select
                            id="course"
                            name="course"
                            required
                            value={formData.course}
                            onChange={handleChange}
                            className={SELECT}
                          >
                            <option value="" disabled>Select a course…</option>
                            {COURSES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown />
                        </div>
                      </div>

                      <div>
                        <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
                        <FieldWrapper icon={<CalendarDays size={17} />}>
                          <input
                            id="date_of_birth"
                            name="date_of_birth"
                            type="date"
                            required
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className={INPUT}
                          />
                        </FieldWrapper>
                      </div>
                    </div>

                    {/* —— City + Country —— */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel htmlFor="city">City</FieldLabel>
                        <FieldWrapper icon={<MapPin size={17} />}>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className={INPUT}
                            placeholder="e.g. Lahore"
                          />
                        </FieldWrapper>
                      </div>

                      <div>
                        <FieldLabel htmlFor="country">Country</FieldLabel>
                        <FieldWrapper icon={<Globe size={17} />}>
                          <input
                            id="country"
                            name="country"
                            type="text"
                            required
                            value={formData.country}
                            onChange={handleChange}
                            className={INPUT}
                            placeholder="e.g. Pakistan"
                          />
                        </FieldWrapper>
                      </div>
                    </div>

                    {/* —— Islamic Qualification + Education —— */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel htmlFor="islamic_qualification">Islamic Qualification</FieldLabel>
                        <div className="relative">
                          <div
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10"
                            style={{ color: '#9ca3af' }}
                          >
                            <BookOpen size={17} />
                          </div>
                          <select
                            id="islamic_qualification"
                            name="islamic_qualification"
                            required
                            value={formData.islamic_qualification}
                            onChange={handleChange}
                            className={SELECT}
                          >
                            <option value="" disabled>e.g. Nazra, Hifz…</option>
                            {ISLAMIC_QUALIFICATIONS.map((q) => (
                              <option key={q} value={q}>{q}</option>
                            ))}
                          </select>
                          <ChevronDown />
                        </div>
                      </div>

                      <div>
                        <FieldLabel htmlFor="education">Education Level</FieldLabel>
                        <div className="relative">
                          <div
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10"
                            style={{ color: '#9ca3af' }}
                          >
                            <GraduationCap size={17} />
                          </div>
                          <select
                            id="education"
                            name="education"
                            required
                            value={formData.education}
                            onChange={handleChange}
                            className={SELECT}
                          >
                            <option value="" disabled>e.g. Bachelors…</option>
                            {EDUCATION_LEVELS.map((lvl) => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                          <ChevronDown />
                        </div>
                      </div>
                    </div>

                    {/* —— Assigned Teacher (Internal) —— */}
                    <div>
                      <FieldLabel htmlFor="assigned_teacher">
                        Assigned Teacher{' '}
                        <span className="text-xs font-normal text-gray-400">
                          (For Internal Routing)
                        </span>
                      </FieldLabel>
                      <div className="relative">
                        <div
                          className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10"
                          style={{ color: '#9ca3af' }}
                        >
                          <Users size={17} />
                        </div>
                        <select
                          id="assigned_teacher"
                          name="assigned_teacher"
                          required
                          value={formData.assigned_teacher}
                          onChange={handleChange}
                          className={SELECT}
                        >
                          <option value="" disabled>Select a teacher…</option>
                          {TEACHERS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </div>

                    {/* —— Submit Button —— */}
                    <div className="pt-3">
                      <button
                        id="apply-submit-btn"
                        type="submit"
                        disabled={submitStatus === 'submitting'}
                        className="group w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-base transition-all duration-300 overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        style={{
                          background:
                            'linear-gradient(135deg, #D4AF37 0%, #e8c84a 50%, #D4AF37 100%)',
                          backgroundSize: '200% auto',
                          color: '#0F3E33',
                          boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
                        }}
                      >
                        {/* Shimmer overlay */}
                        <span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                            backgroundSize: '200% auto',
                            animation: 'shimmer 1.5s linear infinite',
                          }}
                        />

                        {submitStatus === 'submitting' ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span>Submitting…</span>
                          </>
                        ) : (
                          <>
                            <span
                              className="text-2xl leading-none"
                              style={{ fontFamily: 'var(--font-amiri)' }}
                            >
                              سَجِّلْ الآن
                            </span>
                            <span className="w-px h-5 bg-[#0F3E33]/25" />
                            <span>Submit Application</span>
                            <Send
                              size={17}
                              className="ml-1 group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ┌── SHARE CARD (1/3 width on lg, sticky) ──────────────── */}
          <div className="lg:sticky lg:top-24 space-y-4 anim-fade-up-3">

            {/* Share card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Card header */}
              <div
                className="px-6 py-5"
                style={{ background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.2)' }}
                  >
                    <Share2 size={18} style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <div
                      className="text-xl leading-none"
                      style={{ fontFamily: 'var(--font-amiri)', color: '#D4AF37' }}
                    >
                      انشر الخير
                    </div>
                    <div className="text-white/60 text-xs mt-0.5">Spread the Goodness</div>
                  </div>
                </div>
                <p className="text-white/55 text-xs mt-3 leading-relaxed">
                  Know someone who would benefit from Islamic education? Share this link with
                  family and friends. Every soul you guide earns you reward, In Sha Allah.
                </p>
              </div>

              {/* Card body */}
              <div className="px-6 py-6 space-y-5">

                {/* Copy Link */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>
                    Admission Link
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        readOnly
                        value={pageUrl}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-xs truncate outline-none select-all cursor-pointer"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                    </div>
                    <button
                      id="copy-link-btn"
                      onClick={handleCopyLink}
                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200"
                      style={{
                        background: copied ? '#16a34a' : '#0F3E33',
                        color: 'white',
                      }}
                      title="Copy admission link"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-gray-300 text-xs">or share via</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* WhatsApp Share Button */}
                <a
                  id="whatsapp-share-btn"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    boxShadow: '0 4px 15px rgba(37,211,102,0.25)',
                  }}
                >
                  {/* WhatsApp SVG icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 flex-shrink-0 fill-white group-hover:scale-110 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-white font-extrabold leading-tight">Share on WhatsApp</div>
                    <div className="text-white/70 text-xs font-normal mt-0.5">
                      Invite family &amp; friends
                    </div>
                  </div>
                </a>

                {/* Hadith quote */}
                <div
                  className="rounded-2xl px-4 py-4 text-center"
                  style={{
                    background: 'rgba(15,62,51,0.04)',
                    border: '1px solid rgba(15,62,51,0.08)',
                  }}
                >
                  <div
                    className="text-lg leading-relaxed mb-1"
                    style={{ fontFamily: 'var(--font-amiri)', color: '#0F3E33' }}
                  >
                    مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    &ldquo;Whoever guides someone to goodness will have a reward like one who did
                    it.&rdquo;
                    <span className="block mt-0.5 font-medium" style={{ color: '#D4AF37' }}>
                      — Muslim
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact note */}
            <div
              className="rounded-2xl px-5 py-4 text-center text-sm"
              style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
              }}
            >
              <p className="text-gray-600 text-xs leading-relaxed">
                Questions? Contact us on WhatsApp
              </p>
              <a
                href="https://wa.me/920000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sm mt-1 block transition-opacity hover:opacity-75"
                style={{ color: '#0F3E33' }}
              >
                +92 000 0000000
              </a>
            </div>

          </div>
        </div>{/* /grid */}
      </div>{/* /max-w */}
    </div>
  );
}

'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  User,
  Phone,
  Mail,
  BookOpen,
  Clock,
  Send,
  CheckCircle,
  Copy,
  Check,
  Share2,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   TypeScript Interfaces
══════════════════════════════════════════════════════════════════ */

interface AdmissionFormData {
  full_name: string;
  whatsapp: string;
  email: string;
  course: string;
  timing: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success';

/* ══════════════════════════════════════════════════════════════════
   Static Data
══════════════════════════════════════════════════════════════════ */

const INITIAL_FORM: AdmissionFormData = {
  full_name: '',
  whatsapp: '',
  email: '',
  course: '',
  timing: '',
};

const COURSES: string[] = [
  'Nazra tul Quran',
  'Hifz ul Quran',
  'Tajweed Course',
  'Islamic Studies',
];

const TIMINGS: string[] = ['Morning', 'Evening', 'Weekend'];

const WA_MESSAGE =
  'Assalamu Alaikum! 🌟 Admissions are now open at our Quran Academy. Begin your journey of Ilm & Hidayah here: ';

/* ══════════════════════════════════════════════════════════════════
   Shared Input Styles
══════════════════════════════════════════════════════════════════ */

const INPUT_BASE =
  'w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]';

const SELECT_BASE =
  'w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm appearance-none transition-all duration-200 outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]';

/* ══════════════════════════════════════════════════════════════════
   Sub-components
══════════════════════════════════════════════════════════════════ */

function FieldWrapper({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
        {icon}
      </div>
      {children}
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Toast Component
══════════════════════════════════════════════════════════════════ */

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
            Alhamdulillah! 🌙
          </p>
          <p className="text-white/80 text-xs mt-0.5">
            Your application has been received!
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════════════════ */

export default function ApplyPage() {
  const [formData, setFormData]     = useState<AdmissionFormData>(INITIAL_FORM);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [showToast, setShowToast]   = useState<boolean>(false);
  const [copied, setCopied]         = useState<boolean>(false);
  const [pageUrl, setPageUrl]       = useState<string>('');

  /* Capture URL client-side only */
  useEffect(() => {
    setPageUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  /* ── Handlers ── */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitStatus('submitting');

    /* Mock async submit — replace with supabase.from('students').insert() */
    await new Promise<void>((resolve) => setTimeout(resolve, 1400));

    console.log('Application submitted:', formData);

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
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(WA_MESSAGE + pageUrl)}`;

  /* ══════════════════════════════════════════════════════════════
     Render
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: '#f5f5f0' }}>

      {/* Toast */}
      <SuccessToast visible={showToast} />

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a2a22 0%, #0F3E33 60%, #0d3028 100%)' }}
      >
        {/* Islamic pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 8L8 30l22 22 22-22L30 8zM30 16l14 14-14 14-14-14L30 16zm0 6l-8 8 8 8 8-8-8-8z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />

        <div className="relative z-10 text-center py-12 px-6">
          {/* Bismillah */}
          <div className="font-amiri text-3xl md:text-4xl mb-3 leading-relaxed" style={{ color: '#D4AF37' }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
          </div>

          {/* Welcome */}
          <div className="font-amiri text-xl md:text-2xl text-white/60 mb-5">
            مَرْحَبًا بِكُمْ
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            2026 Admissions
          </h1>
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            Join hundreds of students worldwide on a journey of{' '}
            <span style={{ color: '#D4AF37' }}>Ilm</span> and{' '}
            <span style={{ color: '#D4AF37' }}>Hidayah</span>. Fill in your
            details below to secure your place.
          </p>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ╔══ FORM CARD (2/3 width on lg) ══════════════════════ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Card header strip */}
              <div
                className="px-8 py-5 flex items-center gap-3"
                style={{ borderBottom: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.04)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)' }}
                >
                  <BookOpen className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-gray-900 text-lg leading-tight">
                    Admission Form
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">All fields are required</p>
                </div>
              </div>

              {/* ── Success State ── */}
              {submitStatus === 'success' ? (
                <div className="px-8 py-16 flex flex-col items-center text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'rgba(15,62,51,0.08)' }}
                  >
                    <CheckCircle size={48} style={{ color: '#0F3E33' }} strokeWidth={1.5} />
                  </div>
                  <div
                    className="font-amiri text-3xl mb-3"
                    style={{ color: '#D4AF37' }}
                  >
                    الحَمْدُ لِلّٰه
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                    Application Received!
                  </h3>
                  <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                    Alhamdulillah, your application has been received! We will
                    be in touch soon, in sha Allah. 🌙
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
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8 space-y-5">

                  {/* Full Name */}
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <FieldWrapper icon={<User size={17} />}>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        className={INPUT_BASE}
                        placeholder="e.g. Fatima Ahmad"
                      />
                    </FieldWrapper>
                  </div>

                  {/* WhatsApp + Email — side by side on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        WhatsApp Number
                      </label>
                      <FieldWrapper icon={<Phone size={17} />}>
                        <input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          required
                          value={formData.whatsapp}
                          onChange={handleChange}
                          className={INPUT_BASE}
                          placeholder="+92 300 0000000"
                        />
                      </FieldWrapper>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <FieldWrapper icon={<Mail size={17} />}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={INPUT_BASE}
                          placeholder="you@example.com"
                        />
                      </FieldWrapper>
                    </div>
                  </div>

                  {/* Course + Timing — side by side on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Course
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                          <BookOpen size={17} />
                        </div>
                        <select
                          id="course"
                          name="course"
                          required
                          value={formData.course}
                          onChange={handleChange}
                          className={SELECT_BASE}
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
                      <label htmlFor="timing" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Preferred Timing
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                          <Clock size={17} />
                        </div>
                        <select
                          id="timing"
                          name="timing"
                          required
                          value={formData.timing}
                          onChange={handleChange}
                          className={SELECT_BASE}
                        >
                          <option value="" disabled>Select timing…</option>
                          {TIMINGS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </div>
                  </div>

                  {/* Privacy note */}
                  <p className="text-xs text-gray-400 leading-relaxed">
                    🔒 Your details are private, confidential, and used solely
                    for registration and scheduling purposes.
                  </p>

                  {/* ── Submit Button ── */}
                  <div className="pt-2">
                    <button
                      id="apply-submit-btn"
                      type="submit"
                      disabled={submitStatus === 'submitting'}
                      className="group w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-base transition-all duration-300 overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5 active:translate-y-0"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #e8c84a 50%, #D4AF37 100%)',
                        backgroundSize: '200% auto',
                        color: '#0F3E33',
                      }}
                    >
                      {/* Shimmer overlay on hover */}
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
                          <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          <span>Submitting…</span>
                        </>
                      ) : (
                        <>
                          <span className="font-amiri text-xl leading-none">سَجِّل الآن</span>
                          <span className="w-px h-5 bg-[#0F3E33]/20" />
                          <span>Register Now</span>
                          <Send size={17} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ╔══ SHARE CARD (1/3 width on lg, sticky) ═════════════ */}
          <div className="lg:sticky lg:top-24 space-y-4">

            {/* Share card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Card header */}
              <div
                className="px-6 py-5"
                style={{
                  background: 'linear-gradient(135deg, #0F3E33, #1a5c4a)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.2)' }}
                  >
                    <Share2 size={18} style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <div className="font-amiri text-xl leading-none" style={{ color: '#D4AF37' }}>
                      انشُر الخَير
                    </div>
                    <div className="text-white/60 text-xs mt-0.5">Spread the Goodness</div>
                  </div>
                </div>
                <p className="text-white/55 text-xs mt-3 leading-relaxed">
                  Know someone who would benefit from Islamic education? Share
                  this link with family and friends.
                </p>
              </div>

              {/* Card body */}
              <div className="px-6 py-6 space-y-5">

                {/* Copy Link */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
                    <div className="text-white font-extrabold leading-tight">
                      Share on WhatsApp
                    </div>
                    <div className="text-white/70 text-xs font-normal mt-0.5">
                      Invite family &amp; friends
                    </div>
                  </div>
                </a>

                {/* Hadith quote */}
                <div
                  className="rounded-2xl px-4 py-4 text-center"
                  style={{ background: 'rgba(15,62,51,0.04)', border: '1px solid rgba(15,62,51,0.08)' }}
                >
                  <div className="font-amiri text-lg leading-relaxed mb-1" style={{ color: '#0F3E33' }}>
                    مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    &ldquo;Whoever guides someone to goodness will have a reward
                    like one who did it.&rdquo;
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
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
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

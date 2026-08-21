import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Star,
  Globe,
  Award,
  ChevronDown,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quran College | Begin Your Sacred Journey',
  description:
    'Authentic Quranic education rooted in Ilm and Hidayah — from Nazra to Advanced Hifz & Tajweed, for students across the globe. Apply for 2026 intake.',
};

/* ── Static Data ───────────────────────────────────────────────────── */

interface ArabicConcept {
  arabic: string;
  english: string;
  animClass: string;
  position: string;
  size: string;
}

const arabicConcepts: ArabicConcept[] = [
  {
    arabic: 'نُور',
    english: 'Nur · Light',
    animClass: 'animate-float',
    position: 'top-[18%] left-[6%]',
    size: 'text-4xl',
  },
  {
    arabic: 'سَكِينَة',
    english: 'Sakina · Tranquility',
    animClass: 'animate-float-2',
    position: 'top-[22%] right-[8%]',
    size: 'text-2xl',
  },
  {
    arabic: 'اِقْرَأ',
    english: 'Iqra · Read',
    animClass: 'animate-float-3',
    position: 'top-[55%] left-[4%]',
    size: 'text-5xl',
  },
  {
    arabic: 'عِلْم',
    english: 'Ilm · Knowledge',
    animClass: 'animate-float',
    position: 'top-[62%] right-[6%]',
    size: 'text-4xl',
  },
  {
    arabic: 'أُمَّة',
    english: 'Ummah · Community',
    animClass: 'animate-float-2',
    position: 'top-[40%] right-[3%]',
    size: 'text-2xl',
  },
  {
    arabic: 'هِدَايَة',
    english: 'Hidayah · Guidance',
    animClass: 'animate-float-3',
    position: 'bottom-[22%] left-[8%]',
    size: 'text-3xl',
  },
];

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  { value: '500+', label: 'Students Worldwide', icon: <Users size={22} /> },
  { value: '17+',  label: 'Certified Courses',   icon: <BookOpen size={22} /> },
  { value: '50+',  label: 'Countries Reached',   icon: <Globe size={22} /> },
  { value: '5 ★',  label: 'Average Rating',      icon: <Award size={22} /> },
];

interface Course {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  levelBadge: string;
  arabic: string;
  title: string;
  description: string;
  emoji: string;
  cardBg: string;
  accentFrom: string;
  accentTo: string;
}

const courses: Course[] = [
  {
    level: 'Beginner',
    levelBadge: 'bg-emerald-100 text-emerald-800',
    arabic: 'النَّظَرَة',
    title: 'Nazra tul Quran',
    description:
      'Learn to read the Holy Quran with correct pronunciation and basic Tajweed. The essential first step for every student.',
    emoji: '📖',
    cardBg: 'bg-[#0F3E33]',
    accentFrom: '#0F3E33',
    accentTo: '#1a5c4a',
  },
  {
    level: 'Beginner',
    levelBadge: 'bg-emerald-100 text-emerald-800',
    arabic: 'تَجْوِيد',
    title: 'Short Tajweed Course (STC)',
    description:
      'Essential rules of Tajweed in a focused, concise format. Build a strong foundation in the art of Quranic recitation.',
    emoji: '🎵',
    cardBg: 'bg-[#1a5c4a]',
    accentFrom: '#1a5c4a',
    accentTo: '#0F3E33',
  },
  {
    level: 'Intermediate',
    levelBadge: 'bg-amber-100 text-amber-800',
    arabic: 'تَجْوِيد مُفَصَّل',
    title: 'Detailed Tajweed Course (DTC)',
    description:
      'Deep dive into the complete rules of Tajweed with practical application, regular assessments, and personalised correction.',
    emoji: '📚',
    cardBg: 'bg-[#5a4000]',
    accentFrom: '#7a5c00',
    accentTo: '#5a4000',
  },
  {
    level: 'Intermediate',
    levelBadge: 'bg-amber-100 text-amber-800',
    arabic: 'تَرْتِيل',
    title: 'Tarteel ul Quran 24/7',
    description:
      'Continuous melodious recitation with perfected Tajweed. Available around the clock for the truly dedicated learner.',
    emoji: '🌙',
    cardBg: 'bg-[#3a2c00]',
    accentFrom: '#5a4400',
    accentTo: '#3a2c00',
  },
  {
    level: 'Advanced',
    levelBadge: 'bg-purple-100 text-purple-800',
    arabic: 'حِفْظ',
    title: 'Hifz ul Quran',
    description:
      'Complete Quran memorisation program with structured revision, Tajweed correction, and ijazah certification upon completion.',
    emoji: '⭐',
    cardBg: 'bg-[#2d1b69]',
    accentFrom: '#2d1b69',
    accentTo: '#1a0f3a',
  },
  {
    level: 'Advanced',
    levelBadge: 'bg-purple-100 text-purple-800',
    arabic: 'تَفْسِير',
    title: 'Tafseer Program',
    description:
      'In-depth Quranic exegesis covering the 25th–30th Parah with scholarly insights and comprehensive Arabic comprehension.',
    emoji: '🔬',
    cardBg: 'bg-[#1a0f3a]',
    accentFrom: '#1a0f3a',
    accentTo: '#0d0820',
  },
];

interface Testimonial {
  name: string;
  location: string;
  course: string;
  rating: number;
  text: string;
  initial: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Fatima Al-Rashid',
    location: 'Dubai, UAE',
    course: 'Hifz ul Quran',
    rating: 5,
    text: 'SubhanAllah! The teachers are incredibly patient and knowledgeable. I completed my Hifz in 2 years with their structured program. My life has been transformed — forever grateful.',
    initial: 'F',
  },
  {
    name: 'Ahmed Siddiqui',
    location: 'Toronto, Canada',
    course: 'Detailed Tajweed Course',
    rating: 5,
    text: 'As a revert Muslim learning proper Tajweed, I was nervous at first. But the welcoming Ummah here made me feel at home instantly. My recitation has improved beyond recognition.',
    initial: 'A',
  },
  {
    name: 'Mariam Hassan',
    location: 'London, UK',
    course: 'Tafseer Program',
    rating: 5,
    text: 'The Tafseer sessions opened my eyes to depths of meaning I never knew existed. The scholars here have true Ilm. This is the best investment I have ever made for my Akhira.',
    initial: 'M',
  },
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
        style={{ background: 'rgba(15,62,51,0.88)', backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)' }}
            >
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight leading-none">
                Quran College
              </span>
              <span
                className="block text-xs font-medium -mt-0.5"
                style={{ color: '#D4AF37' }}
              >
                Online Institute
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: '#courses',       label: 'Courses' },
              { href: '#testimonials',  label: 'Testimonials' },
              { href: '/portal',        label: 'Student Portal' },
              { href: '/dashboard',     label: 'Teacher' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/75 hover:text-white transition-colors text-sm font-medium"
                style={{ ['--hover-color' as string]: '#D4AF37' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/apply"
            className="inline-flex items-center px-5 py-2.5 font-bold text-sm rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #b8962e)',
              color: '#0F3E33',
              boxShadow: '0 4px 15px rgba(212,175,55,0.25)',
            }}
          >
            Apply Now <ArrowRight size={14} className="ml-1.5" />
          </Link>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(160deg, #0a2a22 0%, #0F3E33 50%, #0d3028 100%)' }}
      >
        {/* Subtle Islamic geometric background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M40 0l40 40-40 40L0 40 40 0zm0 10L10 40l30 30 30-30-30-30zM40 20l20 20-20 20-20-20 20-20zm0 8l-12 12 12 12 12-12-12-12z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Large blurred gold orb — top right */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />
        {/* Large blurred emerald orb — bottom left */}
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1a5c4a, transparent 70%)' }}
        />

        {/* ── Floating Arabic Concept Orbs ── */}
        {arabicConcepts.map((c, i) => (
          <div
            key={i}
            className={`absolute ${c.position} hidden lg:flex flex-col items-center text-center ${c.animClass}`}
          >
            <div
              className="rounded-2xl px-5 py-4 transition-all duration-500 hover:scale-105 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                className={`${c.size} font-bold leading-none font-amiri`}
                style={{ color: '#D4AF37' }}
              >
                {c.arabic}
              </div>
              <div className="text-white/45 text-xs mt-1.5 font-medium tracking-wide">
                {c.english}
              </div>
            </div>
          </div>
        ))}

        {/* ── Hero Content ── */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in-up pb-20">
          {/* Bismillah */}
          <div
            className="font-amiri text-3xl md:text-4xl mb-6 leading-relaxed"
            style={{ color: '#D4AF37', opacity: 0.9 }}
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
          </div>

          {/* Live badge */}
          <div
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
            style={{
              background: 'rgba(212,175,55,0.1)',
              borderColor: 'rgba(212,175,55,0.3)',
              color: '#D4AF37',
            }}
          >
            <span
              className="w-2 h-2 rounded-full mr-2 animate-pulse"
              style={{ background: '#D4AF37' }}
            />
            Admissions Open · 2026 Intake
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Begin Your
            <span className="block text-gold-shimmer">Sacred Journey</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/65 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Authentic Quranic education rooted in{' '}
            <em className="not-italic font-semibold" style={{ color: '#D4AF37' }}>Ilm</em>{' '}
            and{' '}
            <em className="not-italic font-semibold" style={{ color: '#D4AF37' }}>Hidayah</em>{' '}
            — from Nazra to Advanced Hifz &amp; Tajweed, for students across the Ummah.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply"
              id="hero-cta-apply"
              className="group inline-flex items-center justify-center px-8 py-4 font-extrabold text-lg rounded-2xl transition-all duration-300 w-full sm:w-auto hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #c49b28)',
                color: '#0F3E33',
                boxShadow: '0 8px 30px rgba(212,175,55,0.35)',
              }}
            >
              Begin Your Journey
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>

            <Link
              href="#courses"
              id="hero-cta-courses"
              className="inline-flex items-center justify-center px-8 py-4 font-semibold text-lg rounded-2xl transition-all duration-300 w-full sm:w-auto hover:bg-white/5"
              style={{
                border: '2px solid rgba(255,255,255,0.2)',
                color: 'white',
              }}
            >
              Explore Courses
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/35 animate-bounce">
          <span className="text-xs mb-2 tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(15,62,51,0.08)',
                  color: '#0F3E33',
                }}
              >
                {stat.icon}
              </div>
              <div
                className="text-3xl md:text-4xl font-extrabold"
                style={{ color: '#0F3E33' }}
              >
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CURRICULUM ══════════════════════════════════════════════ */}
      <section id="courses" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 text-xs font-bold rounded-full uppercase tracking-widest mb-4"
              style={{ background: 'rgba(15,62,51,0.08)', color: '#0F3E33' }}
            >
              Curriculum
            </span>
            <h2
              className="text-4xl md:text-5xl font-extrabold mb-4"
              style={{ color: '#0F3E33' }}
            >
              From Beginner to{' '}
              <span style={{ color: '#D4AF37' }}>Advanced</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              A structured path through the sacred sciences — wherever you are
              in your journey, we have the perfect course for you.
            </p>
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col"
              >
                {/* Card top */}
                <div
                  className="p-8 relative overflow-hidden flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
                  }}
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />

                  <div className="relative z-10">
                    <div className="text-5xl mb-3">{course.emoji}</div>
                    <div className="text-white/70 text-2xl font-amiri leading-none mb-3">
                      {course.arabic}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${course.levelBadge}`}
                    >
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                    {course.description}
                  </p>
                  <Link
                    href="/apply"
                    className="inline-flex items-center text-sm font-bold transition-colors hover:gap-2"
                    style={{ color: '#0F3E33' }}
                  >
                    Apply for this course{' '}
                    <ArrowRight
                      size={14}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-14">
            <Link
              href="/apply"
              className="inline-flex items-center px-8 py-4 font-bold text-white rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: '#0F3E33' }}
            >
              View All 17+ Courses &amp; Apply{' '}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section
        id="testimonials"
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a2a22 0%, #0F3E33 100%)' }}
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M40 0l40 40-40 40L0 40 40 0zm0 10L10 40l30 30 30-30-30-30zM40 20l20 20-20 20-20-20 20-20zm0 8l-12 12 12 12 12-12-12-12z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 text-xs font-bold rounded-full uppercase tracking-widest mb-4 border"
              style={{
                background: 'rgba(212,175,55,0.15)',
                borderColor: 'rgba(212,175,55,0.3)',
                color: '#D4AF37',
              }}
            >
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Voices from the{' '}
              <span style={{ color: '#D4AF37' }}>Ummah</span>
            </h2>
            <p className="text-white/55 text-lg max-w-2xl mx-auto">
              Real stories from students whose lives have been transformed
              through the power of authentic Quranic knowledge.
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Stars */}
                <div className="flex items-center mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="mr-0.5"
                      style={{ color: '#D4AF37', fill: '#D4AF37' }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/75 text-sm leading-relaxed flex-1 mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center pt-4 border-t border-white/10">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base mr-3 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #b8962e)',
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-white/45 text-xs mt-0.5">
                      {t.location} · {t.course}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════════════ */}
      <section
        className="py-24 px-6"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #c49b28)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="text-4xl font-amiri mb-6 leading-relaxed"
            style={{ color: '#0F3E33', opacity: 0.85 }}
          >
            اِقْرَأ بِاسْمِ رَبِّكَ الَّذِي خَلَق
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: '#0F3E33' }}
          >
            Your Journey Starts Today
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(15,62,51,0.7)' }}
          >
            Join hundreds of students from over 50 countries. Applications are
            open for the 2026 intake. Secure your place in the Ummah&apos;s
            greatest institution.
          </p>
          <Link
            href="/apply"
            id="banner-cta-apply"
            className="inline-flex items-center px-10 py-5 font-extrabold text-lg rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: '#0F3E33',
              color: 'white',
              boxShadow: '0 8px 30px rgba(15,62,51,0.3)',
            }}
          >
            Start Your Application{' '}
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer
        className="py-12 px-6 text-white/45"
        style={{ background: '#0a2a22' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)' }}
              >
                <BookOpen className="text-white" size={16} />
              </div>
              <span className="text-white font-bold text-lg">Quran College</span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                { href: '/apply',     label: 'Apply' },
                { href: '/portal',    label: 'Student Portal' },
                { href: '/check-in',  label: 'Check In' },
                { href: '/dashboard', label: 'Teacher Dashboard' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
            © {new Date().getFullYear()} Quran College. All rights reserved.
            &nbsp;May Allah bless this endeavour. 🌙
          </div>
        </div>
      </footer>
    </div>
  );
}

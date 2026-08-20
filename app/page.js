import Link from 'next/link';
import { ArrowRight, BookOpen, Globe, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Navbar */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Quran College</span>
        </div>
        <div>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mr-6">
            Teacher Portal
          </Link>
          <Link 
            href="/apply" 
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
          >
            Apply Now
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative w-full bg-gradient-to-br from-blue-900 to-indigo-800 text-white py-24 px-6 md:px-12 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
          
          <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Embark on Your <span className="text-blue-300">Sacred Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light">
              Our mission is to provide profound, accessible, and authentic Islamic education to students worldwide, nurturing both the mind and the soul.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/apply" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-900 bg-white rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
              >
                Start Your Application
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link 
                href="#courses" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-blue-400 rounded-full hover:bg-blue-800 transition-all w-full sm:w-auto"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </section>

        {/* Features/Stats Section */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Global Reach</h3>
              <p className="text-gray-600">Join a diverse community of students from across the globe learning together online.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Expert Teachers</h3>
              <p className="text-gray-600">Learn directly from qualified and experienced scholars dedicated to your success.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Certified Courses</h3>
              <p className="text-gray-600">Receive formal certification upon successful completion of your academic programs.</p>
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section id="courses" className="py-20 px-6 md:px-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Popular Programs</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our structured curriculum designed for all levels of knowledge.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Course Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-arabic text-4xl">
                    القرآن الكريم
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quran Memorization</h3>
                  <p className="text-gray-600 mb-6 text-sm">Structured Hifz program with regular review and Tajweed perfection.</p>
                  <Link href="/apply" className="text-teal-600 font-semibold hover:text-teal-700 inline-flex items-center">
                    Apply for this course <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-arabic text-4xl">
                    تجويد
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tajweed Fundamentals</h3>
                  <p className="text-gray-600 mb-6 text-sm">Learn the precise pronunciation and rules of reciting the Holy Quran.</p>
                  <Link href="/apply" className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center">
                    Apply for this course <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Course Card 3 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-arabic text-4xl">
                    لغة عربية
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Arabic Language</h3>
                  <p className="text-gray-600 mb-6 text-sm">Comprehensive Arabic studies focusing on grammar, reading, and understanding.</p>
                  <Link href="/apply" className="text-purple-600 font-semibold hover:text-purple-700 inline-flex items-center">
                    Apply for this course <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 md:px-12 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen size={20} />
            <span className="text-lg font-bold text-white tracking-tight">Quran College</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Quran College. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

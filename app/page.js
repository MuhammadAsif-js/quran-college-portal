import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Welcome to Quran Class
        </h1>
        <p className="text-xl text-gray-600">
          Begin your journey with us. Applications for the new semester are now open.
        </p>
        <div className="pt-4">
          <Link 
            href="/apply" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Apply Now
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

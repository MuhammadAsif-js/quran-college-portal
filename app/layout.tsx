import type { Metadata } from 'next';
import { Geist, Geist_Mono, Amiri } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Quran Institute | Authentic Islamic Education',
    template: '%s | Quran Institute',
  },
  description:
    'Join thousands of students worldwide in authentic Quran education. Expert teachers, certified courses in Tajweed, Hifz, and Islamic Studies.',
  keywords: ['Quran', 'Tajweed', 'Hifz', 'Islamic education', 'online Quran classes'],
  openGraph: {
    title: 'Quran Institute | Authentic Islamic Education',
    description:
      'Certified online Quran education for students across the globe. Tajweed, Hifz, Tafseer, and more.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Your main app content */}
        <div className="flex-grow">
          {children}
        </div>

        {/* The Zero Flint Footer */}
        <footer className="w-full py-4 text-center text-sm font-medium bg-[#0F3E33] border-t border-white/10 mt-auto">
          <p className="text-white/70">
            ⚡ Powered by{' '}
            <a href="/developer" className="text-[#D4AF37] font-bold hover:text-white transition-all">
              Zero Flint
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}

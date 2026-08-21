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
    default: 'Quran College | Authentic Islamic Education',
    template: '%s | Quran College',
  },
  description:
    'Join thousands of students worldwide in authentic Quran education. Expert teachers, certified courses in Tajweed, Hifz, and Islamic Studies.',
  keywords: ['Quran', 'Tajweed', 'Hifz', 'Islamic education', 'online Quran classes'],
  openGraph: {
    title: 'Quran College | Authentic Islamic Education',
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

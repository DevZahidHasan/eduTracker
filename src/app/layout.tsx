import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StoreProvider from '../components/StoreProvider';
import { GlobalErrorListener } from '@/components/layout/GlobalErrorListener';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EduTracker - Student Management System',
  description:
    'A simple student management system built by zahid hasan for educational institutions to track attendance, manage marks, and oversee students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <GlobalErrorListener />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ToasterProvider from '../components/ToasterProvider';
import StoreProvider from '../components/StoreProvider';
import { GlobalErrorListener } from '@/components/layout/GlobalErrorListener';
import SilentAuth from '@/components/auth/SilentAuth';
import { ThemeProvider } from '@/components/ThemeProvider';
import NextTopLoader from 'nextjs-toploader';

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
        <NextTopLoader 
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        <StoreProvider>
          <SilentAuth>
            <ThemeProvider>
              <GlobalErrorListener />
              <ToasterProvider />
              {children}
            </ThemeProvider>
          </SilentAuth>
        </StoreProvider>
      </body>
    </html>
  );
}

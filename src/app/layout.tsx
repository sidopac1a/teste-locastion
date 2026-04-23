import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'نظام تتبع مواقع الموظفين | Employee Tracking System',
  description: 'نظام احترافي لإدارة فرق العمل الميدانية ومتابعة مواقع الموظفين بشكل لحظي',
  keywords: ['تتبع الموظفين', 'GPS', 'إدارة الفرق', 'مواقع الموظفين', 'نظام تتبع'],
  authors: [{ name: 'Your Company' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'نظام تتبع مواقع الموظفين',
    description: 'نظام احترافي لإدارة فرق العمل الميدانية',
    type: 'website',
    locale: 'ar_SA',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-left"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'inherit',
                direction: 'rtl',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: '#dcfce7',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                },
              },
              error: {
                style: {
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

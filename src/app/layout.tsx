import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import ErrorHandler from '@/components/ErrorHandler';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cyberix Admin - Security Management Dashboard',
  description: 'Advanced security management dashboard with real-time monitoring, vulnerability assessment, and push notifications',
  keywords: 'cybersecurity, security dashboard, vulnerability scanning, admin panel, push notifications',
  authors: [{ name: 'Cyberix Team' }],
  creator: 'Cyberix',
  publisher: 'Cyberix',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo/icons8-security-shield-64.png',
    shortcut: '/logo/icons8-security-shield-64.png',
    apple: '/logo/icons8-security-shield-64.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Synergy Cyberix Admin',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://admin.synergycyberix.com',
    title: 'Synergy Cyberix Admin - Security Management Dashboard',
    description: 'Advanced security management dashboard with real-time monitoring and push notifications',
    siteName: 'Synergy Cyberix Admin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synergy Cyberix Admin - Security Management Dashboard',
    description: 'Advanced security management dashboard with real-time monitoring and push notifications',
    creator: '@synergycyberix',
  },
};

// Viewport configuration for Next.js 15+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              <ErrorHandler>
                {children}
              </ErrorHandler>
              <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  zIndex: 999999,
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#12b76a', // success-500
                    color: '#ffffff',
                    border: '1px solid #039855', // success-600
                  },
                  iconTheme: {
                    primary: '#ffffff',
                    secondary: '#12b76a',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#f04438', // error-500
                    color: '#ffffff',
                    border: '1px solid #d92d20', // error-600
                  },
                  iconTheme: {
                    primary: '#ffffff',
                    secondary: '#f04438',
                  },
                },
                loading: {
                  style: {
                    background: '#6b7280', // grey-500
                    color: '#ffffff',
                    border: '1px solid #4b5563', // grey-600
                  },
                  iconTheme: {
                    primary: '#ffffff',
                    secondary: '#6b7280',
                  },
                },
              }}
              containerStyle={{
                zIndex: 999999,
                position: 'fixed',
                top: '20px',
                right: '20px',
              }}
            />
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

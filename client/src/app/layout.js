'use client';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AIChatbot from '@/components/ai/AIChatbot';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const authRoutes = ['/login', '/register', '/admin/login', '/forgot-password', '/reset-password'];
  const isLandingPage = pathname === '/';
  const isAuthPage = authRoutes.includes(pathname);
  const showNavAndSidebar = !isLandingPage && !isAuthPage;

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>
              <LanguageProvider>
                <div className="flex min-h-screen bg-white dark:bg-secondary transition-colors duration-300">
                {showNavAndSidebar && <Sidebar />}
                <main className={`flex-1 min-h-screen flex flex-col ${showNavAndSidebar ? 'ml-64' : ''}`}>
                  {showNavAndSidebar && <Navbar />}
                  <div className={showNavAndSidebar ? 'p-8 page-transition' : ''}>
                    {children}
                  </div>
                </main>
                <AIChatbot />
              </div>
              </LanguageProvider>
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

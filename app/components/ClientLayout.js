'use client';

import { usePathname } from 'next/navigation';
import Navbar from './ui/Navbar';
import Footer from './ui/Footer';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show main navbar on dashboard pages
  const isDashboardPage = pathname?.includes('-dashboard') || pathname?.includes('/admin');
  
  return (
    <>
      {!isDashboardPage && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isDashboardPage && <Footer />}
    </>
  );
}

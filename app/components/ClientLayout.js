'use client';

import { usePathname } from 'next/navigation';
import Navbar from './ui/Navbar';
import Footer from './ui/Footer';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Only show navbar and footer on the homepage
  const isHomePage = pathname === '/';
  
  return (
    <>
      {isHomePage && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {isHomePage && <Footer />}
    </>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MediMate - For Patients. For Doctors.",
  description: "Streamline appointment booking, report sharing, and communication between clinics and patients.",
  keywords: "healthcare, appointment booking, medical reports, doctor-patient communication",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Filter out browser extension console spam
              if (typeof window !== 'undefined') {
                const originalLog = console.log;
                const originalError = console.error;
                
                console.log = function(...args) {
                  const message = args.join(' ');
                  if (message.includes('getEmbedInfo') || 
                      message.includes('NO OEMBED') || 
                      message.includes('content.js') ||
                      message.includes('Iterable')) {
                    return; // Skip these browser extension errors
                  }
                  originalLog.apply(console, args);
                };
                
                console.error = function(...args) {
                  const message = args.join(' ');
                  if (message.includes('getEmbedInfo') || 
                      message.includes('NO OEMBED') || 
                      message.includes('content.js') ||
                      message.includes('Iterable')) {
                    return; // Skip these browser extension errors
                  }
                  originalError.apply(console, args);
                };
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

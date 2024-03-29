import Navbar from '@/components/NavBar';
import Providers from '@/components/Providers';
import { cn, constructMetadata } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = constructMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className={cn('relative h-full font-sans antialiased', inter.className)}>
        <main className="relative flex min-h-screen flex-col">
          <Providers>
            <Navbar />
            <div className="flex-1 grow">{children}</div>
          </Providers>
          <Footer />
        </main>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

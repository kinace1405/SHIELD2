import type { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { LayoutProvider } from '@/components/layout/providers/LayoutProvider';
import MainLayout from '@/components/layout/MainLayout';
import { ThemeProvider } from 'next-themes';
import { Montserrat } from 'next/font/google';
import '@/styles/globals.css';

// Font configuration
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
});

export default function App({ Component, pageProps, router }: AppProps) {
  // Routes that don't use the main layout
  const noLayoutRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
  const useMainLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <LayoutProvider>
          <div className={`${montserrat.variable} font-sans`}>
            {useMainLayout ? (
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            ) : (
              <Component {...pageProps} />
            )}
            <Toaster />
          </div>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLayoutProvider } from './providers/LayoutProvider';
import Sidebar from './Navigation/Sidebar';
import Header from './Navigation/Header';
import { useAuth } from '@/context/auth-context';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useLayoutProvider();

  // Public routes that don't require authentication or the main layout
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  // Handle auth redirects
  useEffect(() => {
    if (!authLoading) {
      if (!user && !isPublicRoute) {
        router.push('/login');
      }
      if (user && isPublicRoute && router.pathname !== '/') {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router.pathname]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer could be added here if needed */}
      </div>
    </div>
  );
};

export default MainLayout;

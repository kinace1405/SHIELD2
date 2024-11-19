import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const router = useRouter();
  const { user, loading, subscription } = useAuth();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/login?redirect=${router.asPath}`);
      } else if (requiredRole && !requiredRole.includes(user.role)) {
        router.push('/unauthorized');
      } else {
        setVerified(true);
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading || !verified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-custom-purple animate-spin mx-auto" />
          <p className="mt-2 text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;

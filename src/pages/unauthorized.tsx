import { useRouter } from 'next/router';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <Shield className="w-16 h-16 text-custom-purple mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this page.
        </p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}

// Mark as public page
Unauthorized.requireAuth = false;

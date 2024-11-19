import { useContext, useCallback } from 'react';
import { AuthContext } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const refreshSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return session;
  }, []);

  const getRedirectUrl = useCallback((path: string) => {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}${path}`;
  }, []);

  return {
    ...context,
    refreshSession,
    getRedirectUrl,
  };
}

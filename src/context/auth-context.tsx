import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import type { 
  AuthContextType, 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData
} from '@/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const userData = session?.user;
        if (userData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.id)
            .single();

          setUser({
            id: userData.id,
            email: userData.email!,
            emailVerified: userData.email_confirmed_at != null,
            firstName: profile?.first_name,
            lastName: profile?.last_name,
            company: profile?.company,
            role: profile?.role,
            metadata: userData.user_metadata,
            lastLogin: new Date(userData.last_sign_in_at || Date.now()),
            createdAt: new Date(userData.created_at),
            updatedAt: new Date(profile?.updated_at || Date.now())
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          emailVerified: session.user.email_confirmed_at != null,
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          company: profile?.company,
          role: profile?.role,
          metadata: session.user.user_metadata,
          lastLogin: new Date(session.user.last_sign_in_at || Date.now()),
          createdAt: new Date(session.user.created_at),
          updatedAt: new Date(profile?.updated_at || Date.now())
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login({ email, password, remember }: LoginCredentials) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          shouldCreateUser: false
        }
      });
      
      if (error) throw error;

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      setLoading(true);
      
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            company: credentials.company
          }
        }
      });

      if (signUpError) throw signUpError;

      if (newUser) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: newUser.id,
              first_name: credentials.firstName,
              last_name: credentials.lastName,
              company: credentials.company,
              phone_number: credentials.phoneNumber,
              company_size: credentials.companySize
            }
          ]);

        if (profileError) throw profileError;
      }

      router.push('/auth/verify-email');
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword({ email }: ForgotPasswordData) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword({ password, token }: ResetPasswordData) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      router.push('/auth/login');
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmail({ token }: VerifyEmailData) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });
      
      if (error) throw error;
      
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(data: Partial<AuthUser>) {
    try {
      setLoading(true);
      
      // Update auth metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          company: data.company
        }
      });

      if (userError) throw userError;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          company: data.company,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Update local user state
      if (user) {
        setUser({
          ...user,
          ...data,
          updatedAt: new Date()
        });
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

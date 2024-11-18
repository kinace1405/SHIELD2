import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700">
          <div className="w-8 h-8 rounded-full bg-custom-purple flex items-center justify-center">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-white">
              {user?.email}
            </p>
            <p className="text-xs text-gray-400">
              {user?.role || 'User'}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className="cursor-pointer"
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-500 focus:text-red-500"
          disabled={loading}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {loading ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

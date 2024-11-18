import { useRouter } from 'next/router';
import Link from 'next/link';
import { Shield, Home, MessageSquare, FileText, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useSubscription } from '@/hooks/useSubscription';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { subscription } = useSubscription();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      requiresSubscription: false
    },
    {
      name: 'SHIELD',
      href: '/shield',
      icon: Shield,
      requiresSubscription: true
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      requiresSubscription: true
    },
    {
      name: 'Team',
      href: '/team',
      icon: Users,
      requiresSubscription: true
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      requiresSubscription: false
    }
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64
        transform transition-transform duration-200 ease-in-out
        bg-gray-800/50 border-r border-gray-700
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="h-16 px-4 flex items-center border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-custom-purple" />
          <span className="text-xl font-bold text-white">Senator Safety</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = router.pathname.startsWith(item.href);
          const isDisabled = item.requiresSubscription && !subscription?.isActive;

          return (
            <Link
              key={item.name}
              href={isDisabled ? '/subscription' : item.href}
              className={`
                flex items-center px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive 
                  ? 'bg-custom-purple text-white' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                  router.push('/subscription');
                }
              }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

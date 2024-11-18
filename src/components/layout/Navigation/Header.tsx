import { Menu } from 'lucide-react';
import { useLayoutProvider } from '../providers/LayoutProvider';
import UserMenu from './UserMenu';
import NotificationsDropdown from './NotificationsDropdown';

const Header = () => {
  const { setSidebarOpen, isMobile } = useLayoutProvider();

  return (
    <header className="h-16 bg-gray-800/50 border-b border-gray-700">
      <div className="h-full px-4 flex items-center justify-between">
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <div className="flex items-center space-x-4">
          <NotificationsDropdown />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

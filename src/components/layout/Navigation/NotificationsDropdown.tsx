import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Notification } from '@/types/notification.types';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="relative p-2 text-gray-400 hover:text-white">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-custom-purple text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h3 className="text-lg font-medium text-white mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No notifications
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`
                    cursor-pointer p-3 rounded-lg
                    ${notification.read ? 'opacity-75' : ''}
                  `}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div>
                    <p className="text-sm text-white">{notification.title}</p>
                    <p className="text-xs text-gray-400">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <div className="border-t border-gray-700 mt-2 pt-2">
              <button
                onClick={() => {/* Implement mark all as read */}}
                className="text-sm text-custom-purple hover:text-custom-purple/80 w-full text-center py-2"
              >
                Mark all as read
              </button>
              <button
                onClick={() => {/* Navigate to notifications page */}}
                className="text-sm text-gray-400 hover:text-white w-full text-center py-2"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;

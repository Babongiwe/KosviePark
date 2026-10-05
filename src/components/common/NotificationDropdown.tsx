import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Check, ExternalLink, ShieldAlert, FileCheck, XCircle, Clock } from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsRead,
    setCurrentScreen,
    unreadNotificationCount,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter notifications relevant to current user role
  const userNotifications = notifications.filter((n) => {
    if (!currentUser) return false;
    // Role scoping: only show notifications meant for this role (or everyone)
    if (n.targetRole && n.targetRole !== 'all' && n.targetRole !== currentUser.role) return false;
    if (n.targetUserId === 'all') return true;
    if (currentUser.role === 'admin' && (n.targetUserId === 'admin' || n.targetUserId === currentUser.id)) return true;
    if (currentUser.role === 'security' && (n.targetUserId === 'security' || n.targetUserId === currentUser.id)) return true;
    return n.targetUserId === currentUser.id;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'permit_approval':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      case 'permit_rejection':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'security_alert':
      case 'grace_period_warning':
      case 'fine_issued':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleNotificationClick = (notif: typeof userNotifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.type === 'permit_approval' || notif.type === 'permit_rejection') {
      setCurrentScreen('my_permits');
    } else if (notif.type === 'security_alert' || notif.type === 'grace_period_warning') {
      if (currentUser?.role === 'security') {
        setCurrentScreen('grace_periods');
      } else {
        setCurrentScreen('dashboard');
      }
    } else if (notif.type === 'fine_issued') {
      if (currentUser?.role === 'security' || currentUser?.role === 'admin') {
        setCurrentScreen('violations');
      } else {
        setCurrentScreen('dashboard');
      }
    } else if (currentUser?.role === 'admin') {
      setCurrentScreen('permit_applications');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-blue-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-blue-950 shadow-sm animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm font-heading">Notifications</span>
              <span className="text-[11px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full font-medium">
                {userNotifications.length}
              </span>
            </div>
            {unreadNotificationCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {userNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications right now
              </div>
            ) : (
              userNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                    !notif.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold truncate ${!notif.isRead ? 'text-blue-950 font-bold' : 'text-slate-800'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp.split(' ')[1] || notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setCurrentScreen('notifications');
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center justify-center gap-1 w-full py-1"
            >
              <span>View all notifications</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

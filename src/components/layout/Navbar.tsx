import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut } from 'lucide-react';
import { NotificationDropdown } from '../common/NotificationDropdown';
import type { UserRole } from '../../types';

type NavItem = { id: string; label: string };

// Navigation per role (matches the screen list in the specification)
const NAV: Record<UserRole, NavItem[]> = {
  student: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my_permits', label: 'My Permit' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'bay_availability', label: 'Parking Zones' },
    { id: 'my_fines', label: 'My Fines' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'profile', label: 'Profile' },
  ],
  staff: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my_permits', label: 'My Permit' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'bay_availability', label: 'Parking Zones' },
    { id: 'my_fines', label: 'My Fines' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'profile', label: 'Profile' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'permit_applications', label: 'Applications' },
    { id: 'permits', label: 'Permits' },
    { id: 'zones', label: 'Zones' },
    { id: 'visitor_admin', label: 'Visitor Parking' },
    { id: 'violations', label: 'Compliance' },
    { id: 'notifications', label: 'Notifications' },
  ],
  security: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'vehicle_lookup', label: 'Vehicle Check' },
    { id: 'alpr_simulator', label: 'ALPR Scans' },
    { id: 'grace_periods', label: 'Grace Periods' },
    { id: 'violations', label: 'Violations' },
    { id: 'zones', label: 'Zones' },
    { id: 'notifications', label: 'Notifications' },
  ],
  visitor: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'visitor_portal', label: 'Request Permit' },
    { id: 'visitor_lookup', label: 'My Request & Pass' },
    { id: 'notifications', label: 'Notifications' },
  ],
};

export const Navbar: React.FC = () => {
  const { logout, currentUser, activeRole, currentScreen, setCurrentScreen } = useApp();
  const items = NAV[activeRole] ?? [];
  const roleLabel: Record<UserRole, string> = {
    student: 'Student',
    staff: 'Staff',
    admin: 'Administrator',
    security: 'Campus Security',
    visitor: 'Visitor',
  };

  return (
    <header className="sticky top-0 z-40 select-none shadow-sm bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-tight text-[#002B49] leading-tight">KovsiePark</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight truncate">
              Smart Parking &amp; Permit Management
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser && (
              <span className="hidden sm:block text-right leading-tight">
                <span className="block text-xs font-semibold text-slate-700 truncate max-w-[180px]">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#C8102E]">
                  {roleLabel[activeRole]}
                </span>
              </span>
            )}
            <NotificationDropdown />
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg text-[#C8102E] hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors font-bold text-xs cursor-pointer"
              title="Sign out of KovsiePark"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Role-based navigation */}
        <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {items.map((item) => {
            const active =
              currentScreen === item.id ||
              (item.id === 'my_permits' && currentScreen === 'apply_permit');
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#002B49] text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#002B49]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

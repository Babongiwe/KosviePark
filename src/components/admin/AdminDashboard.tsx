import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  CreditCard,
  MapPin,
  CalendarCheck,
  Wallet,
  Bell,
  UserPlus,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { applications, permits, visitorReservations, setCurrentScreen, currentUser } = useApp();

  const pendingApplications = applications.filter((a) => a.status === 'pending').length;
  const activePermits = permits.filter((p) => p.status === 'active').length;
  const pendingVisitors = visitorReservations.filter((v) => v.status === 'pending').length;

  const tiles = [
    {
      id: 'permit_applications',
      label: 'Approve / Reject Permits',
      description: 'Review pending student and staff permit applications',
      icon: ClipboardList,
      badge: pendingApplications > 0 ? `${pendingApplications} PENDING` : undefined,
    },
    {
      id: 'permits',
      label: 'Permit Registry & Validity',
      description: 'Search, track and renew all issued permits',
      icon: CreditCard,
      badge: `${activePermits} ACTIVE`,
    },
    {
      id: 'zones',
      label: 'Zones & Rules',
      description: 'Define parking zones, bays and restriction rules',
      icon: MapPin,
    },
    {
      id: 'visitor_admin',
      label: 'Visitor Requests',
      description: 'Approve or reject visitor permits, reserve bays, cancel bookings',
      icon: CalendarCheck,
      badge: pendingVisitors > 0 ? `${pendingVisitors} PENDING` : undefined,
    },
    {
      id: 'register_visitor',
      label: 'Register Visitor',
      description: 'Assisted visitor pre-registration with temporary permit',
      icon: UserPlus,
    },
    {
      id: 'violations',
      label: 'Violations & Fines',
      description: 'View violations, citations and fines',
      icon: Wallet,
    },
    {
      id: 'notifications',
      label: 'Send Notifications',
      description: 'Notify users about decisions, expiries and alerts',
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#002B49] text-white flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6 text-amber-300" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Signed in as <strong className="text-slate-700">{currentUser?.name}</strong> • Permit lifecycle, zones, visitors and fines
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tiles — mirrors the sidebar navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => setCurrentScreen(tile.id)}
              className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-[#002B49]/40 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B49] flex items-center justify-center group-hover:bg-[#002B49] group-hover:text-amber-300 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#002B49] transition-colors" />
              </div>
              <h3 className="mt-3 font-bold text-sm text-slate-900">{tile.label}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tile.description}</p>
              {tile.badge && (
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {tile.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

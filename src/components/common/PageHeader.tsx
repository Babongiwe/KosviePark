import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  backTo = 'dashboard',
  backLabel = 'Back to Dashboard',
}) => {
  const { currentScreen, setCurrentScreen } = useApp();

  const isDashboard = currentScreen === 'dashboard';

  const screenTitleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    my_permits: 'My Digital Permit',
    apply_permit: 'Apply for Permit',
    vehicles: 'Registered Vehicles',
    permit_applications: 'Permit Applications Queue',
    permits: 'Permit Registry',
    zones: 'Parking Zone Manager',
    visitor_admin: 'Visitor Reservations',
    alpr_simulator: 'ALPR Scanner Simulator',
    vehicle_lookup: 'Vehicle Lookup',
    grace_periods: 'Active Grace Periods',
    violations: 'Violations & Fines',
    visitor_portal: 'Visitor Pre-Registration',
    visitor_lookup: 'Visitor Pass Lookup',
    profile: 'Account Profile',
    notifications: 'Notifications',
  };

  return (
    <div className="mb-6 space-y-3 select-none">
      {/* Breadcrumb Bar with Back Arrow */}
      {!isDashboard && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {/* Direct Back Arrow Button */}
            <button
              onClick={() => setCurrentScreen(backTo)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#002B49] hover:bg-amber-50 hover:border-amber-400 hover:text-blue-950 transition-all shadow-2xs group cursor-pointer"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-[#C8102E] group-hover:-translate-x-0.5 transition-transform" />
              <span>{backLabel}</span>
            </button>

            {/* Breadcrumb chain */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="hover:text-[#002B49] flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>Dashboard</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-semibold text-slate-800">
                {screenTitleMap[currentScreen] || title}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden md:inline-flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>University of the Free State Smart Parking</span>
          </div>
        </div>
      )}

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {!isDashboard && (
              <button
                onClick={() => setCurrentScreen(backTo)}
                className="sm:hidden p-1.5 rounded-lg bg-slate-200/80 text-slate-700 hover:bg-slate-300 transition-colors"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-slate-600 mt-1">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

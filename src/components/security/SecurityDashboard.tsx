import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Search,
  Timer,
  AlertOctagon,
  UserPlus,
  MapPin,
  Bell,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const { violations, setCurrentScreen, currentUser } = useApp();

  const activeGraceCount = violations.filter((v) => v.status === 'grace_period_active').length;
  const activeFinesCount = violations.filter((v) => v.status === 'fine_issued').length;

  const tiles = [
    {
      id: 'alpr_simulator',
      label: 'ALPR Live Simulator',
      description: 'Simulate gate camera scans and boom access decisions',
      icon: Camera,
    },
    {
      id: 'vehicle_lookup',
      label: 'Verify Permit Validity',
      description: 'Look up any plate against the permit and visitor registry',
      icon: Search,
    },
    {
      id: 'grace_periods',
      label: 'Active Grace Periods',
      description: 'Monitor 15-minute unauthorized parking countdowns',
      icon: Timer,
      badge: activeGraceCount > 0 ? `${activeGraceCount} ACTIVE` : undefined,
    },
    {
      id: 'violations',
      label: 'Violations & Fines',
      description: 'Issue and manage campus parking citations',
      icon: AlertOctagon,
      badge: activeFinesCount > 0 ? `${activeFinesCount} FINES` : undefined,
    },
    {
      id: 'zones',
      label: 'Zone Occupancy',
      description: 'Live bay occupancy across monitored parking zones',
      icon: MapPin,
    },
    {
      id: 'notifications',
      label: 'Security Alerts',
      description: 'Enforcement alerts and gate activity notices',
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#002B49] text-white flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-amber-300" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Security Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Signed in as <strong className="text-slate-700">{currentUser?.name}</strong> • ALPR enforcement, grace periods and violations
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

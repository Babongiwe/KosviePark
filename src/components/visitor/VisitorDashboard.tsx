import React from 'react';
import { useApp } from '../../context/AppContext';
import { useMyVisitorRequests } from './VisitorLookup';
import { StatusBadge } from '../common/StatusBadge';
import { FilePlus, ClipboardCheck, QrCode, XCircle, Bell, ArrowRight, User } from 'lucide-react';

export const VisitorDashboard: React.FC = () => {
  const { currentUser, setCurrentScreen, myNotifications } = useApp();
  const mine = useMyVisitorRequests();
  const latest = mine[0];
  const unread = myNotifications.filter((n) => !n.isRead).length;
  const active = mine.find((r) => r.status === 'confirmed' || r.status === 'checked-in' || r.status === 'checked_in');

  const tiles = [
    { id: 'visitor_portal', label: 'Request Temporary Permit', description: 'Give your details and vehicle info', icon: FilePlus },
    {
      id: 'visitor_lookup',
      label: 'My Request, Bay & Pass',
      description: active
        ? `${active.status.toUpperCase()} • ${active.zoneName} • Bay ${active.assignedBayNumber} — view pass or cancel`
        : 'Track your request status, see your bay & pass once approved, or cancel',
      icon: ClipboardCheck,
      badge: latest ? latest.status.toUpperCase() : undefined,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Approvals, rejections and reminders',
      icon: Bell,
      badge: unread ? `${unread} NEW` : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#002B49] text-white flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-amber-300" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Visitor Dashboard</h1>
          <p className="mt-1 text-xs text-slate-500">
            Signed in as <strong className="text-slate-700">{currentUser?.name}</strong>
          </p>
        </div>
        {latest && <StatusBadge status={latest.status} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.label}
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

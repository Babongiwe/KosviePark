import React from 'react';
import { useApp } from '../../context/AppContext';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { StatusBadge } from '../common/StatusBadge';
import {
  Timer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Shield,
  Car,
} from 'lucide-react';

export const GracePeriodManager: React.FC = () => {
  const { violations, resolveGracePeriod, escalateGracePeriodToFine } = useApp();

  const activeGraceList = violations.filter((v) => v.status === 'grace_period_active');
  const pastGraceList = violations.filter((v) => v.status !== 'grace_period_active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Active Grace Periods Enforcement
            </h2>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
              {activeGraceList.length} In Progress
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            UFS 15-minute courtesy window for vehicles scanned in unauthorized zones before an official citation (fine) is issued
          </p>
        </div>
      </div>

      {/* Active Countdowns Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
          Live Counting Timers ({activeGraceList.length})
        </h3>

        {activeGraceList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No Active Grace Period Warnings</p>
            <p className="mt-1">All vehicles on campus are currently verified and authorized.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGraceList.map((item) => {
              const remSec = item.gracePeriodRemainingSeconds ?? 900;
              const minutes = Math.floor(remSec / 60);
              const seconds = remSec % 60;
              const totalSec = 15 * 60;
              const progressPercent = Math.max(
                0,
                Math.round((remSec / totalSec) * 100)
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-amber-300 shadow-md p-6 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded tracking-wider">
                          15-MIN COURTESY WINDOW
                        </span>
                        <h4 className="font-bold text-base text-slate-900 mt-1.5">
                          {item.violationType}
                        </h4>
                        <p className="text-xs text-slate-500">{item.zoneName}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-2xl font-extrabold text-amber-700">
                          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</span>
                      </div>
                    </div>

                    {/* License Plate & Vehicle */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <SouthAfricanPlate plateNumber={item.vehicleRegistration} size="md" />
                      <div className="text-right text-xs">
                        <p className="font-bold text-slate-800">{item.vehicleMakeModel}</p>
                        <p className="text-[11px] text-slate-500">Scanned: {item.timestamp}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
                        <span>Timer countdown</span>
                        <span>{item.gracePeriodRemainingSeconds}s left</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => resolveGracePeriod(item.id, 'cleared')}
                      className="w-1/2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors text-center"
                    >
                      Dismiss (Vehicle Left)
                    </button>
                    <button
                      onClick={() => escalateGracePeriodToFine(item.id)}
                      className="w-1/2 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors text-center"
                    >
                      Issue Citation ({item.zoneName.includes('Accessible / Disability Concourse') ? 'R500' : 'R350'})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Grace Period Resolutions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 font-heading">
            Past Grace Period Resolutions
          </h3>
          <span className="text-xs text-slate-400">Security Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Zone Scanned</th>
                <th className="py-3 px-4">Type of Warning</th>
                <th className="py-3 px-4">Resolution Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastGraceList.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono text-slate-500">{g.timestamp}</td>
                  <td className="py-3 px-4">
                    <SouthAfricanPlate plateNumber={g.vehicleRegistration} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{g.zoneName}</td>
                  <td className="py-3 px-4 text-slate-600">{g.violationType}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={g.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

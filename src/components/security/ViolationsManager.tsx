import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import {
  AlertOctagon,
  Search,
  CheckCircle2,
  DollarSign,
  FileText,
  Clock,
  Shield,
} from 'lucide-react';

export const ViolationsManager: React.FC = () => {
  const { violations, settleViolation } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredViolations = violations.filter((v) => {
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.vehicleRegistration.toLowerCase().includes(term) ||
      v.fineReferenceNumber?.toLowerCase().includes(term) ||
      v.zoneName.toLowerCase().includes(term) ||
      (v.violationType ?? "").toLowerCase().includes(term)
    );
  });

  const totalFines = violations.filter((v) => v.status === 'fine_issued').length;
  const totalPaid = violations.filter((v) => v.status === 'paid').length;
  const totalFineValue = violations
    .filter((v) => v.status === 'fine_issued')
    .reduce((sum, v) => sum + (v.fineAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Violations, Citations & Fines
            </h2>
            <span className="bg-rose-100 text-rose-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalFines} Outstanding Fines (R{totalFineValue})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforce UFS parking compliance, view camera-detected violations, and manage fine settlements
          </p>
        </div>
      </div>

      {/* Official UFS Non-Compliance Notice Banner */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950 block">UFS Parking Procedure & Non-Compliance Policy:</span>
            <p className="text-amber-900 leading-relaxed mt-0.5">
              Strict action will be taken against persons who do not meet the stipulations of the procedure. Fines will be imposed for the violation of parking rules. The income will be reinvested in the maintenance of an orderly parking environment on campus.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: `All Records (${violations.length})` },
            { id: 'fine_issued', label: `Outstanding Fines (${totalFines})` },
            { id: 'grace_period_active', label: `Grace Active (${violations.filter((v) => v.status === 'grace_period_active').length})` },
            { id: 'paid', label: `Settled (${totalPaid})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by plate, citation #, or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredViolations.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <AlertOctagon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <span>No violations or citations found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Citation Ref</th>
                  <th className="py-3.5 px-4">License Plate</th>
                  <th className="py-3.5 px-4">Violation Details</th>
                  <th className="py-3.5 px-4">Location / Zone</th>
                  <th className="py-3.5 px-4">Fine Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredViolations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {v.fineReferenceNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <SouthAfricanPlate plateNumber={v.vehicleRegistration} size="sm" />
                      <p className="text-[10px] text-slate-400 mt-0.5">{v.vehicleMakeModel}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{v.violationType}</p>
                      <p className="text-[10px] text-slate-500 italic mt-0.5">{v.officerNotes}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{v.zoneName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{v.timestamp}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {v.fineAmount ? (
                        <span className="font-extrabold text-sm text-rose-700">R{v.fineAmount}</span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {v.status === 'fine_issued' && (
                        <button
                          onClick={() => settleViolation(v.id)}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors"
                        >
                          Mark as Settled
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

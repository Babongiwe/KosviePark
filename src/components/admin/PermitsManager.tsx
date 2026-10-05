import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { Permit } from '../../types';
import {
  CreditCard,
  Search,
  Filter,
  QrCode,
  RefreshCw,
  Ban,
  ShieldCheck,
  Calendar,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const PermitsManager: React.FC = () => {
  const { permits, revokePermit, openQRModal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'revoked'>('all');

  const filteredPermits = permits.filter((permit) => {
    if (statusFilter !== 'all' && permit.status !== statusFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      permit.permitNumber.toLowerCase().includes(term) ||
      permit.userName.toLowerCase().includes(term) ||
      permit.userIdentifier.toLowerCase().includes(term) ||
      permit.vehicleRegistration.toLowerCase().includes(term) ||
      permit.campus.toLowerCase().includes(term)
    );
  });

  const handleShowQR = (permit: Permit) => {
    if (!permit) return;
    openQRModal({
      title: `${(permit.permitType || 'Standard').toUpperCase()} Parking Permit`,
      subtitle: permit.permitNumber,
      code: permit.qrCodeData,
      details: {
        'Permit Number': permit.permitNumber,
        'Holder Name': permit.userName,
        'ID Number': permit.userIdentifier,
        'Vehicle Reg': permit.vehicleRegistration,
        'Vehicle Model': permit.vehicleMakeModel,
        'Campus': permit.campus,
        'Validity': `${permit.issueDate} to ${permit.expiryDate}`,
        'Status': (permit.status || 'Active').toUpperCase(),
        'Authorized Zones': (permit.allowedZoneCategories || []).join(', '),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Master Permit Registry
            </h2>
            <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {permits.filter((p) => p.status === 'active').length} Active Permits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of student, staff, and visitor parking credentials recognized by campus ALPR gates
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: `All Permits (${permits.length})` },
            { id: 'active', label: `Active (${permits.filter((p) => p.status === 'active').length})` },
            { id: 'expired', label: `Expired (${permits.filter((p) => p.status === 'expired').length})` },
            { id: 'revoked', label: `Revoked (${permits.filter((p) => p.status === 'revoked').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === tab.id
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
            placeholder="Search by permit #, holder, ID, or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Permits Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredPermits.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <span>No permits found matching your criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Permit Number</th>
                  <th className="py-3.5 px-4">Permit Holder</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Assigned Vehicle</th>
                  <th className="py-3.5 px-4">Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPermits.map((permit) => (
                  <tr key={permit.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {permit.permitNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{permit.userName}</p>
                      <p className="text-[11px] text-slate-500">{permit.userIdentifier} • {permit.campus}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold uppercase bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {permit.permitType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <SouthAfricanPlate plateNumber={permit.vehicleRegistration} size="sm" />
                        <span className="text-[10px] text-slate-400 truncate">{permit.vehicleMakeModel}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{permit.expiryDate}</p>
                      <span className="text-[10px] text-slate-400">Issued: {permit.issueDate}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={permit.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleShowQR(permit)}
                          className="p-1.5 text-slate-600 hover:text-blue-950 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Show Digital QR Pass"
                        >
                          <QrCode className="w-4 h-4 text-blue-900" />
                        </button>

                        {permit.status === 'active' && (
                          <button
                            onClick={() => { if (window.confirm('Revoke this permit? The ALPR gates will no longer admit this plate.')) revokePermit(permit.id, 'Administrative revocation'); }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Revoke Permit"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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

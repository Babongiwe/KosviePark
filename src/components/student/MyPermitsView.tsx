import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { ApplyPermitModal } from './ApplyPermitModal';
import {
  CreditCard,
  QrCode,
  RefreshCw,
  FilePlus,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const MyPermitsView: React.FC = () => {
  const { currentUser, permits, applications, openQRModal, getApplicationType } = useApp();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const userPermits = permits.filter((p) => p.userId === currentUser?.id);
  const userApplications = applications.filter((a) => a.applicantId === currentUser?.id);

  const handleShowQR = (permit: typeof userPermits[0]) => {
    if (!permit) return;
    openQRModal({
      title: `${(permit.permitType || 'Standard').toUpperCase()} Parking Permit`,
      subtitle: permit.permitNumber,
      code: permit.qrCodeData,
      details: {
        'Permit Number': permit.permitNumber,
        'Holder Name': permit.userName,
        'Identifier': permit.userIdentifier,
        'Vehicle Reg': permit.vehicleRegistration,
        'Vehicle Model': permit.vehicleMakeModel,
        'Campus': permit.campus,
        'Expiry Date': permit.expiryDate,
        'Permit Status': (permit.status || 'Active').toUpperCase(),
        'Allowed Zones': (permit.allowedZoneCategories || []).join(', '),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Back to Dashboard button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                My Parking Permits & Applications
              </h2>
              <StatusBadge status="active" size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage your official UFS digital vehicle permits and view submitted applications
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <FilePlus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Permits Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-heading">
          Active & Issued Permits ({userPermits.length})
        </h3>

        {userPermits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Parking Permits on Record</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Apply for a student or staff parking permit to avoid unauthorized ALPR detection and campus fines.
            </p>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900"
            >
              Apply for Permit Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userPermits.map((permit) => (
              <div
                key={permit.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {(permit.permitType || 'Standard').toUpperCase()} PERMIT
                      </span>
                      <h4 className="text-lg font-bold font-mono text-slate-900 mt-2">
                        {permit.permitNumber}
                      </h4>
                      <p className="text-xs text-slate-500">{permit.campus}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={permit.status} />
                      {(permit.renewalCount || 0) > 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          Renewed x{permit.renewalCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Vehicle:</span>
                      <SouthAfricanPlate plateNumber={permit.vehicleRegistration} size="sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Make & Model:</span>
                      <span className="font-semibold text-slate-800">{permit.vehicleMakeModel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Permit Validity:</span>
                      <span className="font-semibold text-slate-800">
                        {permit.issueDate} → <span className="text-amber-600 font-bold">{permit.expiryDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-bold text-slate-700 mb-1.5">Authorized Parking Categories:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {permit.allowedZoneCategories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  {permit.status === 'expired' ? (
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-xs shadow-xs transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Renew via New Application</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valid for automated ALPR gates</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleShowQR(permit)}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Pass</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Application Submission History
            </h3>
            <p className="text-xs text-slate-500">Track pending review and approval statuses</p>
          </div>
        </div>

        {userApplications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No permit applications submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Application #</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Permit Type</th>
                  <th className="py-3 px-4">Vehicle Plate</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Admin Review Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getApplicationType(app) === 'renewal' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                        {getApplicationType(app) === 'renewal' ? 'Renewal' : 'New'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-800">
                      {app.permitType} Permit
                    </td>
                    <td className="py-3.5 px-4">
                      <SouthAfricanPlate plateNumber={app.vehicleRegistration} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{app.submittedDate}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className={`py-3.5 px-4 max-w-xs ${app.status === 'rejected' ? 'text-rose-700 font-semibold' : 'text-slate-600'}`}>
                      {app.reviewerNotes || (app.status === 'pending' ? 'Pending administrative verification' : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplyPermitModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};

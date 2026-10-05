import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { PermitApplication } from '../../types';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Eye,
  User,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';

export const PermitApplicationsManager: React.FC = () => {
  const { applications, reviewPermitApplication, getApplicationType } = useApp();
  const [rejectError, setRejectError] = useState('');

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<PermitApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const filteredApplications = applications.filter((app) => {
    if (filterTab !== 'all' && app.status !== filterTab) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      app.applicantName.toLowerCase().includes(term) ||
      app.applicantNumber.toLowerCase().includes(term) ||
      app.applicationNumber.toLowerCase().includes(term) ||
      app.vehicleRegistration.toLowerCase().includes(term)
    );
  });

  const handleApprove = (app: PermitApplication) => {
    reviewPermitApplication(app.id, 'approved', 'All requirements verified. Approved for campus access.');
    if (selectedApp?.id === app.id) {
      setSelectedApp(null);
    }
  };

  const handleConfirmReject = () => {
    if (!selectedApp) return;
    if (!rejectReason.trim()) {
      setRejectError('Please enter a reason for rejecting this application.');
      return;
    }
    setRejectError('');
    reviewPermitApplication(selectedApp.id, 'rejected', rejectReason.trim());
    setIsRejectModalOpen(false);
    setSelectedApp(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Permit Applications Management
            </h2>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {applications.filter((a) => a.status === 'pending').length} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review, verify documentation, and approve/reject student and staff parking permits
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'pending', label: `Pending (${applications.filter((a) => a.status === 'pending').length})` },
            { id: 'approved', label: `Approved (${applications.filter((a) => a.status === 'approved').length})` },
            { id: 'rejected', label: `Rejected (${applications.filter((a) => a.status === 'rejected').length})` },
            { id: 'all', label: `All Applications (${applications.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filterTab === tab.id
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, student ID, plate, or app #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <ClipboardList className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <span>No permit applications found matching your criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Application #</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Role & ID</th>
                  <th className="py-3.5 px-4">Permit Category</th>
                  <th className="py-3.5 px-4">Vehicle Plate</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getApplicationType(app) === 'renewal' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                        {getApplicationType(app) === 'renewal' ? 'Renewal' : 'New'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.applicantName}</p>
                      <p className="text-[11px] text-slate-500">{app.applicantEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-slate-800">{app.applicantRole}</span>
                      <p className="text-[10px] text-slate-400 font-mono">{app.applicantNumber}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold uppercase bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {app.permitType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <SouthAfricanPlate plateNumber={app.vehicleRegistration} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{app.submittedDate}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 text-slate-600 hover:text-blue-950 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Full Application Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app)}
                              className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setIsRejectModalOpen(true);
                              }}
                              className="py-1 px-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg font-bold text-xs border border-slate-200 transition-colors"
                            >
                              Reject
                            </button>
                          </>
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

      {/* Application Details Modal */}
      {selectedApp && !isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-blue-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-blue-950 px-2 py-0.5 rounded">
                  Application Review
                </span>
                <h3 className="text-base font-bold font-heading mt-1 text-white">
                  {selectedApp.applicationNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-blue-300 hover:text-white p-1 rounded-lg hover:bg-blue-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900">
                    {selectedApp.applicantName} ({selectedApp.applicantNumber})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role & Email:</span>
                  <span className="font-medium text-slate-800">
                    {(selectedApp.applicantRole || 'User').toUpperCase()} • {selectedApp.applicantEmail}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Vehicle:</span>
                  <SouthAfricanPlate plateNumber={selectedApp.vehicleRegistration} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Make/Model:</span>
                  <span className="font-semibold text-slate-800">{selectedApp.vehicleMakeModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Campus:</span>
                  <span className="font-semibold text-slate-800">{selectedApp.campus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Preferred Category:</span>
                  <span className="font-semibold text-slate-800">{selectedApp.preferredZoneCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <StatusBadge status={selectedApp.status} size="sm" />
                </div>
              </div>

              {selectedApp.justification && (
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Applicant Motivation</h4>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-200 leading-relaxed">
                    {selectedApp.justification}
                  </p>
                </div>
              )}

              {selectedApp.studentProofDoc && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950">
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="font-mono text-[11px] font-bold truncate">
                    {selectedApp.studentProofDoc} (Attached Verification Document)
                  </span>
                </div>
              )}

              {selectedApp.reviewerNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                  <p className="font-bold">Reviewer Remarks:</p>
                  <p className="mt-0.5">{selectedApp.reviewerNotes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                {selectedApp.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      className="py-2 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      className="py-2 px-5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-sm transition-colors"
                    >
                      Approve & Issue Permit
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="py-2 px-5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {isRejectModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Reject Permit Application
            </h3>
            <p className="text-slate-500">
              Provide a reason for declining application <strong>{selectedApp.applicationNumber}</strong> for {selectedApp.applicantName}. The applicant will be notified immediately.
            </p>

            <div>
              {rejectError && <div className="p-2.5 mb-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{rejectError}</div>}
              <label className="block font-bold text-slate-700 mb-1">Reason for Rejection *</label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Zone capacity exceeded, insufficient medical proof for disability bay, or duplicate active permit on file."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="py-2 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="py-2 px-5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

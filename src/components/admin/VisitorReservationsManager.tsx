import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { VisitorReservation } from '../../types';
import { availableBays, suitableZones } from '../../lib/visitorBays';
import {
  CalendarCheck,
  Search,
  Plus,
  QrCode,
  CheckCircle2,
  XCircle,
  Building,
  User,
  Clock,
} from 'lucide-react';

export const VisitorReservationsManager: React.FC = () => {
  const { visitorReservations, openQRModal, cancelVisitorReservation, zones, approveVisitorRequest, rejectVisitorRequest } = useApp();
  const [reviewing, setReviewing] = useState<VisitorReservation | null>(null);
  const [zoneId, setZoneId] = useState('');
  const [bay, setBay] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [mode, setMode] = useState<'approve' | 'reject'>('approve');

  const openReview = (res: VisitorReservation) => {
    const z = suitableZones(zones, res.visitorType)[0];
    setReviewing(res);
    setZoneId(z?.id ?? '');
    setBay('');
    setRejectReason('');
    setMode('approve');
  };
  const reviewZones = reviewing ? suitableZones(zones, reviewing.visitorType) : [];
  const reviewZone = reviewZones.find((z) => z.id === zoneId);
  const bays = reviewing && reviewZone ? availableBays(reviewZone, reviewing.visitDate, visitorReservations) : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReservations = visitorReservations.filter((res) => {
    if (filterStatus !== 'all' && res.status.replace('-', '_') !== filterStatus.replace('-', '_')) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (res.reservationNumber ?? "").toLowerCase().includes(term) ||
      (res.reservationCode ?? "").toLowerCase().includes(term) ||
      res.visitorName.toLowerCase().includes(term) ||
      res.vehicleRegistration.toLowerCase().includes(term) ||
      res.hostPerson.toLowerCase().includes(term) ||
      res.hostDepartment.toLowerCase().includes(term)
    );
  });

  const handleShowQR = (res: VisitorReservation) => {
    openQRModal({
      title: 'UFS Visitor Parking Pass',
      subtitle: res.reservationNumber || res.reservationCode || 'PASS',
      code: res.qrCodeData,
      details: {
        'Pass Code': res.reservationNumber || res.reservationCode || 'PASS',
        'Visitor': res.visitorName,
        'Vehicle Reg': res.vehicleRegistration,
        'Make/Model': res.vehicleMakeModel || res.vehicleDescription || 'Vehicle',
        'Assigned Bay': `Bay ${res.assignedBayNumber}`,
        'Visit Date': `${res.visitDate} (${res.startTime || res.arrivalTime || '08:00'} - ${res.endTime || res.departureTime || '17:00'})`,
        'Host Person': `${res.hostPerson} (${res.hostDepartment})`,
        'Status': (res.status || 'Confirmed').toUpperCase(),
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
              Visitor Parking Reservations
            </h2>
            <span className="bg-teal-100 text-teal-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {visitorReservations.filter((r) => r.status === 'confirmed').length} Active Bookings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-registered university guests, guest lecturers, contractors, and conference attendees
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: `All Visitors (${visitorReservations.length})` },
            { id: 'pending', label: `Pending (${visitorReservations.filter((r) => r.status === 'pending').length})` },
            { id: 'confirmed', label: `Confirmed (${visitorReservations.filter((r) => r.status === 'confirmed').length})` },
            { id: 'checked_in', label: `Checked In (${visitorReservations.filter((r) => r.status === 'checked_in' || r.status === 'checked-in').length})` },
            { id: 'rejected', label: `Rejected (${visitorReservations.filter((r) => r.status === 'rejected').length})` },
            { id: 'cancelled', label: `Cancelled (${visitorReservations.filter((r) => r.status === 'cancelled').length})` },
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
            placeholder="Search by visitor, host, plate, or pass #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <CalendarCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <span>{searchTerm ? `No reservations match "${searchTerm}". Please check the plate or name and try again.` : 'No visitor reservations found.'}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Reservation Pass</th>
                  <th className="py-3.5 px-4">Visitor Details</th>
                  <th className="py-3.5 px-4">Vehicle Plate</th>
                  <th className="py-3.5 px-4">Host / Department</th>
                  <th className="py-3.5 px-4">Slot & Bay</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {res.reservationCode ?? res.reservationNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{res.visitorName}</p>
                      <p className="text-[11px] text-slate-500">{res.visitorEmail} • {res.visitorType}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <SouthAfricanPlate plateNumber={res.vehicleRegistration} size="sm" />
                      <p className="text-[10px] text-slate-400 mt-0.5">{res.vehicleMakeModel}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{res.hostPerson}</p>
                      <p className="text-[10px] text-slate-400">{res.hostDepartment}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {res.assignedBayNumber ? `${res.zoneName ?? 'Zone V1'} • Bay ${res.assignedBayNumber}` : 'Not assigned'}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {res.visitDate} ({res.startTime}-{res.endTime})
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={res.status} size="sm" />
                      {res.status === 'rejected' && res.rejectionReason && (
                        <p className="text-[10px] text-rose-600 mt-0.5 max-w-[160px]">{res.rejectionReason}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => openReview(res)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-950 text-white hover:bg-blue-900"
                          >
                            Review
                          </button>
                        )}
                        {res.qrCodeData && <button
                          onClick={() => handleShowQR(res)}
                          className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Show Digital QR Pass"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>}
                        {(res.status === 'confirmed' || res.status === 'pending') && (
                          <button
                            onClick={() => { if (window.confirm('Cancel this reservation? The bay will be released and the visitor will be emailed.')) cancelVisitorReservation(res.reservationCode ?? res.id); }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Reservation"
                          >
                            <XCircle className="w-4 h-4" />
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
      {reviewing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={() => setReviewing(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 text-xs" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="text-base font-bold text-slate-900">Review {reviewing.reservationCode}</h3>
              <p className="text-slate-500">
                {reviewing.visitorName} • {reviewing.visitorType} • {reviewing.vehicleRegistration} • {reviewing.visitDate} ({reviewing.startTime}-{reviewing.endTime})
              </p>
              <p className="text-slate-500 mt-1">Host: {reviewing.hostPerson} ({reviewing.hostDepartment}) — {reviewing.purpose}</p>
            </div>
            <div className="flex gap-2">
              {(['approve', 'reject'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-xl font-bold border ${mode === m ? (m === 'approve' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600') : 'border-slate-200 text-slate-600'}`}>
                  {m === 'approve' ? 'Approve & Reserve Bay' : 'Reject'}
                </button>
              ))}
            </div>
            {mode === 'approve' ? (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Suitable zone for this visitor type</label>
                  <select value={zoneId} onChange={(e) => { setZoneId(e.target.value); setBay(''); }} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
                    {reviewZones.map((z) => (
                      <option key={z.id} value={z.id}>{z.code} • {z.name} ({z.category})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available bays on {reviewing.visitDate} ({bays.length})</label>
                  {bays.length === 0 ? (
                    <p className="text-rose-600">No bays available in this zone. Pick another zone.</p>
                  ) : (
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto">
                      {bays.slice(0, 40).map((b) => (
                        <button key={b} type="button" onClick={() => setBay(b)}
                          className={`p-2 rounded-lg border font-mono font-bold ${bay === b ? 'bg-teal-800 text-white border-teal-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setReviewing(null)} className="py-2 px-4 rounded-xl border border-slate-300 font-bold">Close</button>
                  <button disabled={!bay}
                    onClick={() => { approveVisitorRequest(reviewing.id, zoneId, bay); setReviewing(null); }}
                    className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-40">
                    Reserve Bay & Issue Permit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for rejection *</label>
                  <textarea rows={3} maxLength={300} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Host could not confirm the visit" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl" />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setReviewing(null)} className="py-2 px-4 rounded-xl border border-slate-300 font-bold">Close</button>
                  <button disabled={!rejectReason.trim()}
                    onClick={() => { rejectVisitorRequest(reviewing.id, rejectReason.trim()); setReviewing(null); }}
                    className="py-2 px-4 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-40">
                    Reject & Notify Visitor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
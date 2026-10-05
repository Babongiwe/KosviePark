import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { VisitorReservation } from '../../types';
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
  const { visitorReservations, openQRModal, cancelVisitorReservation } = useApp();

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
            { id: 'confirmed', label: `Confirmed (${visitorReservations.filter((r) => r.status === 'confirmed').length})` },
            { id: 'checked_in', label: `Checked In (${visitorReservations.filter((r) => r.status === 'checked_in' || r.status === 'checked-in').length})` },
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
                      {res.reservationNumber}
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
                        Zone V1 • Bay {res.assignedBayNumber}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {res.visitDate} ({res.startTime}-{res.endTime})
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={res.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleShowQR(res)}
                          className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Show Digital QR Pass"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        {res.status === 'confirmed' && (
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
    </div>
  );
};

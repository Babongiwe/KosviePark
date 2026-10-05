import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { StatusBadge } from '../common/StatusBadge';
import { Search, CalendarCheck, QrCode, XCircle, User, MapPin } from 'lucide-react';

export const VisitorLookup: React.FC = () => {
  const { visitorReservations, cancelVisitorReservation, openQRModal } = useApp();

  const [query, setQuery] = useState('HJK 552 FS');
  const [hasSearched, setHasSearched] = useState(true);

  const cleanQuery = query.trim().toUpperCase();
  const matchedList = visitorReservations.filter(
    (v) =>
      v.vehicleRegistration.replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '') ||
      (v.reservationNumber ?? "").replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '')
  );

  const handleShowQR = (res: typeof matchedList[0]) => {
    if (!res) return;
    openQRModal({
      title: 'UFS Visitor Parking Pass',
      subtitle: res.reservationNumber ?? "",
      code: res.qrCodeData,
      details: {
        'Pass Number': res.reservationNumber ?? "",
        'Visitor': res.visitorName,
        'Vehicle Plate': res.vehicleRegistration,
        'Assigned Bay': `Bay ${res.assignedBayNumber}`,
        'Visit Date': `${res.visitDate} (${res.startTime} - ${res.endTime})`,
        'Host Person': res.hostPerson,
        'Status': (res.status || 'Confirmed').toUpperCase(),
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Find or Manage Visitor Reservation
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your Reservation Reference Code (e.g. VIS-2026-901) or vehicle license plate to view pass QR or cancel booking
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="e.g. HJK 552 FS or VIS-2026-901"
              className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono font-bold uppercase text-teal-300 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={() => setHasSearched(true)}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Pass</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          {matchedList.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
              <CalendarCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700 text-sm">No Reservation Found</p>
              <p className="mt-1">Please verify your license plate or reservation number.</p>
            </div>
          ) : (
            matchedList.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {res.reservationNumber}
                    </span>
                    <p className="text-slate-500">{res.visitorType}</p>
                  </div>
                  <StatusBadge status={res.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-slate-500">Visitor:</p>
                    <p className="font-bold text-slate-900 text-sm">{res.visitorName}</p>
                    <p className="text-slate-500">{res.visitorEmail}</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-slate-500">Vehicle:</p>
                    <SouthAfricanPlate plateNumber={res.vehicleRegistration} size="sm" />
                    <p className="text-slate-500">{res.vehicleMakeModel}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">Host & Location:</span>
                    <span className="font-bold text-slate-800">{res.hostPerson} ({res.hostDepartment})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Bay:</span>
                    <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Zone V1 • Bay {res.assignedBayNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {res.status === 'confirmed' && (
                    <button
                      onClick={() => cancelVisitorReservation(res.id)}
                      className="py-2 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100"
                    >
                      Cancel Reservation
                    </button>
                  )}
                  <button
                    onClick={() => handleShowQR(res)}
                    className="py-2 px-5 rounded-xl bg-teal-800 text-white font-bold hover:bg-teal-700 shadow-sm flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Pass QR</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

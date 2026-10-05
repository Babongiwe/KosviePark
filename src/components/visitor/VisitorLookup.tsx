import React from 'react';
import { useApp } from '../../context/AppContext';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { StatusBadge } from '../common/StatusBadge';
import { CalendarCheck, QrCode, Clock, XCircle, MapPin } from 'lucide-react';
import type { VisitorReservation } from '../../types';

export const useMyVisitorRequests = () => {
  const { visitorReservations, currentUser } = useApp();
  return visitorReservations.filter(
    (r) =>
      r.requesterId === currentUser?.id ||
      (!!currentUser?.email && r.visitorEmail.toLowerCase() === currentUser.email.toLowerCase())
  );
};

export const showVisitorPass = (
  openQRModal: ReturnType<typeof useApp>['openQRModal'],
  res: VisitorReservation
) => {
  openQRModal({
    title: 'UFS Visitor Parking Pass',
    subtitle: res.reservationCode ?? res.reservationNumber ?? '',
    code: res.qrCodeData,
    details: {
      'Pass Number': res.reservationCode ?? res.reservationNumber ?? '',
      'Temporary Permit': res.temporaryPermitCode ?? '-',
      Visitor: res.visitorName,
      'Vehicle Plate': res.vehicleRegistration,
      'Assigned Bay': `${res.zoneName ?? 'Visitor Zone'} • Bay ${res.assignedBayNumber}`,
      'Visit Date': `${res.visitDate} (${res.startTime ?? res.arrivalTime} - ${res.endTime ?? res.departureTime})`,
      'Host Person': res.hostPerson,
      Status: res.status.toUpperCase(),
    },
  });
};

export const VisitorLookup: React.FC = () => {
  const { cancelVisitorReservation, openQRModal, setCurrentScreen } = useApp();
  const mine = useMyVisitorRequests();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 font-heading">My Request Status, Bay & Pass</h2>
        <p className="text-xs text-slate-500 mt-1">
          Track your temporary permit requests. Once approved you will see your zone, bay and visitor pass here.
        </p>
      </div>

      {mine.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
          <CalendarCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-700 text-sm">No requests yet</p>
          <button
            onClick={() => setCurrentScreen('visitor_portal')}
            className="mt-3 py-2 px-4 rounded-xl bg-teal-800 text-white font-bold"
          >
            Request a Temporary Permit
          </button>
        </div>
      ) : (
        mine.map((res) => (
          <div key={res.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-sm font-bold text-slate-900">{res.reservationCode ?? res.reservationNumber}</span>
                <p className="text-slate-500">
                  {res.visitorType} • {res.visitDate} ({res.startTime ?? res.arrivalTime} - {res.endTime ?? res.departureTime})
                </p>
              </div>
              <StatusBadge status={res.status} />
            </div>

            <div className="flex items-center gap-4">
              <SouthAfricanPlate plateNumber={res.vehicleRegistration} size="sm" />
              <span className="text-slate-500">{res.vehicleMakeModel ?? res.vehicleDescription}</span>
            </div>

            {res.status === 'pending' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Awaiting administrator review. A bay will be reserved for you once approved.</span>
              </div>
            )}

            {res.status === 'rejected' && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Rejected:</strong> {res.rejectionReason || 'No reason given.'}
                </span>
              </div>
            )}

            {(res.status === 'confirmed' || res.status === 'checked-in' || res.status === 'checked_in') && (
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-800 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-950 block">
                      {res.zoneName ?? 'Visitor Zone'} • Bay {res.assignedBayNumber}
                    </span>
                    <span className="font-mono text-amber-800">Temporary permit: {res.temporaryPermitCode}</span>
                  </div>
                </div>
                <button
                  onClick={() => showVisitorPass(openQRModal, res)}
                  className="py-2 px-4 rounded-xl bg-teal-800 text-white font-bold hover:bg-teal-700 flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Pass</span>
                </button>
              </div>
            )}

            {(res.status === 'pending' || res.status === 'confirmed') && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (window.confirm('Cancel this reservation? Your bay will be released.'))
                      cancelVisitorReservation(res.reservationCode ?? res.id);
                  }}
                  className="py-2 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100"
                >
                  Cancel Reservation
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Car, CreditCard, Shield, AlertTriangle, User, CalendarCheck } from 'lucide-react';

export const VehicleLookup: React.FC = () => {
  const { permits, visitorReservations, violations, vehicles } = useApp();

  const [query, setQuery] = useState('FSK 123 GP');
  const [searched, setSearched] = useState('FSK 123 GP');
  const hasSearched = searched !== '';
  const setHasSearched = (_: boolean) => setSearched(query);

  const cleanQuery = searched.trim().toUpperCase();

  // Find matches
  const matchedPermit = permits.find(
    (p) => p.vehicleRegistration.replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '')
  );
  const matchedVisitor = visitorReservations.find(
    (v) => v.vehicleRegistration.replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '')
  );
  const matchedViolations = violations.filter(
    (v) => v.vehicleRegistration.replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '')
  );
  const matchedVehicle = vehicles.find(
    (v) => v.registrationNumber.replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '')
  );

  const isFound = matchedPermit || matchedVisitor || matchedViolations.length > 0 || matchedVehicle;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Verify Permit Validity
            </h2>
            <StatusBadge status="active" size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search any license plate to review permit authorization status, visitor passes, and past citations
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white shadow-md">
        <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
          Enter License Plate Number
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="e.g. FSK 123 GP, BLM 789 FS, or HJK 552 FS"
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-base font-mono-plate font-bold uppercase text-amber-300 focus:ring-2 focus:ring-amber-500 focus:bg-slate-800"
            />
          </div>
          <button
            onClick={() => setHasSearched(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Look up</span>
          </button>
        </div>

        {/* Quick sample buttons */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span>Quick fill:</span>
          {['FSK 123 GP', 'BLM 789 FS', 'HJK 552 FS', 'KVS 404 FS', 'CA 998 123'].map((p) => (
            <button
              key={p}
              onClick={() => {
                setQuery(p);
                setSearched(p);
                setHasSearched(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] font-bold"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-heading">
              Search Results for {cleanQuery}
            </h3>
            {isFound ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Record Found
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                {`No permit or reservation found for ${cleanQuery}.`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Academic / Staff Permit Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-heading">
                  <CreditCard className="w-4 h-4 text-blue-900" />
                  <span>Campus Parking Permit</span>
                </div>
                {matchedPermit && <StatusBadge status={matchedPermit.status} size="sm" />}
              </div>

              {matchedPermit ? (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Permit Number:</span>
                    <span className="font-mono font-bold text-slate-900">{matchedPermit.permitNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Holder Name:</span>
                    <span className="font-bold text-slate-900">{matchedPermit.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Identifier:</span>
                    <span className="font-mono text-slate-800">{matchedPermit.userIdentifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Permit Category:</span>
                    <span className="font-bold uppercase text-blue-950">{matchedPermit.permitType} Permit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Validity:</span>
                    <span className="font-semibold text-slate-800">{matchedPermit.issueDate} → {matchedPermit.expiryDate}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">Authorized Zones:</p>
                    <div className="flex flex-wrap gap-1">
                      {matchedPermit.allowedZoneCategories.map((c) => (
                        <span key={c} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No active or expired campus permits linked to this vehicle.</p>
              )}
            </div>

            {/* 2. Visitor Pass Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-heading">
                  <CalendarCheck className="w-4 h-4 text-teal-700" />
                  <span>Visitor Reservation Pass</span>
                </div>
                {matchedVisitor && <StatusBadge status={matchedVisitor.status} size="sm" />}
              </div>

              {matchedVisitor ? (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pass Code:</span>
                    <span className="font-mono font-bold text-slate-900">{matchedVisitor.reservationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Visitor:</span>
                    <span className="font-bold text-slate-900">{matchedVisitor.visitorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Host:</span>
                    <span className="font-semibold text-slate-800">{matchedVisitor.hostPerson} ({matchedVisitor.hostDepartment})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Bay:</span>
                    <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Zone V1 • Bay {matchedVisitor.assignedBayNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-semibold text-slate-800">{matchedVisitor.visitDate} ({matchedVisitor.startTime} - {matchedVisitor.endTime})</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No visitor parking reservations on record for this plate.</p>
              )}
            </div>
          </div>

          {/* 3. Citations & Violations History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-heading">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Violations & Fines History ({matchedViolations.length})</span>
              </div>
            </div>

            {matchedViolations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Clean record — No parking violations or unpaid fines logged.</p>
            ) : (
              <div className="space-y-2.5">
                {matchedViolations.map((v) => (
                  <div key={v.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{v.violationType}</span>
                        <StatusBadge status={v.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{v.zoneName} • {v.timestamp}</p>
                      <p className="text-[10px] text-slate-600 mt-1 italic">{v.officerNotes}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-rose-700">R{v.fineAmount}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{v.fineReferenceNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ParkingZone } from '../../types';
import { MapPin, Car, Info, Eye } from 'lucide-react';

export const BayAvailabilityView: React.FC = () => {
  const { zones, permits, currentUser } = useApp();

  const userPermit = permits.find((p) => p.userId === currentUser?.id);
  const allowedCategories = userPermit?.allowedZoneCategories || [];

  const permittedZones = zones.filter((z) =>
    allowedCategories.length === 0 ? false : allowedCategories.includes(z.category)
  );

  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(permittedZones[0] || null);
  const activeZone =
    selectedZone && permittedZones.some((z) => z.id === selectedZone.id)
      ? selectedZone
      : permittedZones[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 font-heading">Live Parking Bay Availability</h2>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
            <Eye className="w-3 h-3" /> Read Only
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Live occupancy for the parking zones your permit authorises. Bays are not reservable — this view
          helps you choose where to park before you arrive.
        </p>
      </div>

      {permittedZones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-slate-800">No Authorised Zones Yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once your parking permit is approved, the zones it authorises will appear here with live bay
            occupancy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Zone list */}
          <div className="lg:col-span-5 space-y-3">
            {permittedZones.map((zone) => {
              const available = zone.totalBays - zone.occupiedBays;
              const percent = Math.round((zone.occupiedBays / zone.totalBays) * 100);
              const isSelected = activeZone?.id === zone.id;

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-900 bg-white ring-2 ring-blue-900/10 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold bg-blue-950 text-amber-400 px-2 py-0.5 rounded">
                          {zone.code}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{zone.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {zone.category} • {zone.campus}
                      </p>
                    </div>
                    <StatusBadge status={zone.status} size="sm" />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      {zone.occupiedBays} / {zone.totalBays} Bays Occupied
                    </span>
                    <span
                      className={`font-bold ${
                        percent > 85 ? 'text-rose-600' : percent > 60 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {available} Free ({100 - percent}% free)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent > 85 ? 'bg-rose-500' : percent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bay matrix (read-only) */}
          <div className="lg:col-span-7">
            {activeZone && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold bg-blue-950 text-amber-400 px-2.5 py-1 rounded-lg">
                      {activeZone.code}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-heading">{activeZone.name}</h3>
                      <p className="text-xs text-slate-500">{activeZone.locationDescription}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-blue-950">
                      {activeZone.totalBays - activeZone.occupiedBays}
                    </span>
                    <span className="text-xs text-slate-400 block font-medium">Bays Available</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Interactive Bay Matrix Layout
                    </h4>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Free
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Occupied
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 bg-slate-900 rounded-xl border border-slate-800 max-h-72 overflow-y-auto">
                    {Array.from({ length: activeZone.totalBays }).map((_, index) => {
                      const isOccupied = index < activeZone.occupiedBays;
                      const bayNumber = `${activeZone.code}-${(index + 1).toString().padStart(2, '0')}`;

                      return (
                        <div
                          key={index}
                          title={`Bay ${bayNumber}: ${isOccupied ? 'Occupied' : 'Available'}`}
                          className={`h-10 rounded-lg flex flex-col items-center justify-center text-[9px] font-mono font-bold ${
                            isOccupied
                              ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/80'
                          }`}
                        >
                          <span>{index + 1}</span>
                          <Car className={`w-3 h-3 ${isOccupied ? 'text-rose-400' : 'text-emerald-500 opacity-30'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px] text-slate-600">
                    Bays cannot be individually reserved by students or staff. Occupancy updates live from ALPR
                    boom gate sensors — park in any free bay within a zone your permit authorises.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ParkingZone, ZoneCategory, PermitType } from '../../types';
import {
  MapPin,
  Plus,
  Edit2,
  Users,
  Car,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  Sliders,
} from 'lucide-react';

export const ZoneManager: React.FC = () => {
  const { zones, updateZoneBays, activeRole, addZone, updateZone, addBay, removeBay } = useApp();
  const isAdmin = activeRole === 'admin';

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(zones[0]?.id || null);
  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;
  const setSelectedZone = (z: ParkingZone) => setSelectedZoneId(z.id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const ALL_TYPES: PermitType[] = ['student', 'staff', 'visitor', 'disability', 'reserved'];
  const CATS: { label: string; value: ZoneCategory }[] = [
    { label: 'Student', value: 'Student Parking' },
    { label: 'Staff', value: 'Staff Parking' },
    { label: 'Visitor', value: 'Visitor Parking' },
    { label: 'Disability', value: 'Disability Parking' },
    { label: 'Reserved', value: 'Reserved Parking' },
  ];
  const [fCode, setFCode] = useState('');
  const [fName, setFName] = useState('');
  const [fCampus, setFCampus] = useState('Bloemfontein Main Campus');
  const [fCat, setFCat] = useState<ZoneCategory>('Student Parking');
  const [fBays, setFBays] = useState('20');
  const [fTypes, setFTypes] = useState<PermitType[]>(['student']);
  const [fErr, setFErr] = useState('');
  const [rTypes, setRTypes] = useState<PermitType[]>([]);
  const [rText, setRText] = useState('');
  const [rActive, setRActive] = useState(true);

  const toggle = (list: PermitType[], t: PermitType) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]);

  const openAdd = () => { setFErr(''); setIsAddModalOpen(true); };
  const saveZone = () => {
    const code = fCode.trim().toUpperCase();
    if (!code || !fName.trim()) return setFErr('Please fill in all required fields.');
    if (zones.some((z) => z.code.toUpperCase() === code)) return setFErr(`Zone code ${code} already exists. Please choose a different code.`);
    const bays = parseInt(fBays, 10);
    if (!bays || bays <= 0) return setFErr('The number of bays must be greater than 0.');
    if (fTypes.length === 0) return setFErr('Please choose at least one allowed permit category.');
    addZone({
      code, name: fName.trim(), campus: fCampus, category: fCat, totalBays: bays, occupiedBays: 0,
      allowedPermitTypes: fTypes, status: 'active', restrictions: 'Standard campus parking rules apply.',
      locationDescription: fCampus,
    });
    setIsAddModalOpen(false);
    setFCode(''); setFName(''); setFBays('20'); setFTypes(['student']);
  };
  const openRules = () => {
    if (!selectedZone) return;
    setRTypes(selectedZone.allowedPermitTypes); setRText(selectedZone.restrictions); setRActive(selectedZone.status === 'active');
    setFErr(''); setIsRulesOpen(true);
  };
  const saveRules = () => {
    if (!selectedZone) return;
    if (rTypes.length === 0) return setFErr('Please choose at least one allowed permit category.');
    updateZone({ ...selectedZone, allowedPermitTypes: rTypes, restrictions: rText, status: rActive ? 'active' : 'closed' });
    setIsRulesOpen(false);
  };
  const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-xs';
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCampus, setFilterCampus] = useState<string>('all');

  const filteredZones = zones.filter((zone) => {
    const matchCategory = filterCategory === 'all' || zone.category === filterCategory;
    const matchCampus = filterCampus === 'all' || zone.campus.toLowerCase().includes(filterCampus.toLowerCase());
    return matchCategory && matchCampus;
  });

  const handleSimulateCarEntry = (zoneId: string) => {
    const target = zones.find((z) => z.id === zoneId);
    if (target && target.occupiedBays < target.totalBays) {
      updateZoneBays(zoneId, target.occupiedBays + 1);
    }
  };

  const handleSimulateCarExit = (zoneId: string) => {
    const target = zones.find((z) => z.id === zoneId);
    if (target && target.occupiedBays > 0) {
      updateZoneBays(zoneId, target.occupiedBays - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Campus Parking Zones & Bay Management
            </h2>
            <StatusBadge status="active" size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin ? 'Configure zones, permit category rules and bay capacities across UFS campuses' : 'Read-only live bay occupancy across monitored parking zones'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-sm cursor-pointer">
            <Plus className="w-4 h-4" /> Add Zone
          </button>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Add Zone</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {fErr && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{fErr}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div><label className="font-bold block mb-1">Zone code *</label><input value={fCode} onChange={(e) => setFCode(e.target.value)} placeholder="e.g. ZONE-K" className={inputCls} /></div>
              <div><label className="font-bold block mb-1">Number of bays *</label><input type="number" value={fBays} onChange={(e) => setFBays(e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className="font-bold block mb-1">Zone name *</label><input value={fName} onChange={(e) => setFName(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="font-bold block mb-1">Campus</label>
                <select value={fCampus} onChange={(e) => setFCampus(e.target.value)} className={inputCls}>
                  <option>Bloemfontein Main Campus</option><option>Qwaqwa Campus</option><option>South Campus</option>
                </select></div>
              <div><label className="font-bold block mb-1">Category</label>
                <select value={fCat} onChange={(e) => setFCat(e.target.value as ZoneCategory)} className={inputCls}>
                  {CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select></div>
            </div>
            <div><label className="font-bold block mb-1">Allowed permit categories</label>
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-1 capitalize"><input type="checkbox" checked={fTypes.includes(t)} onChange={() => setFTypes(toggle(fTypes, t))} />{t}</label>
                ))}
              </div></div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsAddModalOpen(false)} className="py-2 px-4 rounded-lg border border-slate-300 font-bold">Cancel</button>
              <button onClick={saveZone} className="py-2 px-4 rounded-lg bg-blue-950 text-white font-bold">Save Zone</button>
            </div>
          </div>
        </div>
      )}

      {isRulesOpen && selectedZone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Edit Rules — {selectedZone.code}</h3>
              <button onClick={() => setIsRulesOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {fErr && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{fErr}</div>}
            <div><label className="font-bold block mb-1">Allowed permit categories</label>
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-1 capitalize"><input type="checkbox" checked={rTypes.includes(t)} onChange={() => setRTypes(toggle(rTypes, t))} />{t}</label>
                ))}
              </div></div>
            <div><label className="font-bold block mb-1">Restriction text</label><textarea rows={3} value={rText} onChange={(e) => setRText(e.target.value)} className={inputCls} /></div>
            <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={rActive} onChange={(e) => setRActive(e.target.checked)} /> Zone is Active</label>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsRulesOpen(false)} className="py-2 px-4 rounded-lg border border-slate-300 font-bold">Cancel</button>
              <button onClick={saveRules} className="py-2 px-4 rounded-lg bg-blue-950 text-white font-bold">Save Rules</button>
            </div>
          </div>
        </div>
      )}

      {/* Campus Selector & Category Tabs */}
      <div className="space-y-3">
        {/* Campuses Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
            UFS Campus:
          </span>
          {[
            { id: 'all', label: 'All 3 Campuses' },
            { id: 'Bloemfontein', label: 'Bloemfontein Campus' },
            { id: 'Qwaqwa', label: 'Qwaqwa Campus' },
            { id: 'South', label: 'South Campus' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCampus(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filterCampus === c.id
                  ? 'bg-amber-500 text-blue-950 shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            'all',
            'Student Parking',
            'Staff Parking',
            'Visitor Parking',
            'Disability Parking',
            'Reserved Parking',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Zone Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Zones Cards on left, Interactive Bay Visualizer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Zones List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredZones.map((zone) => {
            const available = zone.totalBays - zone.occupiedBays;
            const percent = Math.round((zone.occupiedBays / zone.totalBays) * 100);
            const isSelected = selectedZone?.id === zone.id;

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
                    <p className="text-xs text-slate-500 mt-1">{zone.category} • {zone.campus}</p>
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
                    {available} Free ({percent}%)
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

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Permits:</span>
                  {zone.allowedPermitTypes.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] uppercase font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Zone Detail & Live Bay Map Simulator (7 cols) */}
        <div className="lg:col-span-7">
          {selectedZone ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold bg-blue-950 text-amber-400 px-2.5 py-1 rounded-lg">
                      {selectedZone.code}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-heading">
                        {selectedZone.name}
                      </h3>
                      <p className="text-xs text-slate-500">{selectedZone.locationDescription}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-blue-950">
                    {selectedZone.totalBays - selectedZone.occupiedBays}
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">Bays Available</span>
                </div>
              </div>

              {isAdmin ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Zone Management</p>
                    <p className="text-[11px] text-slate-500">{selectedZone.totalBays} bays • {selectedZone.restrictions}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeBay(selectedZone.id)} className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer">- Remove Bay</button>
                    <button onClick={() => addBay(selectedZone.id)} className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer">+ Add Bay</button>
                    <button onClick={openRules} className="px-3 py-1.5 bg-blue-950 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> Edit Rules</button>
                  </div>
                </div>
              ) : (
                <>
              {/* Bay Occupancy Simulator Bar */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-800">Vehicle Entry / Exit Simulator</p>
                  <p className="text-[11px] text-slate-500">
                    Entry adds one occupied bay, Exit frees one
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateCarExit(selectedZone.id)}
                    disabled={selectedZone.occupiedBays <= 0}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    - Vehicle Exit
                  </button>
                  <button
                    onClick={() => handleSimulateCarEntry(selectedZone.id)}
                    disabled={selectedZone.occupiedBays >= selectedZone.totalBays}
                    className="px-3 py-1.5 bg-blue-950 text-white rounded-lg text-xs font-bold hover:bg-blue-900 disabled:opacity-50 shadow-xs"
                  >
                    + Vehicle Entry
                  </button>
                </div>
              </div>

                </>
              )}

              {/* Live Bay Layout Grid */}
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
                  {Array.from({ length: selectedZone.totalBays }).map((_, index) => {
                    const isOccupied = index < selectedZone.occupiedBays;
                    const bayNumber = `${selectedZone.code}-${(index + 1).toString().padStart(2, '0')}`;

                    return (
                      <div
                        key={index}
                        title={`Bay ${bayNumber}: ${isOccupied ? 'Occupied' : 'Available'}`}
                        className={`h-10 rounded-lg flex flex-col items-center justify-center text-[9px] font-mono font-bold transition-all ${
                          isOccupied
                            ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/80 hover:bg-emerald-900'
                        }`}
                      >
                        <span>{index + 1}</span>
                        <Car className={`w-3 h-3 ${isOccupied ? 'text-rose-400' : 'text-emerald-500 opacity-30'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Allowed Categories & Security Rules */}
              <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-200 text-xs space-y-2 text-blue-950">
                <div className="flex items-center gap-2 font-bold">
                  <Shield className="w-4 h-4 text-blue-800" />
                  <span>ALPR Authorization Rules for {selectedZone.name}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Only vehicles possessing an active permit under the following categories are granted automated entry. Any other vehicle scanning at boom gates enters an immediate <strong>15-minute grace period countdown</strong> before a citation is lodged:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedZone.allowedPermitTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2.5 py-1 bg-white text-blue-950 font-bold rounded-lg border border-blue-200 shadow-2xs uppercase text-[10px]"
                    >
                      ✓ {type} Permits
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              Select a zone to view bay status and restriction rules.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

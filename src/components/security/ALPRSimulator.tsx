import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { StatusBadge } from '../common/StatusBadge';
import { ALPRScanResult } from '../../types';
import {
  Camera,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Clock,
  Car,
  MapPin,
  Eye,
  Sliders,
  Radio,
  Zap,
} from 'lucide-react';

export const ALPRSimulator: React.FC = () => {
  const { simulateALPRScan, zones, recentScans, violations } = useApp();

  const [inputPlate, setInputPlate] = useState('FSK 123 GP');
  const [plateError, setPlateError] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || 'z1');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ALPRScanResult | null>(
    recentScans[0] || null
  );

  // Preset Test Scenarios for instant evaluation
  const testScenarios = [
    {
      label: 'Valid Student Permit',
      plate: 'FSK 123 GP',
      zoneId: 'z2', // Student Lot B
      expected: 'Authorized (Gate Open)',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
    {
      label: 'Valid Staff Permit',
      plate: 'BLM 789 FS',
      zoneId: 'z1', // Staff Quad
      expected: 'Authorized (Gate Open)',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
    {
      label: 'Pre-Registered Visitor',
      plate: 'HJK 552 FS',
      zoneId: 'z3', // Visitor Parking Lot
      expected: 'Authorized (Visitor Pass)',
      color: 'bg-teal-50 text-teal-900 border-teal-200',
    },
    {
      label: 'Expired Student Permit',
      plate: 'KVS 404 FS',
      zoneId: 'z2',
      expected: 'Denied (Expired -> 15m Grace)',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      label: 'Zone Mismatch (Student in Staff Zone)',
      plate: 'FSK 123 GP',
      zoneId: 'z1', // Staff Quad
      expected: 'Denied (Zone Mismatch)',
      color: 'bg-rose-50 text-rose-900 border-rose-200',
    },
    {
      label: 'Unregistered Unknown Vehicle',
      plate: 'CA 998 123',
      zoneId: 'z2',
      expected: 'Denied (No Permit -> 15m Grace)',
      color: 'bg-rose-50 text-rose-900 border-rose-200',
    },
  ];

  const handleRunScan = (plateToScan = inputPlate, zoneToScan = selectedZoneId) => {
    const clean = (plateToScan || '').trim().toUpperCase().replace(/\s+/g, ' ');
    if (!/^[A-Z0-9]{1,4}( ?[A-Z0-9]{1,4}){1,2}$/.test(clean) || !/\d/.test(clean)) {
      setPlateError('Licence plate format not recognised. Please re-enter the plate, for example FSK 123 GP.');
      return;
    }
    setPlateError('');
    setIsScanning(true);

    setTimeout(() => {
      const result = simulateALPRScan(plateToScan.toUpperCase().trim(), zoneToScan);
      setLastScanResult(result);
      setIsScanning(false);
    }, 600); // realistic OCR processing delay
  };

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500 text-blue-950">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                ALPR Optical Scanner Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Automated License Plate Recognition (ALPR) Verification Engine • UFS Campus Boom Gate Sensor
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-700">Camera Feed: Active</span>
          <span className="text-slate-400">| 60 FPS</span>
        </div>
      </div>

      {/* Preset Scenario Quick Launch Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>One-Click Test Scenarios (Recommended for Demonstration & Examiners):</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {testScenarios.map((scen, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputPlate(scen.plate);
                setSelectedZoneId(scen.zoneId);
                handleRunScan(scen.plate, scen.zoneId);
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between hover:shadow-sm transition-all text-xs ${scen.color}`}
            >
              <div>
                <p className="font-bold text-[11px] truncate">{scen.label}</p>
                <p className="font-mono text-[10px] mt-0.5 font-bold">{scen.plate}</p>
              </div>
              <span className="text-[9px] font-semibold mt-2 opacity-80">{scen.expected}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scanner Main Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Camera Viewport HUD & Trigger (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between min-h-[380px]">
            {/* Viewport Ambient Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />

            {/* Camera Top HUD */}
            <div className="relative z-10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 font-bold uppercase tracking-wider text-[10px] text-white flex items-center gap-1 animate-pulse">
                  <Radio className="w-3 h-3" /> REC
                </span>
                <span className="font-mono text-slate-400">CAM-04 [BOOM-GATE-NORTH]</span>
              </div>
              <div className="text-right font-mono text-[11px] text-amber-400">
                {selectedZone?.code} • {selectedZone?.name}
              </div>
            </div>

            {/* Target Reticle / Plate Frame */}
            <div className="relative z-10 my-8 flex flex-col items-center justify-center">
              <div className="relative p-6 border-2 border-amber-400/70 rounded-2xl bg-slate-900/80 backdrop-blur-md shadow-2xl max-w-sm w-full text-center">
                {/* HUD Corner Accents */}
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

                <div className="flex items-center justify-center mb-3">
                  <SouthAfricanPlate plateNumber={inputPlate || 'FSK 123 GP'} size="lg" />
                </div>

                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>OCR Confidence: {isScanning ? 'Computing...' : '98.7%'}</span>
                  <span>|</span>
                  <span>Lighting: Optimal</span>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white space-y-2 animate-in fade-in">
                    <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                    <p className="text-xs font-bold font-mono tracking-widest text-amber-400">
                      IDENTIFYING LICENSE PLATE...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Bottom Controls */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Target Parking Zone
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.code} - {z.name} ({z.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Manual Plate Input
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputPlate}
                    onChange={(e) => setInputPlate(e.target.value.toUpperCase())}
                    placeholder="e.g. FSK 123 GP"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono-plate font-bold uppercase text-amber-400"
                  />
                  <button
                    onClick={() => handleRunScan()}
                    disabled={isScanning}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-blue-950 font-bold rounded-xl text-xs shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Scan</span>
                  </button>
                </div>
                {plateError && <p className="mt-2 text-[11px] text-rose-400 font-semibold">{plateError}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Scan Result & Boom Gate Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {lastScanResult ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Boom Gate Authorization Header */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  lastScanResult.status === 'authorized'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : lastScanResult.status === 'grace_period'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {lastScanResult.status === 'authorized' ? (
                    <div className="p-2 rounded-xl bg-emerald-600 text-white">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-rose-600 text-white">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-sm font-heading">
                      {lastScanResult.status === 'authorized'
                        ? 'ACCESS GRANTED'
                        : 'ACCESS RESTRICTED'}
                    </h3>
                    <p className="text-xs font-semibold opacity-90">
                      Boom Gate: {(lastScanResult.gateAction || 'hold').toUpperCase()}
                    </p>
                  </div>
                </div>

                <StatusBadge status={lastScanResult.status} />
              </div>

              {/* Verified Plate */}
              <div className="text-center py-1">
                <SouthAfricanPlate plateNumber={lastScanResult.plateNumber ?? ""} size="md" />
              </div>

              {/* Diagnostic Match Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Verification Result:</span>
                  <span className="font-bold text-slate-900">{lastScanResult.reason}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Scanned Zone:</span>
                  <span className="font-bold text-slate-900">{lastScanResult.zoneName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Timestamp:</span>
                  <span className="font-mono text-slate-700">{lastScanResult.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">OCR Confidence:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {((lastScanResult.confidence ?? 0) * 100).toFixed(1)}%
                  </span>
                </div>

                {lastScanResult.permitHolder && (
                  <div className="flex justify-between items-center border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500 font-medium">Permit Holder:</span>
                    <span className="font-bold text-blue-950">
                      {lastScanResult.permitHolder} ({lastScanResult.permitType ? lastScanResult.permitType.toUpperCase() : 'PERMIT'})
                    </span>
                  </div>
                )}
              </div>

              {/* Grace Period Notification Alert */}
              {lastScanResult.gracePeriodSeconds && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Active 15-Minute Grace Period Initiated</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    Vehicle entered zone without valid permit. Grace period timer is now counting down on the Security Console. A citation will automatically be lodged if the vehicle is not authorized or vacated within 15 minutes.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              Run a scan to view optical recognition result and boom gate telemetry.
            </div>
          )}
        </div>
      </div>

      {/* Recent ALPR Scans Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Recent ALPR Scanner Audit Logs
            </h3>
            <p className="text-xs text-slate-500">Live feed from all campus boom gates and surveillance posts</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Real-time Stream</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">License Plate</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Result Status</th>
                <th className="py-3 px-4">Gate Action</th>
                <th className="py-3 px-4">System Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentScans.slice(0, 8).map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono text-slate-500">{scan.timestamp}</td>
                  <td className="py-3 px-4">
                    <SouthAfricanPlate plateNumber={scan.plateNumber ?? ""} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{scan.zoneName}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {((scan.confidence ?? 0) * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={scan.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold uppercase text-[10px] text-slate-700">
                    {scan.gateAction}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{scan.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

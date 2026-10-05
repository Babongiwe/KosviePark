import React, { useState } from 'react';
import {
  X,
  MapPin,
  Accessibility,
  FileText,
  Download,
  AlertTriangle,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Building,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { UFSBrandLogo } from './UFSBrandLogo';

interface UFSParkingFacilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'facilities' | 'accessible' | 'maps' | 'visitors' | 'procedure' | 'compliance';
}

export const UFSParkingFacilitiesModal: React.FC<UFSParkingFacilitiesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'facilities',
}) => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'accessible' | 'maps' | 'visitors' | 'procedure' | 'compliance'>(initialTab);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadMap = () => {
    // Generate a dummy text/pdf blob download for ufs-campus-map.pdf
    const content = `University of the Free State (UFS) - Campus Parking Map 2026
Campuses: Bloemfontein Main Campus, Qwaqwa Campus, South Campus
Motto: In Veritate Sapientiae Lux | Slogan: Inspiring excellence. Transforming lives.
Centre for Universal Access and Disability Support (CUADS): cuads@ufs.ac.za
Visitors Centre: +27 51 401 9111 | Parking Office: parking@ufs.ac.za`;
    
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ufs-campus-map.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('ufs-campus-map.pdf downloaded successfully');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadProcedure = () => {
    const content = `University of the Free State - Official Parking Procedure & Compliance Policy
Campuses Covered: Bloemfontein, Qwaqwa, South Campus

1. GENERAL STIPULATIONS
- All staff, students, and visitors parking vehicles on UFS property must possess a valid permit or pass.
- Accessible parking bays are reserved exclusively for persons registered with CUADS (cuads@ufs.ac.za).
- Visitors must register at the Visitors Centre (+27 51 401 9111) for temporary access cards.

2. NON-COMPLIANCE & FINES
Strict action will be taken against persons who do not meet the stipulations of the procedure. Fines will be imposed for the violation of parking rules. The income will be reinvested in the maintenance of an orderly parking environment on campus.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UFS-Parking-Procedure-Policy.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('UFS Parking Procedure document downloaded');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="bg-[#002B49] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <UFSBrandLogo size="sm" showSubtitle={false} showSlogan={false} theme="dark" />
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif tracking-tight">
                UFS Parking Facilities & Regulations
              </h2>
              <p className="text-xs text-amber-300 font-serif italic">
                Bloemfontein • Qwaqwa • South Campus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-4 pt-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'facilities', label: 'Parking Facilities', icon: <Building className="w-4 h-4" /> },
            { id: 'accessible', label: 'Accessible (CUADS)', icon: <Accessibility className="w-4 h-4 text-blue-600" /> },
            { id: 'maps', label: 'Campus Maps', icon: <Navigation className="w-4 h-4 text-emerald-600" /> },
            { id: 'visitors', label: 'Visitor Parking', icon: <Phone className="w-4 h-4 text-indigo-600" /> },
            { id: 'procedure', label: 'Parking Procedure', icon: <FileText className="w-4 h-4 text-amber-600" /> },
            { id: 'compliance', label: 'Non-Compliance & Fines', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white text-[#002B49] border-t-2 border-t-[#002B49] shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Download notification banner */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 text-slate-700 text-xs sm:text-sm space-y-4 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: Parking Facilities */}
          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 text-[#002B49] font-bold text-sm mb-1 font-serif">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Parking Availability Across All 3 UFS Campuses</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The University of the Free State provides dedicated parking facilities for staff, students, and visitors across the <strong>Bloemfontein Campus</strong>, <strong>Qwaqwa Campus</strong>, and <strong>South Campus</strong>. This is a distinct advantage, as many other South African universities situated in dense urban areas do not offer this facility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 block mb-1">
                    Bloemfontein Campus
                  </span>
                  <p className="text-xs text-slate-600">
                    Main Campus featuring North, South, and Central zones with over 2,500 bays, automated ALPR boom gates, and designated staff/student lots.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 block mb-1">
                    Qwaqwa Campus
                  </span>
                  <p className="text-xs text-slate-600">
                    Central hub parking situated in Phuthaditjhaba near administration buildings, libraries, and residence quarters.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 block mb-1">
                    South Campus
                  </span>
                  <p className="text-xs text-slate-600">
                    Church Street facilities serving open learning, distance education, staff, and registered visitors with secure gate clearance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Accessible Parking (CUADS) */}
          {activeTab === 'accessible' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/90 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2.5 text-[#002B49] font-bold text-sm mb-2 font-serif">
                  <Accessibility className="w-5 h-5 text-blue-600" />
                  <span>Accessible Parking & CUADS Support</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  There are designated parking spaces located close to building entrances across all campuses for people with physical disabilities.
                </p>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-2">
                <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wide">
                  Application Procedure for Disability / Accessible Permits:
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Students or members of staff with disabilities <strong>must submit their parking applications to the Centre for Universal Access and Disability Support (CUADS)</strong>.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:cuads@ufs.ac.za?subject=UFS%20Accessible%20Parking%20Permit%20Application"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#002B49] text-white font-bold text-xs hover:bg-[#001A30] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email CUADS (cuads@ufs.ac.za)</span>
                  </a>
                  <span className="text-xs text-slate-500">
                    Direct Email: <strong className="text-slate-800">cuads@ufs.ac.za</strong>
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Required Documents for CUADS Permit:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Valid Medical Certificate or Accessibility Assessment from a registered practitioner</li>
                  <li>Student / Staff identification number and vehicle registration plate</li>
                  <li>Copy of driver&apos;s license and municipal disability disc (if applicable)</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Campus Maps */}
          {activeTab === 'maps' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-1 font-serif">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                    <span>UFS Official Campus Maps</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    It is recommended that the campus maps are consulted for information on open parking areas and specific parking zones.
                  </p>
                </div>
                <button
                  onClick={handleDownloadMap}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ufs-campus-map.pdf</span>
                </button>
              </div>

              {/* Visual Zone Directory */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Campus Parking Zones Overview:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-900 block">ZONE-A1: Student North Residence Lot</span>
                    <span className="text-slate-500 text-[11px]">Bloemfontein Campus • Near Roosmaryn & Asterhof</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-900 block">ZONE-A2: West Campus General Parking</span>
                    <span className="text-slate-500 text-[11px]">Bloemfontein Campus • Faculty of Humanities</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-900 block">ZONE-Q1: Qwaqwa Central Hub & Admin</span>
                    <span className="text-slate-500 text-[11px]">Qwaqwa Campus • Phuthaditjhaba central ring road</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-900 block">ZONE-S1: South Campus Main Concourse</span>
                    <span className="text-slate-500 text-[11px]">South Campus • Church Street entrance</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Visitor Parking & Visitors Centre */}
          {activeTab === 'visitors' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm mb-1 font-serif">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Visitor Parking Protocol</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Visitors can park on campus and must register at the Visitors Centre to receive a temporary access card or digital pass.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Phone className="w-4 h-4 text-[#C8102E]" />
                  <span>UFS Visitors Centre Contact Information</span>
                </div>
                <p className="text-xs text-slate-600">
                  For more detailed information or to arrange group visits and conference access:
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="tel:+27514019111"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#002B49] text-white font-bold text-xs hover:bg-[#001A30] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call +27 51 401 9111</span>
                  </a>
                  <span className="text-xs text-slate-600">
                    Operating Hours: Monday – Friday, 07:30 – 16:30
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Parking Procedure */}
          {activeTab === 'procedure' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm mb-1 font-serif">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Official UFS Parking Procedure</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Access the complete regulations, zoning allocations, and permit renewal rules governing all university properties.
                  </p>
                </div>
                <button
                  onClick={handleDownloadProcedure}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001A30] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Parking Procedure</span>
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Key Procedure Points:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>Permits are non-transferable and tied to specific vehicle registrations.</li>
                  <li>Vehicles must park strictly within marked parking bays in the designated zone category.</li>
                  <li>Parking on walkways, red lines, lawns, or blocking disabled bays is strictly prohibited.</li>
                  <li>A 15-minute courtesy grace period is granted for drop-offs before ALPR citation triggers.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 6: Non-Compliance & Fines */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50/90 rounded-xl border border-rose-200">
                <div className="flex items-center gap-2 text-rose-950 font-bold text-sm mb-2 font-serif">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Parking: Non-Compliance & Enforcement</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed font-medium">
                  Strict action will be taken against persons who do not meet the stipulations of the procedure. Fines will be imposed for the violation of parking rules. The income will be reinvested in the maintenance of an orderly parking environment on campus.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Fine Reinvestment & Campus Safety:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All funds collected from citations and parking violations directly support:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Surveillance & ALPR Upgrades</span>
                    <span className="text-slate-500 text-[11px]">Upgrading high-definition boom gate cameras and 24/7 security lighting across all 3 campuses.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Asphalt & Bay Marking</span>
                    <span className="text-slate-500 text-[11px]">Regular repaving, clear yellow/blue disability line marking, and accessible ramps.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-serif italic">
            <span>University of the Free State</span> • <span className="text-amber-700 font-medium">Inspiring excellence. Transforming lives.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#002B49] hover:bg-[#001A30] text-white font-bold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

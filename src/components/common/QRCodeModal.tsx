import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, Printer, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { SouthAfricanPlate } from './SouthAfricanPlate';

export const QRCodeModal: React.FC = () => {
  const { selectedQRModalData, closeQRModal, addToast } = useApp();

  // Support closing modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQRModal();
      }
    };
    if (selectedQRModalData) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedQRModalData, closeQRModal]);

  if (!selectedQRModalData) return null;

  const { title, subtitle, code, details } = selectedQRModalData;

  const handlePrint = () => {
    window.print();
  };

  const handleSavePass = () => {
    try {
      const passSummary = `====================================================
UNIVERSITY OF THE FREE STATE - KOVSIEPARK DIGITAL PASS
====================================================
Permit / Pass Code: ${code}
Type: ${title}
Reference: ${subtitle}
Generated: ${new Date().toLocaleString()}

DETAILS:
${Object.entries(details)
  .map(([k, v]) => `• ${k}: ${v}`)
  .join('\n')}

====================================================
Inspiring excellence. Transforming lives.
Centre for Universal Access and Disability Support: cuads@ufs.ac.za
Visitors Centre: +27 51 401 9111
====================================================`;

      const blob = new Blob([passSummary], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `UFS-Digital-Pass-${code}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('Pass Saved', `Digital pass ${code} has been downloaded to your device.`, 'success');
    } catch {
      addToast('Saved', `Pass reference ${code} ready for display.`, 'info');
    }
  };

  return (
    <div
      onClick={closeQRModal}
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Digital Access Pass"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 my-6"
      >
        {/* Navigation & Back Bar Header */}
        <div className="bg-[#002B49] text-white p-4 sm:p-5 flex items-start justify-between relative overflow-hidden border-b border-slate-800">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start gap-3">
            <button
              onClick={closeQRModal}
              className="mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
              title="Return / Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-blue-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide font-sans">
                  UFS KovsiePark
                </span>
                <span className="text-xs text-blue-200">Digital Access Pass</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mt-1 text-white font-serif">{title}</h3>
              <p className="text-xs text-blue-200 mt-0.5">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={closeQRModal}
            className="text-blue-200 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0 ml-2"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Simulated QR Code Canvas */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center">
            <div className="w-40 h-40 sm:w-44 sm:h-44 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center relative">
              {/* CSS QR Code Matrix Representation */}
              <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 p-1 bg-slate-950 rounded-lg">
                {Array.from({ length: 36 }).map((_, i) => {
                  const isCorner = [0, 1, 6, 7, 4, 5, 10, 11, 24, 25, 30, 31].includes(i);
                  const isRandomDark = [2, 9, 14, 15, 20, 22, 27, 33, 35].includes(i);
                  return (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        isCorner ? 'bg-white' : isRandomDark ? 'bg-amber-400' : 'bg-slate-800'
                      }`}
                    />
                  );
                })}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 px-2.5 py-1 rounded-md text-[10px] font-extrabold text-blue-950 shadow-xs border border-slate-200">
                  UFS ALPR
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="font-mono text-xs font-bold text-slate-800 tracking-wider">{code}</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified in KovsiePark Central Registry</span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            {Object.entries(details).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                <span className="text-slate-500 font-medium">{key}</span>
                {key.toLowerCase().includes('plate') || key.toLowerCase().includes('vehicle reg') ? (
                  <SouthAfricanPlate plateNumber={val} size="sm" />
                ) : (
                  <span className="font-semibold text-slate-800 text-right">{val}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-900 rounded-xl text-xs border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Present this digital QR pass at campus boom gates or display on your dashboard if requested.</span>
          </div>

          {/* Action Buttons: Print & Save */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Pass</span>
            </button>
            <button
              type="button"
              onClick={handleSavePass}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Save Pass</span>
            </button>
          </div>

          {/* Dedicated Back / Return Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={closeQRModal}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 text-[#C8102E]" />
              <span>← Back to Dashboard / Return</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

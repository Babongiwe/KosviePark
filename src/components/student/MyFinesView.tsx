import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon } from 'lucide-react';

export const MyFinesView: React.FC = () => {
  const { currentUser, fines, vehicles } = useApp();
  const myPlates = vehicles
    .filter((v) => v.ownerId === currentUser?.id)
    .map((v) => v.registrationNumber.toUpperCase());
  const myFines = fines.filter((f) => myPlates.includes((f.vehicleRegistration || '').toUpperCase()));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#002B49] text-white flex items-center justify-center shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">My Fines</h2>
          <p className="text-xs text-slate-500 mt-1">Fines issued to your registered vehicles.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {myFines.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No fines have been issued to your vehicles.</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                {['Fine reference', 'Licence plate', 'Reason', 'Zone', 'Amount', 'Date issued', 'Status'].map((h) => (
                  <th key={h} className="text-left font-bold px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myFines.map((f) => {
                const settled = f.status === 'paid' || f.status === 'waived';
                return (
                  <tr key={f.id}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{f.fineNumber}</td>
                    <td className="px-4 py-3 font-mono">{f.vehicleRegistration}</td>
                    <td className="px-4 py-3">{f.reason}</td>
                    <td className="px-4 py-3">{f.zoneName}</td>
                    <td className="px-4 py-3 font-bold">R {f.amount}</td>
                    <td className="px-4 py-3">{f.issueDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          settled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {settled ? 'Settled' : 'Fine Issued'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

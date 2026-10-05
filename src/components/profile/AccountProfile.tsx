import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { User, Mail, Phone, Building, GraduationCap, Shield, Bell, CheckCircle2 } from 'lucide-react';

export const AccountProfile: React.FC = () => {
  const { currentUser, vehicles, permits, fines, updateCurrentUser, addToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');

  if (!currentUser) return null;

  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser.id);
  const userPermits = permits.filter((p) => p.userId === currentUser.id);
  const plates = userVehicles.map((v) => v.registrationNumber);
  const openFines = fines.filter((f) => plates.includes(f.vehicleRegistration) && f.status === 'unpaid').length;
  const startEdit = () => { setEmail(currentUser.email); setPhone(currentUser.phoneNumber); setErr(''); setEditing(true); };
  const save = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr('Please enter a valid email address.');
    if (!/^\+?[0-9 ]{10,15}$/.test(phone.trim())) return setErr('Please enter a valid phone number.');
    updateCurrentUser({ email: email.trim(), phoneNumber: phone.trim() });
    addToast('Details Saved', 'Your contact details have been updated.', 'success');
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
          alt={currentUser.name}
          className="w-24 h-24 rounded-full border-4 border-amber-400 shadow-md object-cover"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              {currentUser.name}
            </h2>
            <StatusBadge status={currentUser.role} />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            {currentUser.role === 'student' ? 'Student No: ' : currentUser.role === 'visitor' ? 'Guest / Visitor ID: ' : 'Staff ID: '}
            <strong className="text-slate-700">{currentUser.identifierNumber}</strong>
          </p>
          <p className="text-xs text-slate-600 font-medium">
            {currentUser.departmentOrFaculty} • Bloemfontein Main Campus
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 font-heading">Contact & Academic Profile</h3>
            {!editing && (
              <button onClick={startEdit} className="py-1.5 px-3 rounded-lg bg-blue-950 text-white font-bold text-[11px] cursor-pointer">Edit My Details</button>
            )}
          </div>
          {editing ? (
            <div className="space-y-3">
              {err && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{err}</div>}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditing(false)} className="py-2 px-4 rounded-lg border border-slate-300 font-bold cursor-pointer">Cancel</button>
                <button onClick={save} className="py-2 px-4 rounded-lg bg-blue-950 text-white font-bold cursor-pointer">Save</button>
              </div>
            </div>
          ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{currentUser.phoneNumber || '+27 82 123 4567'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{currentUser.departmentOrFaculty}</span>
            </div>
          </div>
          )}
        </div>

        {/* Security & ALPR Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 font-heading border-b border-slate-100 pb-3">
            ALPR Boom Gate Authorization
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Active Permits:</span>
              <span className="font-bold text-emerald-700">{userPermits.length} Issued</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registered Plates:</span>
              <span className="font-bold text-slate-900">{userVehicles.length} Vehicles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Clearance:</span>
              <span className={`font-bold ${openFines ? 'text-rose-700' : 'text-emerald-700'}`}>{openFines === 0 ? 'Good Standing (0 Fines)' : `${openFines} Outstanding Fine(s)`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Vehicles Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-sm text-slate-900 font-heading mb-4">
          Linked Vehicles on Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userVehicles.map((v) => (
            <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900">{v.make} {v.model}</p>
                <p className="text-[11px] text-slate-500">{v.color} • {v.year}</p>
              </div>
              <SouthAfricanPlate plateNumber={v.registrationNumber} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

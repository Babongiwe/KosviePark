import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import {
  CalendarCheck,
  Car,
  User,
  Building,
  Clock,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Phone,
  Info,
} from 'lucide-react';

interface VisitorPortalProps {
  staffMode?: boolean;
}

export const VisitorPortal: React.FC<VisitorPortalProps> = ({ staffMode = false }) => {
  const { createVisitorReservation, openQRModal, currentUser, activeRole } = useApp();

  const staffRoleLabel =
    activeRole === 'admin' ? 'Administrator' : activeRole === 'security' ? 'Campus Security' : 'Staff';

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [visitorName, setVisitorName] = useState(staffMode ? 'Dr. Lerato Khumalo' : currentUser?.name || '');
  const [visitorEmail, setVisitorEmail] = useState(staffMode ? 'lkhumalo@guest.ufs.ac.za' : currentUser?.email || '');
  const [visitorPhone, setVisitorPhone] = useState(staffMode ? '+27 83 555 1234' : currentUser?.phoneNumber || '');
  const [visitorType, setVisitorType] = useState('Guest Speaker / Academic Guest');

  const [vehiclePlate, setVehiclePlate] = useState('HJK 552 FS');
  const [vehicleMakeModel, setVehicleMakeModel] = useState('Hyundai Tucson (Silver)');

  const [hostPerson, setHostPerson] = useState('Prof. A. Van Der Merwe');
  const [hostDepartment, setHostDepartment] = useState('Computer Science & Informatics');
  const [purpose, setPurpose] = useState('External Examiner for Honours Software Engineering Presentations');

  const [visitDate, setVisitDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('15:00');

  const [assignedBay, setAssignedBay] = useState<string>('V-14');
  const [createdPass, setCreatedPass] = useState<any>(null);

  const [stepError, setStepError] = useState('');

  const validateStep = (n: number): string => {
    if (n === 1) {
      if (!visitorName.trim()) return 'Please enter the visitor\'s full name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail.trim())) return 'Please enter a valid email address.';
      if (!/^\+?[0-9\s]{10,13}$/.test(visitorPhone.trim())) return 'Please enter a valid phone number (10 digits).';
    }
    if (n === 2) {
      if (!/^[A-Za-z0-9\s]{4,12}$/.test(vehiclePlate.trim())) return 'Please enter a valid vehicle registration number.';
      if (!vehicleMakeModel.trim()) return 'Please describe the vehicle (make, model, colour).';
    }
    if (n === 3) {
      if (!hostPerson.trim()) return 'Please enter the person or department being visited.';
      if (!purpose.trim()) return 'Please enter the purpose of the visit.';
    }
    if (n === 4) {
      if (!visitDate || visitDate < new Date().toISOString().slice(0, 10)) return 'Visit date cannot be in the past.';
      if (!startTime || !endTime || endTime <= startTime) return 'Departure time must be after arrival time.';
    }
    return '';
  };

  const goNext = (from: number, to: 2 | 3 | 4) => {
    const err = validateStep(from);
    setStepError(err);
    if (!err) setStep(to);
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const err4 = validateStep(4);
    setStepError(err4);
    if (err4) return;
    const newRes = createVisitorReservation({
      visitorName,
      visitorEmail,
      visitorPhone,
      visitorType,
      vehicleRegistration: vehiclePlate.toUpperCase(),
      vehicleMakeModel,
      hostPerson,
      hostDepartment,
      purpose,
      visitDate,
      startTime,
      endTime,
      assignedBayNumber: assignedBay,
      ...(staffMode && currentUser
        ? { registeredByName: currentUser.name, registeredByRole: currentUser.role }
        : {}),
    });

    setCreatedPass(newRes);
    setStep(5);
  };

  const handleShowQR = () => {
    if (!createdPass) return;
    openQRModal({
      title: 'UFS Visitor Parking Pass',
      subtitle: createdPass.reservationCode || createdPass.reservationNumber,
      code: createdPass.qrCodeData,
      details: {
        'Pass Number': createdPass.reservationCode || createdPass.reservationNumber,
        'Temporary Permit': createdPass.temporaryPermitCode,
        'Visitor Name': createdPass.visitorName,
        'Vehicle Plate': createdPass.vehicleRegistration,
        'Vehicle Model': createdPass.vehicleMakeModel,
        'Assigned Bay': `Zone V1 • Bay ${createdPass.assignedBayNumber}`,
        'Visit Date': `${createdPass.visitDate} (${createdPass.startTime} - ${createdPass.endTime})`,
        'Host Person': `${createdPass.hostPerson} (${createdPass.hostDepartment})`,
        ...(createdPass.registeredByName ? { 'Registered By': createdPass.registeredByName } : {}),
        'Status': 'CONFIRMED',
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-teal-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
            {staffMode ? 'Staff-Assisted Visitor Registration' : 'Guest & Visitor Portal'}
          </span>
          <span className="text-xs text-teal-200">University of the Free State</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
          {staffMode ? 'Register a Campus Visitor' : 'Pre-Register Campus Visitor Parking'}
        </h1>
        <p className="text-xs sm:text-sm text-teal-100/80 mt-1">
          Reserve an allocated visitor bay and receive an automated ALPR pass for boom gate clearance
        </p>
      </div>

      {/* Official UFS Visitors Centre Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950 block">UFS Visitor Parking Procedure:</span>
            <p className="text-amber-900 leading-relaxed mt-0.5">
              Visitors can park on campus and must register at the Visitors Centre to receive a temporary access card, or pre-register below for instant ALPR clearance.
            </p>
          </div>
        </div>
        <a
          href="tel:+27514019111"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002B49] text-white font-bold text-xs hover:bg-slate-900 transition-colors whitespace-nowrap self-start sm:self-center"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Visitors Centre: +27 51 401 9111</span>
        </a>
      </div>

      {/* 5-Step Progress Indicators */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          {[
            { num: 1, label: 'Visitor' },
            { num: 2, label: 'Vehicle' },
            { num: 3, label: 'Host' },
            { num: 4, label: 'Slot & Bay' },
            { num: 5, label: 'Digital Pass' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 ${
                step === s.num
                  ? 'text-teal-700 font-extrabold'
                  : step > s.num
                  ? 'text-slate-800'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? 'bg-teal-600 text-white'
                    : step > s.num
                    ? 'bg-slate-200 text-slate-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {stepError && (
        <div role="alert" className="mb-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
          {stepError}
        </div>
      )}

      {/* Main Step Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* STEP 1: Visitor Info */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Step 1: Visitor Information</h3>
              <p className="text-slate-500">Enter your contact details so we can email your pass confirmation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Visitor Category</label>
                <select
                  value={visitorType}
                  onChange={(e) => setVisitorType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Guest Speaker / Academic Guest">Guest Speaker / Academic Guest</option>
                  <option value="Official University Contractor">Official University Contractor</option>
                  <option value="Conference / Workshop Attendee">Conference / Workshop Attendee</option>
                  <option value="Prospective Student & Parent">Prospective Student & Parent</option>
                  <option value="General Public Visitor">General Public Visitor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cell Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => goNext(1, 2)}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold shadow-sm"
              >
                <span>Next: Vehicle Information</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle Details */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Step 2: Vehicle Details</h3>
              <p className="text-slate-500">Provide the license plate number that will be scanned at campus boom gates.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">License Plate Number *</label>
              <input
                type="text"
                required
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                placeholder="e.g. HJK 552 FS"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl uppercase font-mono-plate font-bold text-base text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Camera optical scanners match this plate automatically for seamless entry.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Vehicle Make, Model & Color *</label>
              <input
                type="text"
                required
                value={vehicleMakeModel}
                onChange={(e) => setVehicleMakeModel(e.target.value)}
                placeholder="e.g. Hyundai Tucson (Silver)"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => goNext(2, 3)}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold shadow-sm"
              >
                <span>Next: Host Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Host & Purpose */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Step 3: UFS Host & Purpose of Visit</h3>
              <p className="text-slate-500">Provide the staff member or department you are visiting.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Host Staff / Faculty Member *</label>
                <input
                  type="text"
                  required
                  value={hostPerson}
                  onChange={(e) => setHostPerson(e.target.value)}
                  placeholder="e.g. Prof. A. Van Der Merwe"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department / Division *</label>
                <input
                  type="text"
                  required
                  value={hostDepartment}
                  onChange={(e) => setHostDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Informatics"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Purpose of Campus Visit *</label>
              <textarea
                rows={2}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Guest lecture, meeting with dean, research collaboration..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => goNext(3, 4)}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold shadow-sm"
              >
                <span>Next: Bay & Time Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Date, Time & Bay Selection */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">Step 4: Campus, Reservation Date & Bay</h3>
              <p className="text-slate-500">Select your destination UFS campus, arrival date and preferred visitor bay.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Destination UFS Campus *</label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              >
                <option value="Bloemfontein Main Campus">Bloemfontein Campus (Main)</option>
                <option value="Qwaqwa Campus">Qwaqwa Campus</option>
                <option value="South Campus">South Campus</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Visit Date *</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Arrival *</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Departure *</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Select Dedicated Visitor Bay (Zone V1 • Visitor Gateway & Welcome Center)
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {Array.from({ length: 20 }, (_, i) => `V-${String(i + 1).padStart(2, '0')}`).map((bayNum) => (
                  <button
                    key={bayNum}
                    type="button"
                    onClick={() => setAssignedBay(bayNum)}
                    className={`p-2.5 rounded-xl border text-center font-mono font-bold transition-all ${
                      assignedBay === bayNum
                        ? 'border-teal-700 bg-teal-800 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="block text-[10px] opacity-80">BAY</span>
                    <span className="text-sm">{bayNum}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary preview */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-1.5 text-teal-950">
              <div className="flex justify-between">
                <span className="text-slate-600">Visitor:</span>
                <span className="font-bold">{visitorName} ({visitorType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">License Plate:</span>
                <span className="font-mono font-bold">{vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Host:</span>
                <span className="font-semibold">{hostPerson} ({hostDepartment})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Allocated Space:</span>
                <span className="font-bold text-teal-900">Zone V1 • Bay {assignedBay}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Generate Visitor Pass</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Digital Pass Confirmation */}
        {step === 5 && createdPass && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-teal-100 text-teal-900 px-3 py-1 rounded-full">
                RESERVATION CONFIRMED
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
                Your Digital Visitor Pass is Ready!
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                A confirmation has been sent to <strong>{createdPass.visitorEmail}</strong>. Present this pass at the gate or drive up directly for ALPR recognition.
              </p>
            </div>

            {/* Digital Pass Card */}
            <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-2xl max-w-md mx-auto text-left border border-slate-800 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-400">UFS Visitor Pass</span>
                  <p className="font-mono text-lg font-bold text-white mt-0.5">
                    {createdPass.reservationCode || createdPass.reservationNumber}
                  </p>
                  <p className="font-mono text-[11px] font-bold text-amber-300 mt-0.5">
                    Temp Permit: {createdPass.temporaryPermitCode}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold bg-teal-800 text-teal-100 px-2 py-0.5 rounded">
                    Zone V1 • Bay {createdPass.assignedBayNumber}
                  </span>
                </div>
              </div>

              <div className="text-center py-2">
                <SouthAfricanPlate plateNumber={createdPass.vehicleRegistration} size="md" />
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Visitor:</span>
                  <span className="font-bold text-white">{createdPass.visitorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-semibold text-white">
                    {createdPass.visitDate} ({createdPass.startTime} - {createdPass.endTime})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Host:</span>
                  <span className="text-white">{createdPass.hostPerson}</span>
                </div>
                {createdPass.registeredByName && (
                  <div className="flex justify-between border-t border-slate-800 pt-1.5 mt-1.5">
                    <span className="text-slate-400">Registered by:</span>
                    <span className="font-semibold text-amber-300">
                      {createdPass.registeredByName} ({staffRoleLabel})
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleShowQR}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Show Large QR Code Pass</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-teal-800 hover:text-teal-700 underline"
              >
                Register another visitor reservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

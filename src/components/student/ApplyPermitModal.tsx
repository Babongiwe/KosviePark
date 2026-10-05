import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PermitType, ZoneCategory } from '../../types';
import { X, FilePlus, Upload, CheckCircle2, ShieldAlert, ArrowRight, ArrowLeft, Accessibility, Mail, Info } from 'lucide-react';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';

interface ApplyPermitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyPermitModal: React.FC<ApplyPermitModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, vehicles, submitPermitApplication, zones } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [permitType, setPermitType] = useState<PermitType>(
    currentUser?.role === 'staff' ? 'staff' : 'student'
  );
  const [selectedVehicleReg, setSelectedVehicleReg] = useState<string>(
    vehicles.find((v) => v.ownerId === currentUser?.id)?.registrationNumber || 'FSK 123 GP'
  );
  const [customPlate, setCustomPlate] = useState('');
  const [customMakeModel, setCustomMakeModel] = useState('');
  const [campus, setCampus] = useState('Bloemfontein Main Campus');
  const [preferredZoneCategory, setPreferredZoneCategory] = useState<ZoneCategory>(
    currentUser?.role === 'staff' ? 'Staff Parking' : 'Student Parking'
  );
  const [justification, setJustification] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState<string>('');
  const [medicalDocName, setMedicalDocName] = useState<string>('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!uploadedDocName) return setFormError('Please attach your proof of registration.');
    if (permitType === 'disability' && !medicalDocName) return setFormError('Please attach your medical certificate.');
    if (!agreedTerms) return setFormError('Please accept the declaration before submitting.');
    setFormError('');

    const finalPlate = selectedVehicleReg === 'NEW' ? customPlate.toUpperCase() : selectedVehicleReg;
    const finalMakeModel =
      selectedVehicleReg === 'NEW'
        ? customMakeModel || 'Unspecified Vehicle'
        : vehicles.find((v) => v.registrationNumber === selectedVehicleReg)
        ? `${vehicles.find((v) => v.registrationNumber === selectedVehicleReg)?.make} ${
            vehicles.find((v) => v.registrationNumber === selectedVehicleReg)?.model
          }`
        : 'Registered Vehicle';

    submitPermitApplication({
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantRole: currentUser.role,
      applicantNumber: currentUser.identifierNumber,
      permitType,
      vehicleRegistration: finalPlate,
      vehicleMakeModel: finalMakeModel,
      campus,
      preferredZoneCategory,
      justification: justification || 'Standard annual campus parking access.',
      studentProofDoc: uploadedDocName,
      disabilityProofDoc: medicalDocName || undefined,
    });

    onClose();
    setStep(1);
  };

  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 my-8">
        {/* Header */}
        <div className="bg-blue-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-blue-950">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">Apply for Campus Parking Permit</h3>
              <p className="text-xs text-blue-300">
                Step {step} of 3 • {step === 1 ? 'Permit & Campus' : step === 2 ? 'Vehicle Details' : 'Verification & Submit'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-1 rounded-lg hover:bg-blue-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form noValidate onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold">{formError}</div>
          )}
          {/* STEP 1: Permit Type & Campus Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Permit Category
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { type: 'student' as PermitType, label: 'Student Permit', desc: 'Standard student parking zones' },
                    { type: 'staff' as PermitType, label: 'Academic / Staff', desc: 'Staff designated quads & zones' },
                    { type: 'disability' as PermitType, label: 'Disability / Accessible', desc: 'Medical certificate required' },
                    { type: 'reserved' as PermitType, label: 'Reserved / Executive', desc: 'Specific designated bays' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setPermitType(item.type);
                        if (item.type === 'staff') setPreferredZoneCategory('Staff Parking');
                        else if (item.type === 'disability') setPreferredZoneCategory('Disability Parking');
                        else if (item.type === 'reserved') setPreferredZoneCategory('Reserved Parking');
                        else setPreferredZoneCategory('Student Parking');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        permitType === item.type
                          ? 'border-blue-900 bg-blue-50/80 ring-2 ring-blue-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{item.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessible Parking / CUADS Special Guidance Box */}
              {permitType === 'disability' && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Accessibility className="w-4 h-4 text-blue-700" />
                    <span>Centre for Universal Access and Disability Support (CUADS)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    There are designated parking spaces close to entrances for people with physical disabilities. Students or staff with disabilities must submit their parking applications and medical verification to CUADS:
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href="mailto:cuads@ufs.ac.za?subject=Accessible%20Parking%20Application%20Support"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-900 text-white font-bold text-[10px] hover:bg-blue-950 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-amber-400" />
                      <span>Email: cuads@ufs.ac.za</span>
                    </a>
                    <span className="text-[10px] text-slate-500">Fast-tracked accessible bay clearance</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    UFS Campus
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Bloemfontein Main Campus">Bloemfontein Main Campus</option>
                    <option value="Qwaqwa Campus">Qwaqwa Campus</option>
                    <option value="South Campus">South Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Zone Category
                  </label>
                  <select
                    value={preferredZoneCategory}
                    onChange={(e) => setPreferredZoneCategory(e.target.value as ZoneCategory)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Student Parking">Student Parking</option>
                    <option value="Staff Parking">Staff Parking</option>
                    <option value="Disability Parking">Disability Parking</option>
                    <option value="Reserved Parking">Reserved Parking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reason / Motivation for Permit (Optional)
                </label>
                <textarea
                  rows={2}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="e.g. Daily commuter, attending clinical training or evening classes on main campus..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { if (step === 1 && (!permitType || !campus || !preferredZoneCategory)) { setFormError('Please select a permit category, campus and zone category.'); return; } setFormError(''); setStep(2); }}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-950 text-white font-bold hover:bg-blue-900 shadow-sm"
                >
                  <span>Next: Vehicle Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Registered Vehicle for this Permit
                </label>
                <div className="space-y-2">
                  {userVehicles.map((veh) => (
                    <label
                      key={veh.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedVehicleReg === veh.registrationNumber
                          ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/10'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="vehicle-choice"
                          checked={selectedVehicleReg === veh.registrationNumber}
                          onChange={() => setSelectedVehicleReg(veh.registrationNumber)}
                          className="h-4 w-4 text-blue-950 focus:ring-blue-900"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {veh.make} {veh.model} ({veh.year})
                          </p>
                          <p className="text-[11px] text-slate-500">Color: {veh.color}</p>
                        </div>
                      </div>
                      <SouthAfricanPlate plateNumber={veh.registrationNumber} size="sm" />
                    </label>
                  ))}

                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedVehicleReg === 'NEW'
                        ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="vehicle-choice"
                        checked={selectedVehicleReg === 'NEW'}
                        onChange={() => setSelectedVehicleReg('NEW')}
                        className="h-4 w-4 text-blue-950 focus:ring-blue-900"
                      />
                      <div>
                        <p className="font-bold text-slate-900">Register a New Vehicle</p>
                        <p className="text-[11px] text-slate-500">Enter new license plate and make/model</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {selectedVehicleReg === 'NEW' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Vehicle License Plate *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BFN 901 FS"
                        value={customPlate}
                        onChange={(e) => setCustomPlate(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg uppercase font-mono-plate font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Make, Model & Color *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Toyota Yaris (White)"
                        value={customMakeModel}
                        onChange={(e) => setCustomMakeModel(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setFormError(''); setStep(1); }}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFormError(''); setStep(3); }}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-950 text-white font-bold hover:bg-blue-900 shadow-sm"
                >
                  <span>Next: Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Documentation & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Documentation
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="font-bold text-slate-800">Proof of UFS Student / Staff Registration</p>
                  {uploadedDocName ? (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Attached: <span className="font-mono text-blue-950 font-bold">{uploadedDocName}</span>{' '}
                      <button type="button" onClick={() => setUploadedDocName('')} className="text-rose-600 font-bold hover:underline">Remove</button>
                    </p>
                  ) : (
                    <button type="button" onClick={() => { setUploadedDocName('UFS_Proof_Of_Registration.pdf'); setFormError(''); }} className="mt-2 py-1.5 px-3 rounded-lg bg-blue-950 text-white font-bold text-[11px]">Attach file</button>
                  )}
                </div>
                {permitType === 'disability' && (
                  <div className="mt-2">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="font-bold text-slate-800">Medical Certificate (Disability / Accessible)</p>
                  {medicalDocName ? (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Attached: <span className="font-mono text-blue-950 font-bold">{medicalDocName}</span>{' '}
                      <button type="button" onClick={() => setMedicalDocName('')} className="text-rose-600 font-bold hover:underline">Remove</button>
                    </p>
                  ) : (
                    <button type="button" onClick={() => { setMedicalDocName('Medical_Certificate.pdf'); setFormError(''); }} className="mt-2 py-1.5 px-3 rounded-lg bg-blue-950 text-white font-bold text-[11px]">Attach file</button>
                  )}
                </div>
                  </div>
                )}
              </div>

              {/* Summary Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1.5 text-xs text-blue-950">
                <div className="flex justify-between">
                  <span className="text-slate-600">Applicant:</span>
                  <span className="font-bold">{currentUser?.name} ({currentUser?.identifierNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Permit Type:</span>
                  <span className="font-bold uppercase">{permitType} Permit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Target Vehicle:</span>
                  <span className="font-bold font-mono">
                    {selectedVehicleReg === 'NEW' ? customPlate : selectedVehicleReg}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Campus:</span>
                  <span className="font-bold">{campus}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="h-4 w-4 mt-0.5 text-blue-950 focus:ring-blue-900 border-slate-300 rounded"
                  />
                  <span className="text-[11px] text-slate-700 leading-relaxed">
                    I declare that all submitted information is accurate and agree to adhere strictly to the 
                    <strong> UFS Parking Procedure</strong>. I acknowledge that strict action will be taken against persons who do not meet procedure stipulations, and fines will be imposed for violations. Fine proceeds are reinvested into maintaining an orderly campus parking environment.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white font-bold shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Permit Application</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

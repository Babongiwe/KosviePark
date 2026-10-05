import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SouthAfricanPlate } from '../common/SouthAfricanPlate';
import { Car, Plus, Trash2, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export const VehicleManager: React.FC = () => {
  const { currentUser, vehicles, addVehicle, removeVehicle } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [plate, setPlate] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState(2022);
  const [vehError, setVehError] = useState('');
  const closeForm = () => { setIsAdding(false); setPlate(''); setMake(''); setModel(''); setColor(''); setVehError(''); };

  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser?.id);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!make.trim()) return setVehError('Make is required.');
    if (!model.trim()) return setVehError('Model is required.');
    const cleanPlate = plate.trim().toUpperCase().replace(/\s+/g, ' ');
    if (!/^[A-Z0-9]{1,4}( ?[A-Z0-9]{1,4}){1,2}$/.test(cleanPlate) || !/\d/.test(cleanPlate)) {
      return setVehError('Licence plate format not recognised. Example: FSK 123 GP.');
    }
    if (vehicles.some((v) => v.registrationNumber.replace(/\s+/g, '') === cleanPlate.replace(/\s+/g, ''))) {
      return setVehError('This licence plate is already registered. Please check the plate and try again.');
    }
    setVehError('');

    addVehicle({
      registrationNumber: cleanPlate,
      make,
      model,
      color: color || 'Silver',
      year: Number(year) || 2022,
      ownerId: currentUser.id,
      isPrimary: userVehicles.length === 0,
    });

    setIsAdding(false);
    setPlate('');
    setMake('');
    setModel('');
    setColor('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Registered Vehicles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vehicles linked to {currentUser?.name} ({currentUser?.identifierNumber}) for ALPR recognition and permit assignment
          </p>
        </div>
        <button
          onClick={() => (isAdding ? closeForm() : setIsAdding(true))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Register New Vehicle'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          noValidate
          onSubmit={handleAddSubmit}
          className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4 animate-in fade-in duration-150"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Add Vehicle to Your Profile
            </h3>
            <p className="text-xs text-slate-500">
              Ensure the license plate matches your vehicle registration documents exactly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                License Plate (Registration #) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BFN 123 FS"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl uppercase font-mono-plate font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Make *</label>
              <input
                type="text"
                required
                placeholder="e.g. Volkswagen"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. Polo Vivo"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Color & Year</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. White"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-2/3 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="2022"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {vehError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold">{vehError}</div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="py-2 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-blue-950 text-white text-xs font-bold hover:bg-blue-900 shadow-sm"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      )}

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {vehicle.isPrimary ? 'Primary Vehicle' : 'Secondary Vehicle'}
                </span>
                {userVehicles.length > 1 && (
                  <button
                    onClick={() => removeVehicle(vehicle.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove Vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="my-4">
                <SouthAfricanPlate plateNumber={vehicle.registrationNumber} size="md" />
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900 text-sm">
                  {vehicle.make} {vehicle.model}
                </p>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Color:</span>
                  <span className="font-medium text-slate-800">{vehicle.color}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Year:</span>
                  <span className="font-medium text-slate-800">{vehicle.year}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready for Permit Assignment</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-950">
        <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Note on Campus Security Scanners:</strong> Only vehicles registered to your profile and covered by an active permit will be marked <strong>"Vehicle Authorized"</strong> at campus boom gates. Any vehicle changes must be updated before driving onto campus.
        </p>
      </div>
    </div>
  );
};

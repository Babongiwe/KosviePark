import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  CreditCard,
  Car,
  Pencil,
  MapPin,
  Wallet,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    permits,
    vehicles,
    applications,
    notifications,
    setCurrentScreen,
    addToast,
    updateCurrentUser,
  } = useApp();

  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [editForm, setEditForm] = useState({
    phoneNumber: '',
    email: '',
    departmentOrFaculty: '',
    studyProgramme: '',
    yearOfStudy: '',
  });

  const openDetailsEditor = () => {
    setEditForm({
      phoneNumber: currentUser?.phoneNumber || '',
      email: currentUser?.email || '',
      departmentOrFaculty: currentUser?.departmentOrFaculty || '',
      studyProgramme: currentUser?.studyProgramme || '',
      yearOfStudy: currentUser?.yearOfStudy || '',
    });
    setShowUserDetailsModal(true);
  };

  const handleSaveDetails = () => {
    updateCurrentUser(editForm);
    setShowUserDetailsModal(false);
    addToast('Details Updated', 'Your KovsiePark profile details were saved.', 'success');
  };

  const userPermit = permits.find((p) => p.userId === currentUser?.id);
  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser?.id);
  const userApplications = applications.filter((a) => a.applicantId === currentUser?.id);
  const pendingApplications = userApplications.filter((a) => a.status === 'pending').length;
  const unreadNotifications = (notifications || []).filter(
    (n) => !n.isRead && (n.targetUserId === 'all' || n.targetUserId === currentUser?.id || n.targetUserId === currentUser?.role)
  ).length;

  const tiles = [
    {
      id: 'my_permits',
      label: 'My Permits & Applications',
      description: 'Apply, renew and track your permits and applications',
      icon: CreditCard,
      badge: userPermit ? userPermit.status.toUpperCase() : pendingApplications > 0 ? `${pendingApplications} PENDING` : 'NONE',
    },
    {
      id: 'vehicles',
      label: 'Registered Vehicles',
      description: 'Manage the license plates linked to your profile',
      icon: Car,
      badge: `${userVehicles.length} VEHICLE${userVehicles.length === 1 ? '' : 'S'}`,
    },
    {
      id: 'bay_availability',
      label: 'Parking Zones',
      description: 'Live bay availability across campus parking zones',
      icon: MapPin,
    },
    {
      id: 'my_fines',
      label: 'My Fines',
      description: 'Fines issued to your vehicles',
      icon: Wallet,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Permit decisions, expiry reminders and alerts',
      icon: Bell,
      badge: unreadNotifications > 0 ? `${unreadNotifications} NEW` : undefined,
    },
    {
      id: 'profile',
      label: 'Account Profile',
      description: 'Your personal and contact information',
      icon: User,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Identity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#002B49] text-white flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                {currentUser?.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                <span className="font-mono font-bold text-slate-800">{currentUser?.identifierNumber}</span>
                <span className="text-slate-300">•</span>
                <span>{currentUser?.departmentOrFaculty}</span>
                {currentUser?.studyProgramme && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{currentUser.studyProgramme}</span>
                  </>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {currentUser?.role === 'staff' ? 'Staff' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openDetailsEditor}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              <Pencil className="w-4 h-4 text-slate-500" />
              <span>Edit My Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tiles — mirrors the sidebar navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => setCurrentScreen(tile.id)}
              className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-[#002B49]/40 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B49] flex items-center justify-center group-hover:bg-[#002B49] group-hover:text-amber-300 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#002B49] transition-colors" />
              </div>
              <h3 className="mt-3 font-bold text-sm text-slate-900">{tile.label}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tile.description}</p>
              {tile.badge && (
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {tile.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Edit Details Modal */}
      {showUserDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Edit My Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                <input
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                <input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Faculty / Department</label>
                <input
                  value={editForm.departmentOrFaculty}
                  onChange={(e) => setEditForm({ ...editForm, departmentOrFaculty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Study Programme</label>
                <input
                  value={editForm.studyProgramme}
                  onChange={(e) => setEditForm({ ...editForm, studyProgramme: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Year of Study</label>
                <input
                  value={editForm.yearOfStudy}
                  onChange={(e) => setEditForm({ ...editForm, yearOfStudy: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUserDetailsModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDetails}
                className="px-4 py-2 rounded-lg bg-[#002B49] hover:bg-[#08355a] text-white font-bold text-xs cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

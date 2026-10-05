import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';

import { AuthScreens } from './components/auth/AuthScreens';
import { StudentDashboard } from './components/student/StudentDashboard';
import { MyPermitsView } from './components/student/MyPermitsView';
import { VehicleManager } from './components/student/VehicleManager';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PermitApplicationsManager } from './components/admin/PermitApplicationsManager';
import { PermitsManager } from './components/admin/PermitsManager';
import { ZoneManager } from './components/admin/ZoneManager';
import { VisitorReservationsManager } from './components/admin/VisitorReservationsManager';
import { SecurityDashboard } from './components/security/SecurityDashboard';
import { ALPRSimulator } from './components/security/ALPRSimulator';
import { VehicleLookup } from './components/security/VehicleLookup';
import { GracePeriodManager } from './components/security/GracePeriodManager';
import { ViolationsManager } from './components/security/ViolationsManager';
import { VisitorPortal } from './components/visitor/VisitorPortal';
import { VisitorLookup } from './components/visitor/VisitorLookup';
import { VisitorDashboard } from './components/visitor/VisitorDashboard';
import { BayAvailabilityView } from './components/student/BayAvailabilityView';
import { AccountProfile } from './components/profile/AccountProfile';
import { NotificationsView } from './components/notifications/NotificationsView';
import { MyFinesView } from './components/student/MyFinesView';
import { ToastContainer } from './components/common/Toast';
import { QRCodeModal } from './components/common/QRCodeModal';
import { ArrowLeft } from 'lucide-react';

export function AppContent() {
  const { currentScreen, setCurrentScreen, activeRole, currentUser } = useApp();


  // If user navigated to login/register/forgot
  if (currentScreen === 'login' || currentScreen === 'register' || currentScreen === 'forgot') {
    return (
      <>
        <AuthScreens />
        <ToastContainer />
      </>
    );
  }

  // Render main screen component based on currentScreen and activeRole
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        if (activeRole === 'admin') return <AdminDashboard />;
        if (activeRole === 'security') return <SecurityDashboard />;
        if (activeRole === 'visitor') return <VisitorDashboard />;
        return <StudentDashboard />;

      case 'my_permits':
      case 'apply_permit':
        return <MyPermitsView />;

      case 'vehicles':
        return <VehicleManager />;

      case 'permit_applications':
        return <PermitApplicationsManager />;

      case 'permits':
        return <PermitsManager />;

      case 'zones':
        return <ZoneManager />;

      case 'visitor_admin':
        return <VisitorReservationsManager />;

      case 'alpr_simulator':
        return <ALPRSimulator />;

      case 'vehicle_lookup':
        return <VehicleLookup />;

      case 'grace_periods':
        return <GracePeriodManager />;

      case 'violations':
        return <ViolationsManager />;

      case 'visitor_portal':
        return <VisitorPortal />;

      case 'register_visitor':
        return <VisitorPortal staffMode />;

      case 'bay_availability':
        return <BayAvailabilityView />;

      case 'visitor_lookup':
        return <VisitorLookup />;

      case 'profile':
        return <AccountProfile />;

      case 'notifications':
        return <NotificationsView />;

      case 'my_fines':
        return <MyFinesView />;



      default:
        if (activeRole === 'admin') return <AdminDashboard />;
        if (activeRole === 'security') return <SecurityDashboard />;
        if (activeRole === 'visitor') return <VisitorDashboard />;
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 transition-all duration-200">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
            {/* Global Back Navigation Bar when viewing any sub-screen/tab */}
            {currentScreen !== 'dashboard' && (
              <div className="mb-5">
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  aria-label="Back to dashboard"
                  title="Back to dashboard"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#002B49] hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {renderScreen()}
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">
              KovsiePark — University Smart Parking & Permit Management System
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              University of the Free State (UFS) • Department of Computer Science & Informatics
            </p>
          </footer>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <QRCodeModal />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

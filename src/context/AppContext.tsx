import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Vehicle,
  PermitApplication,
  Permit,
  ParkingZone,
  VisitorReservation,
  NotificationItem,
  ALPRScanResult,
  ParkingViolation,
  Fine,
  ZoneCategory,
  PermitType,
  PermitStatus,
} from '../types';
import {
  mockUsers,
  mockVehicles,
  mockPermits,
  mockApplications,
  mockZones,
  mockVisitorReservations,
  mockALPRScans,
  mockViolations,
  mockFines,
  mockNotifications,
} from '../data/mockData';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  login: (identifier: string, password: string, role: UserRole) => 'ok' | 'not_found' | 'wrong_password';
  resetPassword: (identifier: string, email: string, newPassword: string) => boolean;
  findUserForReset: (identifier: string, email: string) => boolean;
  sessionMessage: string;
  clearSessionMessage: () => void;
  lastLoginRole: UserRole;
  myNotifications: NotificationItem[];
  getApplicationType: (app: PermitApplication) => 'new' | 'renewal';
  sendNotification: (audience: 'all' | 'student' | 'staff' | 'security', title: string, message: string) => void;
  settleViolation: (violationId: string) => void;
  addBay: (zoneId: string) => void;
  removeBay: (zoneId: string) => void;
  registerUser: (user: User) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  updateCurrentUser: (patch: Partial<User>) => void;

  // Data
  users: User[];
  vehicles: Vehicle[];
  permits: Permit[];
  applications: PermitApplication[];
  zones: ParkingZone[];
  visitorReservations: VisitorReservation[];
  alprScans: ALPRScanResult[];
  recentScans: ALPRScanResult[];
  violations: ParkingViolation[];
  fines: Fine[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Actions
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Permit Actions
  submitPermitApplication: (data: Omit<PermitApplication, 'id' | 'applicationNumber' | 'submittedDate' | 'status'>) => void;
  reviewPermitApplication: (applicationId: string, decision: 'approved' | 'rejected', notes?: string) => void;
  renewPermit: (permitId: string) => void;
  revokePermit: (permitId: string, reason?: string) => void;
  
  // Vehicle Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  removeVehicle: (vehicleId: string) => void;

  // Zone Actions
  addZone: (zone: Omit<ParkingZone, 'id'>) => void;
  updateZone: (zone: ParkingZone) => void;
  updateZoneBays: (zoneId: string, occupiedBays: number) => void;
  toggleZoneStatus: (zoneId: string, status: 'active' | 'maintenance' | 'closed') => void;

  // Visitor Actions
  createVisitorReservation: (data: Omit<VisitorReservation, 'id' | 'reservationCode' | 'temporaryPermitCode' | 'qrCodeData' | 'status' | 'createdAt'>) => VisitorReservation;
  cancelVisitorReservation: (reservationCode: string) => boolean;
  approveVisitorRequest: (id: string, zoneId: string, bayNumber: string) => void;
  rejectVisitorRequest: (id: string, reason: string) => void;

  // ALPR / Security Actions
  simulateALPRScan: (licensePlate: string, zoneId: string) => ALPRScanResult;
  escalateGracePeriodToFine: (violationId: string, fineAmount?: number, notes?: string) => void;
  resolveViolation: (violationId: string, notes?: string) => void;
  resolveGracePeriod: (violationId: string, notes?: string) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationCount: number;

  // Modal helper state
  selectedQRModalData: { title: string; subtitle: string; code: string; details: Record<string, string> } | null;
  openQRModal: (data: { title: string; subtitle: string; code: string; details: Record<string, string> }) => void;
  closeQRModal: () => void;
}

// Keep a single context instance across hot reloads so the provider and consumers always match.
const globalCtx = globalThis as unknown as { __kovsieAppContext?: React.Context<AppContextType | undefined> };
const AppContext =
  globalCtx.__kovsieAppContext ?? (globalCtx.__kovsieAppContext = createContext<AppContextType | undefined>(undefined));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default logged in user: Student (Thabo Mokoena)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [sessionMessage, setSessionMessage] = useState('');
  const [lastLoginRole, setLastLoginRole] = useState<UserRole>('student');

  const [users, setUsers] = useState<User[]>(mockUsers);

  const registerUser = (user: User) => {
    setUsers((prev) => [...prev.filter((u) => u.identifierNumber !== user.identifierNumber), user]);
  };
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [permits, setPermits] = useState<Permit[]>(mockPermits);
  const [applications, setApplications] = useState<PermitApplication[]>(mockApplications);
  const [zones, setZones] = useState<ParkingZone[]>(mockZones);
  const [visitorReservations, setVisitorReservations] = useState<VisitorReservation[]>(mockVisitorReservations);
  const [alprScans, setAlprScans] = useState<ALPRScanResult[]>(mockALPRScans);
  const [violations, setViolations] = useState<ParkingViolation[]>(mockViolations);
  const [fines, setFines] = useState<Fine[]>(mockFines);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedQRModalData, setSelectedQRModalData] = useState<{
    title: string;
    subtitle: string;
    code: string;
    details: Record<string, string>;
  } | null>(null);

  // Live 15:00 grace period countdown
  useEffect(() => {
    const t = setInterval(() => {
      setViolations((prev) =>
        prev.some((v) => v.status === 'grace_period_active' && (v.gracePeriodRemainingSeconds ?? 900) > 0)
          ? prev.map((v) =>
              v.status === 'grace_period_active'
                ? { ...v, gracePeriodRemainingSeconds: Math.max(0, (v.gracePeriodRemainingSeconds ?? 900) - 1) }
                : v
            )
          : prev
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Sync role when user changes
  useEffect(() => {
    if (currentUser) {
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  // Automatic permit expiry reminders on sign-in (student / staff)
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'student' && currentUser.role !== 'staff')) return;
    const today = new Date().toISOString().slice(0, 10);
    const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    const mine = permits.filter((p) => p.userId === currentUser.id);
    const expiredIds = mine.filter((p) => p.status === 'active' && p.expiryDate < today).map((p) => p.id);
    const soon = mine.filter((p) => p.status === 'active' && p.expiryDate >= today && p.expiryDate <= in30);
    if (expiredIds.length) {
      setPermits((prev) => prev.map((p) => (expiredIds.includes(p.id) ? { ...p, status: 'expired' } : p)));
    }
    const stamp = new Date().toLocaleString();
    setNotifications((prev) => {
      const ids = new Set(prev.map((n) => n.id));
      const add: NotificationItem[] = [];
      mine.filter((p) => expiredIds.includes(p.id)).forEach((p) => {
        const id = `notif-expired-${p.id}`;
        if (!ids.has(id)) add.push({ id, targetUserId: currentUser.id, title: 'Permit Expired', message: `Your permit ${p.permitNumber} expired on ${p.expiryDate}. Please apply for a renewal.`, type: 'alert', isRead: false, timestamp: stamp });
      });
      soon.forEach((p) => {
        const id = `notif-expiring-${p.id}-${p.expiryDate}`;
        if (!ids.has(id)) add.push({ id, targetUserId: currentUser.id, title: 'Permit Expiring Soon', message: `Your permit ${p.permitNumber} expires on ${p.expiryDate}. Please renew it before then.`, type: 'alert', isRead: false, timestamp: stamp });
      });
      return add.length ? [...add, ...prev] : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const DEFAULT_PASSWORD = 'Kovsie2026!';

  const login = (identifier: string, password: string, role: UserRole): 'ok' | 'not_found' | 'wrong_password' => {
    const id = (identifier || '').trim().toLowerCase();
    const user = users.find(
      (u) => u.role === role && (u.identifierNumber.toLowerCase() === id || u.email.toLowerCase() === id)
    );
    if (!user) return 'not_found';
    if ((user.password ?? DEFAULT_PASSWORD) !== password) return 'wrong_password';
    setCurrentUser(user);
    setActiveRole(user.role);
    setLastLoginRole(user.role);
    setSessionMessage('');
    setCurrentScreen('dashboard');
    addToast('Welcome Back', `Signed in as ${user.name}`, 'success');
    return 'ok';
  };

  const findUserForReset = (identifier: string, email: string) =>
    users.some(
      (u) =>
        u.identifierNumber.toLowerCase() === identifier.trim().toLowerCase() &&
        u.email.toLowerCase() === email.trim().toLowerCase()
    );

  const resetPassword = (identifier: string, email: string, newPassword: string) => {
    if (!findUserForReset(identifier, email)) return false;
    setUsers((prev) =>
      prev.map((u) =>
        u.identifierNumber.toLowerCase() === identifier.trim().toLowerCase() ? { ...u, password: newPassword } : u
      )
    );
    return true;
  };

  // 20-minute inactivity timeout
  useEffect(() => {
    if (!currentUser) return;
    const TIMEOUT = 20 * 60 * 1000;
    let timer = setTimeout(expire, TIMEOUT);
    function expire() {
      setLastLoginRole(currentUser!.role);
      setCurrentUser(null);
      setCurrentScreen('login');
      setSessionMessage('Your session has expired. Please sign in again.');
    }
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(expire, TIMEOUT);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, reset));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [currentUser]);

  const updateCurrentUser = (patch: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const logout = () => {
    if (currentUser) setLastLoginRole(currentUser.role);
    setSessionMessage('');
    setCurrentUser(null);
    setCurrentScreen('login');
    addToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'visitor') {
      setCurrentUser({
        id: 'usr-visitor-temp',
        name: 'Campus Visitor',
        email: 'visitor@guest.ufs.ac.za',
        role: 'visitor',
        identifierNumber: 'VIS-TEMP',
        departmentOrFaculty: 'Visitor Services',
        phoneNumber: '+27 72 000 1234',
      });
      setActiveRole('visitor');
      setCurrentScreen('dashboard');
      addToast('Role Switched', 'Switched view to Campus Visitor', 'info');
      return;
    }

    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(targetUser);
    setActiveRole(targetUser.role);
    setCurrentScreen('dashboard');
    addToast('Role Switched', `Switched view to ${(targetUser?.role || role).toUpperCase()}: ${targetUser?.name || 'User'}`, 'info');
  };

  const normPlate = (p?: string) => (p || '').replace(/\s+/g, '').toUpperCase();
  const plateHasPermit = (plate: string, excludeId?: string) =>
    permits.some(
      (p) => normPlate(p.vehicleRegistration) === normPlate(plate) && (p.status === 'active' || p.status === 'expired') && p.id !== excludeId
    );
  const getApplicationType = (app: PermitApplication): 'new' | 'renewal' =>
    app.applicationType ?? (plateHasPermit(app.vehicleRegistration, app.allocatedPermitId) ? 'renewal' : 'new');

  const submitPermitApplication = (data: Omit<PermitApplication, 'id' | 'applicationNumber' | 'submittedDate' | 'status'>) => {
    const newId = `app-${Date.now()}`;
    const newAppNumber = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApplication: PermitApplication = {
      applicationType: plateHasPermit(data.vehicleRegistration) ? 'renewal' : 'new',
      ...data,
      id: newId,
      applicationNumber: newAppNumber,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setApplications((prev) => [newApplication, ...prev]);

    // Add notification for admin
    const adminNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetUserId: 'admin',
      title: 'New Permit Application Submitted',
      message: `${data.applicantName} (${data.applicantNumber}) submitted a ${(data.permitType || 'Standard').toUpperCase()} permit application for vehicle ${data.vehicleRegistration}.`,
      type: 'system',
      isRead: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [adminNotification, ...prev]);

    addToast('Application Submitted', `Your application ${newAppNumber} has been received for administrative review.`, 'success');
  };

  const reviewPermitApplication = (applicationId: string, decision: 'approved' | 'rejected', notes?: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    let createdPermitId: string | undefined = undefined;

    const existingPermit = permits.find(
      (p) => normPlate(p.vehicleRegistration) === normPlate(app.vehicleRegistration) && (p.status === 'active' || p.status === 'expired')
    );
    const appType = getApplicationType(app);

    if (decision === 'approved' && appType === 'renewal' && existingPermit) {
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
      const today = new Date().toISOString().split('T')[0];
      setPermits((prev) =>
        prev.map((p) =>
          p.id === existingPermit.id
            ? {
                ...p,
                status: 'active' as PermitStatus,
                issueDate: today,
                expiryDate: exp.toISOString().split('T')[0],
                renewalStatus: 'renewed' as const,
                renewalCount: (p.renewalCount || 0) + 1,
                lastRenewedDate: today,
              }
            : p
        )
      );
      createdPermitId = existingPermit.id;
    } else if (decision === 'approved') {
      const pmtId = `pmt-${Date.now()}`;
      const prefix = app.permitType === 'student' ? 'STU' : app.permitType === 'staff' ? 'STF' : app.permitType === 'disability' ? 'DIS' : 'RSV';
      const permitNum = `KP-2026-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      const allowedZones: ZoneCategory[] = 
        app.permitType === 'staff' 
          ? ['Staff Parking', 'Student Parking']
          : app.permitType === 'disability'
          ? ['Disability Parking', 'Student Parking', 'Staff Parking']
          : app.permitType === 'reserved'
          ? ['Reserved Parking', 'Staff Parking', 'Student Parking']
          : ['Student Parking'];

      const newPermit: Permit = {
        id: pmtId,
        permitNumber: permitNum,
        userId: app.applicantId,
        userName: app.applicantName,
        userRole: app.applicantRole,
        userIdentifier: app.applicantNumber,
        vehicleRegistration: app.vehicleRegistration,
        vehicleMakeModel: app.vehicleMakeModel,
        permitType: app.permitType,
        allowedZoneCategories: allowedZones,
        campus: app.campus,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '2026-12-31',
        status: 'active',
        qrCodeData: `KOVSIEPARK:${permitNum}:${(app.vehicleRegistration || '').replace(/\s+/g, '')}:${(app.permitType || 'Standard').toUpperCase()}:ACTIVE`,
        renewalStatus: 'eligible',
      };

      createdPermitId = pmtId;
      setPermits((prev) => [newPermit, ...prev]);
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: decision,
              applicationType: appType,
              reviewedBy: currentUser?.name || 'Administrator',
              reviewedDate: new Date().toISOString().split('T')[0],
              reviewerNotes: notes || (decision === 'approved' ? 'Application meets all university criteria.' : 'Application declined based on zone availability or policy.'),
              allocatedPermitId: createdPermitId,
            }
          : a
      )
    );

    // Notify the applicant
    const studentNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetUserId: app.applicantId,
      targetRole: app.applicantRole,
      title: decision === 'approved' ? 'Parking Permit Approved!' : 'Permit Application Rejected',
      message:
        decision === 'approved'
          ? appType === 'renewal'
            ? `Your renewal application (${app.applicationNumber}) for ${app.vehicleRegistration} has been approved. Your permit is valid for another 12 months.`
            : `Your parking permit application (${app.applicationNumber}) for ${app.vehicleRegistration} has been approved. Your digital permit is now active.`
          : `Your application (${app.applicationNumber}) was not approved. Note: ${notes || 'Criteria not met.'}`,
      type: decision === 'approved' ? 'permit_approval' : 'permit_rejection',
      isRead: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [studentNotification, ...prev]);

    addToast(
      decision === 'approved' ? 'Permit Approved' : 'Permit Rejected',
      `Application ${app.applicationNumber} has been ${decision}.`,
      decision === 'approved' ? 'success' : 'warning'
    );
  };

  const renewPermit = (permitId: string) => {
    const existing = permits.find((p) => p.id === permitId);
    const currentExpiry = existing?.expiryDate ? new Date(existing.expiryDate) : new Date();
    const newExpiryDate = new Date(currentExpiry);
    newExpiryDate.setFullYear(currentExpiry.getFullYear() + 1);
    const newExpiry = Number.isNaN(newExpiryDate.getTime())
      ? '2027-11-30'
      : newExpiryDate.toISOString().substring(0, 10);
    const today = new Date().toISOString().substring(0, 10);

    setPermits((prev) =>
      prev.map((p) => {
        if (p.id === permitId) {
          return {
            ...p,
            status: 'active' as PermitStatus,
            expiryDate: newExpiry,
            renewalStatus: 'renewed' as const,
            renewalCount: (p.renewalCount || 0) + 1,
            lastRenewedDate: today,
          };
        }
        return p;
      })
    );

    addToast('Permit Renewed', `Permit extended to ${newExpiry}. No administrative review required.`, 'success');
  };

  const revokePermit = (permitId: string, reason?: string) => {
    setPermits((prev) =>
      prev.map((p) => (p.id === permitId ? { ...p, status: 'revoked' } : p))
    );
    addToast('Permit Revoked', `Permit has been revoked. Reason: ${reason || 'Administrative action'}`, 'warning');
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
    };
    setVehicles((prev) => [...prev, newVehicle]);
    addToast('Vehicle Added', `Vehicle ${vehicleData.registrationNumber} has been registered to your profile.`, 'success');
  };

  const removeVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    addToast('Vehicle Removed', 'The vehicle was removed from your profile.', 'info');
  };

  const addZone = (zoneData: Omit<ParkingZone, 'id'>) => {
    const newZone: ParkingZone = {
      ...zoneData,
      id: `zone-${Date.now()}`,
    };
    setZones((prev) => [...prev, newZone]);
    addToast('Zone Created', `Parking zone ${zoneData.name} (${zoneData.code}) added.`, 'success');
  };

  const updateZone = (updatedZone: ParkingZone) => {
    setZones((prev) => prev.map((z) => (z.id === updatedZone.id ? updatedZone : z)));
    addToast('Zone Updated', `Parking zone ${updatedZone.name} settings saved.`, 'success');
  };

  const updateZoneBays = (zoneId: string, occupiedBays: number) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, occupiedBays: Math.max(0, Math.min(z.totalBays, occupiedBays)) }
          : z
      )
    );
  };

  const toggleZoneStatus = (zoneId: string, status: 'active' | 'maintenance' | 'closed') => {
    setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, status } : z)));
    addToast('Zone Status Updated', `Zone status changed to ${status}.`, 'info');
  };

  const nowStamp = () => new Date().toISOString().replace('T', ' ').substring(0, 16);

  // Step 1: visitor submits a request (no bay, no permit yet)
  const createVisitorReservation = (
    data: Omit<VisitorReservation, 'id' | 'reservationCode' | 'temporaryPermitCode' | 'qrCodeData' | 'status' | 'createdAt'>
  ): VisitorReservation => {
    const resCode = `VIS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRes: VisitorReservation = {
      ...data,
      id: `vis-res-${Date.now()}`,
      reservationCode: resCode,
      requesterId: data.requesterId ?? currentUser?.id,
      assignedBayNumber: '',
      qrCodeData: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setVisitorReservations((prev) => [newRes, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetUserId: 'admin',
        title: 'New Visitor Permit Request',
        message: `${data.visitorName} (${data.visitorType}) requested a temporary permit for ${data.visitDate}. Ref ${resCode}.`,
        type: 'info',
        isRead: false,
        timestamp: nowStamp(),
      },
      ...prev,
    ]);
    addToast('Request Submitted', `Reference ${resCode}. An administrator will review your request.`, 'success');
    return newRes;
  };

  // Steps 2-6: admin approves, reserves a bay, system issues permit + pass and confirms
  const approveVisitorRequest = (id: string, zoneId: string, bayNumber: string) => {
    const res = visitorReservations.find((r) => r.id === id);
    const zone = zones.find((z) => z.id === zoneId);
    if (!res || !zone) return;
    const code = res.reservationCode ?? id;
    const tempCode = `TEMP-VIS-${code.slice(-4)}`;
    setVisitorReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'confirmed',
              zoneId,
              zoneName: zone.name,
              assignedBayNumber: bayNumber,
              temporaryPermitCode: tempCode,
              qrCodeData: `KOVSIEPARK:${code}:${r.vehicleRegistration.replace(/\s+/g, '')}:VISITOR:ACTIVE`,
              reviewedBy: currentUser?.name,
            }
          : r
      )
    );
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, occupiedBays: Math.min(z.totalBays, z.occupiedBays + 1) } : z))
    );
    if (res.requesterId) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetUserId: res.requesterId,
          title: 'Visitor Permit Approved',
          message: `Your request ${code} was approved. ${zone.name}, Bay ${bayNumber}. Temporary permit ${tempCode}.`,
          type: 'visitor_confirmed',
          isRead: false,
          timestamp: nowStamp(),
        },
        ...prev,
      ]);
    }
    addToast('Request Approved', `Bay ${bayNumber} reserved. Confirmation sent to ${res.visitorEmail}.`, 'success');
  };

  const rejectVisitorRequest = (id: string, reason: string) => {
    const res = visitorReservations.find((r) => r.id === id);
    if (!res) return;
    setVisitorReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected', rejectionReason: reason, reviewedBy: currentUser?.name } : r))
    );
    if (res.requesterId) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetUserId: res.requesterId,
          title: 'Visitor Permit Rejected',
          message: `Your request ${res.reservationCode} was rejected. Reason: ${reason}`,
          type: 'alert',
          isRead: false,
          timestamp: nowStamp(),
        },
        ...prev,
      ]);
    }
    addToast('Request Rejected', `Rejection sent to ${res.visitorEmail}.`, 'info');
  };

  const cancelVisitorReservation = (reservationCode: string): boolean => {
    const reservation = visitorReservations.find(
      (r) => ((r.reservationCode ?? "").toLowerCase() === reservationCode.toLowerCase() || r.id === reservationCode) && (r.status === 'confirmed' || r.status === 'pending')
    );
    if (!reservation) {
      addToast('Reservation Not Found', 'Could not locate an active reservation with that reference code.', 'error');
      return false;
    }

    setVisitorReservations((prev) =>
      prev.map((r) => (r.id === reservation.id ? { ...r, status: 'cancelled' } : r))
    );

    // Release bay in zone
    setZones((prev) =>
      prev.map((z) =>
        reservation.status === 'confirmed' && z.id === reservation.zoneId
          ? { ...z, occupiedBays: Math.max(0, z.occupiedBays - 1) }
          : z
      )
    );
    if (reservation.requesterId && reservation.requesterId !== currentUser?.id) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now() + 1}`,
          targetUserId: reservation.requesterId,
          title: 'Visitor Reservation Cancelled',
          message: `Your reservation ${reservation.reservationCode} was cancelled by an administrator.`,
          type: 'visitor_cancelled',
          isRead: false,
          timestamp: nowStamp(),
        },
        ...prev,
      ]);
    }

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetUserId: 'admin',
      title: 'Visitor Reservation Cancelled',
      message: `Reservation ${reservation.reservationCode} for ${reservation.visitorName} (${reservation.vehicleRegistration}) was cancelled. Bay ${reservation.assignedBayNumber} returned to availability.`,
      type: 'visitor_cancelled',
      isRead: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('Reservation Cancelled', 'Reservation cancelled. Bay released. Email sent to the visitor.', 'success');
    return true;
  };

  // ALPR Simulation Engine (Step-by-step business logic)
  const simulateALPRScan = (licensePlate: string, zoneId: string): ALPRScanResult => {
    const cleanPlate = (licensePlate || '').trim().toUpperCase();
    const targetZone = zones.find((z) => z.id === zoneId) || zones[0];

    // Check if plate matches any Permit
    const matchingPermit = permits.find(
      (p) => (p.vehicleRegistration || '').replace(/\s+/g, '').toUpperCase() === cleanPlate.replace(/\s+/g, '')
    );

    // Also check active visitor reservation
    const matchingVisitor = visitorReservations.find(
      (v) =>
        (v.vehicleRegistration || '').replace(/\s+/g, '').toUpperCase() === cleanPlate.replace(/\s+/g, '') &&
        v.status !== 'cancelled'
    );

    let permitFound = false;
    let permitNumber: string | undefined = undefined;
    let permitType: PermitType | undefined = undefined;
    let permitStatus: PermitStatus | undefined = undefined;
    let isZoneAllowed = false;
    let authorizationStatus: 'authorized' | 'unauthorized' = 'unauthorized';
    let violationReason: string | undefined = undefined;
    let matchedUserName: string | undefined = undefined;

    if (matchingPermit) {
      permitFound = true;
      permitNumber = matchingPermit.permitNumber;
      permitType = matchingPermit.permitType;
      permitStatus = matchingPermit.status;
      matchedUserName = matchingPermit.userName;

      if (matchingPermit.status === 'active') {
        // Check zone compatibility
        if (targetZone.status !== 'active') {
          isZoneAllowed = false;
          authorizationStatus = 'unauthorized';
          violationReason = `Zone ${targetZone.code} is currently inactive.`;
        } else if (targetZone.allowedPermitTypes.includes(matchingPermit.permitType)) {
          isZoneAllowed = true;
          authorizationStatus = 'authorized';
        } else {
          isZoneAllowed = false;
          authorizationStatus = 'unauthorized';
          violationReason = `Incompatible Zone: Permit (${(matchingPermit.permitType || 'Standard').toUpperCase()}) is not authorized for ${targetZone.category}. Allowed in: ${(matchingPermit.allowedZoneCategories || []).join(', ')}.`;
        }
      } else if (matchingPermit.status === 'expired') {
        authorizationStatus = 'unauthorized';
        violationReason = `Expired Permit: Permit ${matchingPermit.permitNumber} expired on ${matchingPermit.expiryDate}. Vehicle unauthorized.`;
      } else {
        authorizationStatus = 'unauthorized';
        violationReason = `Permit status is '${matchingPermit.status}'.`;
      }
    } else if (matchingVisitor) {
      permitFound = true;
      permitNumber = matchingVisitor.temporaryPermitCode;
      permitType = 'visitor';
      permitStatus = matchingVisitor.status === 'confirmed' || matchingVisitor.status === 'checked-in' ? 'active' : 'expired';
      matchedUserName = `${matchingVisitor.visitorName} (Visitor)`;

      const nowHM = new Date().toTimeString().slice(0, 5);
      const todayStr = new Date().toISOString().split('T')[0];
      const start = matchingVisitor.arrivalTime || matchingVisitor.startTime || '00:00';
      const end = matchingVisitor.departureTime || matchingVisitor.endTime || '23:59';
      const inSlot = matchingVisitor.visitDate === todayStr && nowHM >= start && nowHM <= end;
      const alreadyIn = matchingVisitor.status === 'checked-in' || matchingVisitor.status === 'checked_in';
      if (matchingVisitor.status !== 'confirmed' && !alreadyIn) {
        authorizationStatus = 'unauthorized';
        violationReason = `Visitor reservation ${matchingVisitor.reservationCode} is ${matchingVisitor.status}.`;
      } else if (!inSlot && !alreadyIn) {
        authorizationStatus = 'unauthorized';
        violationReason = `Visitor pass is only valid on ${matchingVisitor.visitDate} ${start}–${end}.`;
      } else if (matchingVisitor.zoneId === targetZone.id || targetZone.category === 'Visitor Parking') {
        isZoneAllowed = true;
        authorizationStatus = 'authorized';
        violationReason = 'Access granted (Visitor Pass)';
        if (matchingVisitor.status === 'confirmed') {
          setVisitorReservations((prev) =>
            prev.map((r) => (r.id === matchingVisitor.id ? { ...r, status: 'checked-in' } : r))
          );
        }
      } else {
        isZoneAllowed = false;
        authorizationStatus = 'unauthorized';
        violationReason = `Visitor reservation is for ${matchingVisitor.zoneName}, but vehicle was detected in ${targetZone.name}.`;
      }
    } else {
      permitFound = false;
      isZoneAllowed = false;
      authorizationStatus = 'unauthorized';
      violationReason = 'Access restricted – no permit or reservation found';
    }

    const scanResult: ALPRScanResult = {
      id: `scan-${Date.now()}`,
      scanTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      cameraLocation: `${targetZone.name} - Automated Boom Camera`,
      zoneId: targetZone.id,
      zoneName: targetZone.name,
      zoneCategory: targetZone.category,
      licensePlate: cleanPlate,
      confidenceScore: +(97 + Math.random() * 2.8).toFixed(1),
      permitFound,
      permitNumber,
      permitType,
      permitStatus,
      isZoneAllowed,
      authorizationStatus,
      violationReason,
      matchedUserName,
      gateAction: authorizationStatus === 'authorized' ? 'open' : 'closed',
      reason: authorizationStatus === 'authorized' ? (matchingVisitor && !matchingPermit ? 'Access granted (Visitor Pass)' : 'Access granted') : violationReason,
    };

    setAlprScans((prev) => [scanResult, ...prev]);

    // If unauthorized, create a 15-minute grace period violation event
    if (authorizationStatus === 'unauthorized') {
      const graceMinutes = 15;
      const now = new Date();
      const expiry = new Date(now.getTime() + graceMinutes * 60 * 1000);

      const newViolation: ParkingViolation = {
        id: `vio-${Date.now()}`,
        violationNumber: `VIO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        scanId: scanResult.id,
        vehicleRegistration: cleanPlate,
        vehicleOwnerName: matchedUserName,
        zoneId: targetZone.id,
        zoneName: `${targetZone.name} (${targetZone.category})`,
        detectionTimestamp: now.toISOString(),
        gracePeriodMinutes: graceMinutes,
        gracePeriodExpiryTimestamp: expiry.toISOString(),
        reason: violationReason || 'Unauthorized parking detected by ALPR.',
        violationType: violationReason || 'Unauthorized parking',
        timestamp: now.toISOString().replace('T', ' ').substring(0, 16),
        gracePeriodRemainingSeconds: graceMinutes * 60,
        status: 'grace_period_active',
        securityOfficerNotes: `Automated detection at ${targetZone.name}. 15-minute grace period initiated.`,
      };

      setViolations((prev) => [newViolation, ...prev]);

      // Security Notification
      const secNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        targetUserId: 'security',
        targetRole: 'security',
        title: 'ALPR Alert: Grace Period Active',
        message: `Vehicle ${cleanPlate} detected in ${targetZone.name}: ${violationReason}. 15-minute grace period started.`,
        type: 'security_alert',
        isRead: false,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setNotifications((prev) => [secNotif, ...prev]);

      addToast(
        'Unauthorized Vehicle Detected',
        `${cleanPlate} in ${targetZone.name}. 15-minute grace period logged.`,
        'warning'
      );
    } else {
      addToast(
        'Vehicle Authorized',
        `${cleanPlate} verified. Permit ${permitNumber} valid for ${targetZone.name}.`,
        'success'
      );
    }

    return scanResult;
  };

  const escalateGracePeriodToFine = (violationId: string, _fineAmount?: number, notes?: string) => {
    const violation = violations.find((v) => v.id === violationId);
    if (!violation || violation.status !== 'grace_period_active') {
      addToast('Already Resolved', 'This grace period has already been resolved. The list has been refreshed.', 'info');
      return;
    }
    const fineAmount = violation.zoneName.includes('Accessible / Disability Concourse') ? 500 : 350;

    const fineNum = `UFS-FINE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newFine: Fine = {
      id: `fine-${Date.now()}`,
      fineNumber: fineNum,
      violationId: violation.id,
      violationNumber: violation.violationNumber ?? "",
      vehicleRegistration: violation.vehicleRegistration,
      offenderName: violation.vehicleOwnerName ?? "Unknown",
      zoneName: violation.zoneName,
      issueDate,
      dueDate,
      amount: fineAmount,
      reason: violation.reason ?? violation.violationType ?? "",
      status: 'unpaid',
      issuedBy: `${currentUser?.name || 'Campus Protection Services'} (ALPR Escalation)`,
    };

    setFines((prev) => [newFine, ...prev]);

    setViolations((prev) =>
      prev.map((v) =>
        v.id === violationId
          ? {
              ...v,
              status: 'fine_issued',
              fineAmount,
              fineNumber: fineNum,
              securityOfficerNotes: notes || 'Grace period expired without resolution. Penalty fine generated.',
            }
          : v
      )
    );

    // Notify Security and Offender if known
    const secNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetUserId: 'security',
      targetRole: 'security',
      title: `Fine Issued at ${violation.zoneName}`,
      message: `Fine ${fineNum} (R${fineAmount}) issued to ${violation.vehicleRegistration} for violation in ${violation.zoneName}.`,
      type: 'fine_issued',
      isRead: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    const owner = vehicles.find((v) => normPlate(v.registrationNumber) === normPlate(violation.vehicleRegistration));
    const ownerUser = owner ? users.find((u) => u.id === owner.ownerId) : undefined;
    const ownerNotifs: NotificationItem[] = ownerUser
      ? [{
          id: `notif-${Date.now()}-o`,
          targetUserId: ownerUser.id,
          targetRole: ownerUser.role,
          title: `A parking fine has been issued for ${violation.vehicleRegistration}`,
          message: `Fine ${fineNum} of R${fineAmount} was issued at ${violation.zoneName}. Reason: ${violation.reason ?? violation.violationType ?? ''}. See My Fines.`,
          type: 'fine_issued',
          isRead: false,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        }]
      : [];
    setNotifications((prev) => [...ownerNotifs, secNotif, ...prev]);

    addToast('Fine Issued', `Fine ${fineNum} (R${fineAmount}) generated for ${violation.vehicleRegistration}.`, 'error');
  };

  const resolveViolation = (violationId: string, notes?: string) => {
    setViolations((prev) =>
      prev.map((v) =>
        v.id === violationId
          ? {
              ...v,
              status: 'resolved',
              resolvedTimestamp: new Date().toISOString(),
              securityOfficerNotes: notes || 'Driver relocated vehicle within grace period or valid authorization presented.',
            }
          : v
      )
    );
    addToast('Violation Resolved', 'The violation has been closed without penalty.', 'success');
  };

  const settleViolation = (violationId: string) => {
    const v = violations.find((x) => x.id === violationId);
    if (!v) return;
    setViolations((prev) => prev.map((x) => (x.id === violationId ? { ...x, status: 'paid' } : x)));
    const ref = v.fineNumber || v.fineReferenceNumber;
    setFines((prev) =>
      prev.map((f) =>
        f.violationId === violationId || (ref && f.fineNumber === ref) ? { ...f, status: 'paid' } : f
      )
    );
    addToast('Fine Settled', `Fine ${ref ?? ''} marked as settled.`, 'success');
  };

  const addBay = (zoneId: string) => {
    setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, totalBays: z.totalBays + 1 } : z)));
    addToast('Bay Added', 'One bay was added to the zone.', 'success');
  };

  const removeBay = (zoneId: string) => {
    const z = zones.find((x) => x.id === zoneId);
    if (!z || z.totalBays <= 1) {
      addToast('Cannot Remove Bay', 'A zone must keep at least one bay.', 'error');
      return;
    }
    if (z.occupiedBays >= z.totalBays) {
      addToast('Cannot Remove Bay', 'All bays are occupied. Wait for a bay to become free.', 'error');
      return;
    }
    setZones((prev) => prev.map((x) => (x.id === zoneId ? { ...x, totalBays: x.totalBays - 1 } : x)));
    addToast('Bay Removed', 'One free bay was removed from the zone.', 'info');
  };

  const sendNotification = (audience: 'all' | 'student' | 'staff' | 'security', title: string, message: string) => {
    const roles: UserRole[] = audience === 'all' ? ['student', 'staff'] : [audience];
    const ts = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const items: NotificationItem[] = roles.map((r, i) => ({
      id: `notif-${Date.now()}-${i}`,
      targetRole: r,
      targetUserId: 'all',
      title,
      message,
      type: 'info',
      isRead: false,
      timestamp: ts,
    }));
    setNotifications((prev) => [...items, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const isForCurrentUser = (n: NotificationItem) => {
    if (!currentUser) return false;
    const t = n.targetUserId;
    if (t && t.startsWith('usr-')) return t === currentUser.id;
    if (n.targetRole) return n.targetRole === 'all' || n.targetRole === currentUser.role;
    if (t === 'admin' || t === 'security') return t === currentUser.role;
    return t === 'all';
  };
  const myNotifications = notifications.filter(isForCurrentUser);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => (isForCurrentUser(n) ? { ...n, isRead: true } : n)));
    addToast('Notifications', 'All notifications marked as read.', 'info');
  };

  const openQRModal = (data: { title: string; subtitle: string; code: string; details: Record<string, string> }) => {
    setSelectedQRModalData(data);
  };

  const closeQRModal = () => {
    setSelectedQRModalData(null);
  };

  const unreadNotificationCount = myNotifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        currentScreen,
        setCurrentScreen,
        login,
        registerUser,
        logout,
        switchUserRole,
        updateCurrentUser,
        users,
        vehicles,
        permits,
        applications,
        zones,
        visitorReservations,
        alprScans,
        recentScans: alprScans,
        violations,
        fines,
        notifications,
        toasts,
        addToast,
        removeToast,
        submitPermitApplication,
        reviewPermitApplication,
        renewPermit,
        revokePermit,
        addVehicle,
        removeVehicle,
        addZone,
        updateZone,
        updateZoneBays,
        toggleZoneStatus,
        createVisitorReservation,
        cancelVisitorReservation,
        approveVisitorRequest,
        rejectVisitorRequest,
        simulateALPRScan,
        escalateGracePeriodToFine,
        resolveViolation,
        resolveGracePeriod: resolveViolation,
        resetPassword,
        findUserForReset,
        sessionMessage,
        clearSessionMessage: () => setSessionMessage(''),
        lastLoginRole,
        myNotifications,
        getApplicationType,
        sendNotification,
        settleViolation,
        addBay,
        removeBay,
        markNotificationAsRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead: markAllNotificationsRead,
        unreadNotificationCount,
        selectedQRModalData,
        openQRModal,
        closeQRModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type UserRole = 'student' | 'staff' | 'admin' | 'security' | 'visitor';

export type PermitType = 'student' | 'staff' | 'visitor' | 'disability' | 'reserved';

export type PermitStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'expired' | 'revoked' | 'cancelled';

export type ZoneCategory = 
  | 'Student Parking' 
  | 'Staff Parking' 
  | 'Visitor Parking' 
  | 'Disability Parking' 
  | 'Reserved Parking' 
  | 'Restricted Parking';

export type ZoneStatus = 'active' | 'maintenance' | 'closed';

export type VisitorType = 
  | 'Guest Lecturer' 
  | 'Conference Attendee' 
  | 'Official Contractor' 
  | 'Parent / Guardian' 
  | 'General Campus Visitor'
  | string;

export type ViolationStatus = 
  | 'detected' 
  | 'grace_period_active' 
  | 'resolved' 
  | 'fine_issued' 
  | 'cleared'
  | 'paid'
  | 'closed';

export type FineStatus = 'unpaid' | 'paid' | 'appealed' | 'waived';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identifierNumber: string; // e.g. Student Number (2021089241) or Staff Number (UFS-ST-4092)
  departmentOrFaculty: string;
  phoneNumber: string;
  avatarUrl?: string;
  password?: string;
  studyProgramme?: string;
  yearOfStudy?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. 'FSK 123 GP', 'BFN 456 FS'
  make: string;
  model: string;
  color: string;
  year: number;
  ownerId: string;
  isPrimary?: boolean;
}

export interface PermitApplication {
  id: string;
  applicationNumber: string; // e.g. 'APP-2026-0041'
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantRole: UserRole;
  applicantNumber: string; // Student or Staff ID
  permitType: PermitType;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  campus: string; // e.g. 'Bloemfontein Main Campus', 'Qwaqwa Campus', 'South Campus'
  preferredZoneCategory: ZoneCategory;
  justification?: string;
  disabilityProofDoc?: string;
  studentProofDoc?: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedDate?: string;
  reviewerNotes?: string;
  allocatedPermitId?: string;
  applicationType?: 'new' | 'renewal';
}

export interface Permit {
  id: string;
  permitNumber: string; // e.g. 'KP-2026-STU-0891'
  userId: string;
  userName: string;
  userRole: UserRole;
  userIdentifier: string;
  vehicleRegistration: string;
  vehicleMakeModel: string;
  permitType: PermitType;
  allowedZoneCategories: ZoneCategory[];
  campus: string;
  issueDate: string;
  expiryDate: string;
  status: PermitStatus;
  qrCodeData: string;
  renewalStatus?: 'eligible' | 'pending_review' | 'renewed';
  renewalCount?: number;
  lastRenewedDate?: string;
  feeAmount?: number;
  paymentStatus?: 'unpaid' | 'paid';
  paymentReference?: string;
}

export interface ParkingZone {
  id: string;
  code: string; // e.g. 'ZONE-A'
  name: string;
  category: ZoneCategory;
  campus: string;
  locationDescription: string;
  totalBays: number;
  occupiedBays: number;
  allowedPermitTypes: PermitType[];
  status: ZoneStatus;
  restrictions: string;
  hourlyRate?: number;
  coordinates?: { lat: number; lng: number };
}

export interface ParkingBay {
  id: string;
  zoneId: string;
  bayNumber: string;
  isOccupied: boolean;
  isReserved: boolean;
  bayType: 'standard' | 'disability' | 'reserved' | 'ev';
  currentVehicleReg?: string;
}

export interface VisitorReservation {
  id: string;
  reservationNumber?: string;
  reservationCode?: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitorType: string;
  vehicleRegistration: string;
  vehicleMakeModel?: string;
  vehicleDescription?: string;
  hostPerson: string;
  hostDepartment: string;
  purpose?: string;
  campus?: string;
  visitDate: string;
  startTime?: string;
  endTime?: string;
  arrivalTime?: string;
  departureTime?: string;
  zoneId?: string;
  zoneName?: string;
  assignedBayNumber: number | string;
  temporaryPermitCode?: string;
  qrCodeData: string;
  status: 'confirmed' | 'checked_in' | 'checked-in' | 'cancelled' | 'expired';
  createdAt?: string;
  registeredByName?: string;
  registeredByRole?: UserRole;
  feeAmount?: number;
  paymentStatus?: 'unpaid' | 'paid';
  paymentReference?: string;
}

export interface NotificationItem {
  id: string;
  targetRole?: UserRole | 'all';
  targetUserId?: string | 'all' | 'admin' | 'security';
  title: string;
  message: string;
  type: 
    | 'success'
    | 'warning'
    | 'alert'
    | 'info'
    | 'permit_approval' 
    | 'permit_rejection' 
    | 'permit_expiry' 
    | 'visitor_confirmed' 
    | 'visitor_cancelled' 
    | 'security_alert' 
    | 'grace_period_warning'
    | 'fine_issued'
    | 'system';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface ALPRScanResult {
  id: string;
  timestamp?: string;
  scanTimestamp?: string;
  cameraLocation?: string;
  zoneId: string;
  zoneName: string;
  zoneCategory?: ZoneCategory;
  plateNumber?: string;
  licensePlate?: string;
  confidence?: number;
  confidenceScore?: number;
  permitFound?: boolean;
  isZoneAllowed?: boolean;
  authorizationStatus?: 'authorized' | 'unauthorized';
  status?: 'authorized' | 'unauthorized' | 'grace_period' | 'warning';
  gateAction?: 'open' | 'closed' | 'open_temporary';
  reason?: string;
  violationReason?: string;
  matchedUserName?: string;
  permitHolder?: string;
  permitType?: PermitType;
  permitNumber?: string;
  permitStatus?: PermitStatus;
  gracePeriodSeconds?: number;
}

export interface ParkingViolation {
  id: string;
  violationNumber?: string;
  scanId?: string;
  fineReferenceNumber?: string;
  fineNumber?: string;
  vehicleRegistration: string;
  vehicleMakeModel?: string;
  vehicleOwnerName?: string;
  zoneId: string;
  zoneName: string;
  timestamp?: string;
  detectionTimestamp?: string;
  violationType?: string;
  reason?: string;
  status: ViolationStatus;
  gracePeriodMinutes?: number;
  gracePeriodRemainingSeconds?: number;
  gracePeriodExpiryTimestamp?: string;
  fineAmount?: number;
  officerNotes?: string;
  securityOfficerNotes?: string;
  resolvedTimestamp?: string;
}

export interface Fine {
  id: string;
  fineNumber: string; // e.g. 'UFS-FINE-2026-1049'
  violationId: string;
  violationNumber: string;
  vehicleRegistration: string;
  offenderName?: string;
  offenderIdentifier?: string;
  zoneName: string;
  issueDate: string;
  dueDate: string;
  amount: number; // in ZAR (R)
  reason: string;
  status: FineStatus;
  paymentReference?: string;
  issuedBy: string;
}

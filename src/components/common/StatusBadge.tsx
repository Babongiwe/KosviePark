import React from 'react';
import { PermitStatus, ZoneStatus, ViolationStatus, FineStatus, UserRole } from '../../types';

interface StatusBadgeProps {
  status: PermitStatus | ZoneStatus | ViolationStatus | FineStatus | UserRole | string | undefined;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
}) => {
  const safeStatus = (status ?? '').toString();
  const normalized = safeStatus.toLowerCase();
  const displayStatus = normalized === 'paid' ? 'Settled' : normalized === 'unpaid' ? 'Fine Issued' : null;

  const getBadgeConfig = () => {
    switch (normalized) {
      // Permit / Active statuses
      case 'active':
      case 'approved':
      case 'authorized':
      case 'confirmed':
      case 'paid':
      case 'resolved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: safeStatus ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1).replace('_', ' ') : 'Active',
        };

      // Pending / In progress
      case 'pending':
      case 'grace_period_active':
      case 'maintenance':
      case 'appealed':
      case 'eligible':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          label: safeStatus === 'grace_period_active' ? 'Grace Period Active' : safeStatus ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1) : 'Pending',
        };

      // Negative / Alert
      case 'rejected':
      case 'expired':
      case 'cancelled':
      case 'unauthorized':
      case 'unpaid':
      case 'fine_issued':
      case 'closed':
      case 'detected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: safeStatus === 'fine_issued' ? 'Fine Issued' : safeStatus ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1) : 'Alert',
        };

      // Roles
      case 'student':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Student',
        };
      case 'staff':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Staff Member',
        };
      case 'admin':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          label: 'Administrator',
        };
      case 'security':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
          label: 'Campus Security',
        };
      case 'visitor':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          dot: 'bg-teal-500',
          label: 'Visitor',
        };

      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: safeStatus || 'N/A',
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses[size]} whitespace-nowrap`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />}
      <span>{displayStatus ?? config.label}</span>
    </span>
  );
};

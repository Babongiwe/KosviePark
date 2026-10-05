import { VisitorReservation } from '../types';

/**
 * A visitor temporary permit automatically lapses once the expected
 * departure time on the visit date has passed.
 */
export const isReservationExpired = (res: VisitorReservation): boolean => {
  if (res.status === 'cancelled') return false;
  const end = res.endTime || res.departureTime || '17:00';
  const stamp = Date.parse(`${res.visitDate}T${end}:00`);
  if (Number.isNaN(stamp)) return false;
  return Date.now() > stamp;
};

/** Status to display for a reservation, accounting for automatic expiry. */
export const effectiveReservationStatus = (res: VisitorReservation): string =>
  isReservationExpired(res) ? 'expired' : res.status;

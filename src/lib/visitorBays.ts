import type { ParkingZone, VisitorReservation } from '../types';

const ACTIVE = ['confirmed', 'checked_in', 'checked-in'];

export const bayPrefix = (zone: ParkingZone) => zone.code.replace(/^ZONE-/, '');

/** Bays in a zone not already reserved by an active visitor booking on that date. */
export function availableBays(zone: ParkingZone, date: string, reservations: VisitorReservation[]): string[] {
  const taken = new Set(
    reservations
      .filter((r) => r.zoneId === zone.id && r.visitDate === date && ACTIVE.includes(r.status))
      .map((r) => String(r.assignedBayNumber))
  );
  const prefix = bayPrefix(zone);
  const all = Array.from({ length: zone.totalBays }, (_, i) => `${prefix}-${String(i + 1).padStart(2, '0')}`);
  // Legacy bookings use "V-14" style numbers for the visitor zone.
  const legacy = (b: string) => b.replace(/^V1-/, 'V-');
  return all.filter((b) => !taken.has(b) && !taken.has(legacy(b)));
}

/** Zones a visitor may park in, best fit for the visitor type first. */
export function suitableZones(zones: ParkingZone[], visitorType: string): ParkingZone[] {
  const ok = zones.filter((z) => z.status === 'active' && z.allowedPermitTypes.includes('visitor'));
  const wantsVisitorZone = !/contractor/i.test(visitorType);
  return ok.sort((a, b) => {
    const score = (z: ParkingZone) => (z.category === 'Visitor Parking' ? (wantsVisitorZone ? 0 : 1) : wantsVisitorZone ? 1 : 0);
    return score(a) - score(b);
  });
}

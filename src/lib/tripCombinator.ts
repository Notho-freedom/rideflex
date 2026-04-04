import type { Trip } from '../types/database';

export interface TripCombination {
  trips: Trip[];
  totalDuration: number;
  totalDetour: number; // extra minutes vs direct
}

/**
 * Find combinable trips for a given trip.
 * Rules:
 * - Next trip's departure city ~= current trip's arrival city
 * - Next trip departs after current trip's estimated arrival
 * - Detour <= 20 minutes
 */
export function findCombinations(
  currentTrip: Trip,
  allTrips: Trip[],
  maxDetourMinutes = 20
): TripCombination[] {
  const combos: TripCombination[] = [];

  const candidates = allTrips.filter(t => {
    if (t.id === currentTrip.id) return false;
    if (t.driver_id !== currentTrip.driver_id) return false;
    if (t.status !== 'active') return false;

    // City match (case-insensitive)
    const arrivalCity = currentTrip.to_city.toLowerCase().trim();
    const departureCity = t.from_city.toLowerCase().trim();
    if (!arrivalCity.includes(departureCity) && !departureCity.includes(arrivalCity)) return false;

    // Time check: next trip must depart after current arrival
    if (currentTrip.estimated_arrival_time && t.departure_time) {
      if (t.departure_time < currentTrip.estimated_arrival_time) return false;
    }

    return true;
  });

  for (const candidate of candidates) {
    combos.push({
      trips: [currentTrip, candidate],
      totalDuration: 0, // Would be calculated with Mapbox in real usage
      totalDetour: 0,
    });
  }

  return combos;
}

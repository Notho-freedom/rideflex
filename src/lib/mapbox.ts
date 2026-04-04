const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

export interface RouteResult {
  duration: number; // seconds
  distance: number; // meters
  geometry: GeoJSON.LineString;
}

export interface GeocodingResult {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export async function geocode(query: string): Promise<GeocodingResult[]> {
  if (!MAPBOX_TOKEN || !query.trim()) return [];
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5&language=fr`
  );
  const data = await res.json();
  return (data.features || []).map((f: any) => ({
    place_name: f.place_name,
    center: f.center,
  }));
}

export async function getRoute(
  from: [number, number],
  to: [number, number],
  stops: [number, number][] = []
): Promise<RouteResult | null> {
  if (!MAPBOX_TOKEN) return null;
  const coords = [from, ...stops, to].map(c => c.join(',')).join(';');
  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
  );
  const data = await res.json();
  if (!data.routes?.length) return null;
  const route = data.routes[0];
  return {
    duration: route.duration,
    distance: route.distance,
    geometry: route.geometry,
  };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m} min`;
}

export function addTimeToTime(timeStr: string, seconds: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMin = h * 60 + m + Math.round(seconds / 60);
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

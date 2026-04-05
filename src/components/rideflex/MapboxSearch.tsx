import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface Trip {
  id: number;
  driver: string;
  rating: number;
  from: string;
  to: string;
  time: string;
  price: number;
  seats: number;
  lat: number;
  lng: number;
}

interface MapboxSearchProps {
  trips: Trip[];
  radius: number;
  onTripClick: (tripId: number) => void;
  className?: string;
}

function createCircleGeoJSON(center: [number, number], radiusKm: number, points = 64) {
  const coords: [number, number][] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);
    const lat = center[1] + (dy / 111.32);
    const lng = center[0] + (dx / (111.32 * Math.cos(center[1] * Math.PI / 180)));
    coords.push([lng, lat]);
  }
  return {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [coords] },
    properties: {},
  };
}

export function MapboxSearch({ trips, radius, onTripClick, className = '' }: MapboxSearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [userPos, setUserPos] = useState<[number, number]>([-73.5673, 45.5017]);
  const [loaded, setLoaded] = useState(false);

  // Get user position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.longitude, pos.coords.latitude]),
      () => {} // keep default
    );
  }, []);

  // Init map
  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userPos,
      zoom: 12,
      pitch: 50,
      bearing: -17.6,
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    }));

    map.on('style.load', () => {
      setLoaded(true);

      // 3D buildings
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(l => l.type === 'symbol' && l.layout?.['text-field'])?.id;
      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 12,
        paint: {
          'fill-extrusion-color': 'hsl(214, 40%, 85%)',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      }, labelLayerId);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; setLoaded(false); };
  }, []);

  // Update center when userPos changes
  useEffect(() => {
    mapRef.current?.flyTo({ center: userPos, duration: 1000 });
  }, [userPos]);

  // Update radius circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    const circle = createCircleGeoJSON(userPos, radius);
    if (map.getSource('search-radius')) {
      (map.getSource('search-radius') as mapboxgl.GeoJSONSource).setData(circle as any);
    } else {
      map.addSource('search-radius', { type: 'geojson', data: circle as any });
      map.addLayer({
        id: 'search-radius-fill',
        type: 'fill',
        source: 'search-radius',
        paint: { 'fill-color': 'hsl(214, 100%, 50%)', 'fill-opacity': 0.06 },
      });
      map.addLayer({
        id: 'search-radius-border',
        type: 'line',
        source: 'search-radius',
        paint: { 'line-color': 'hsl(214, 100%, 50%)', 'line-width': 2, 'line-opacity': 0.35, 'line-dasharray': [3, 2] },
      });
    }
  }, [radius, userPos, loaded]);

  // Update markers
  useEffect(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const map = mapRef.current;
    if (!map) return;

    trips.forEach((trip) => {
      const el = document.createElement('div');
      el.style.cssText = `
        background: hsl(214, 100%, 50%); color: white; font-weight: 700; font-size: 12px;
        padding: 4px 10px; border-radius: 20px; border: 2px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25); cursor: pointer; white-space: nowrap;
      `;
      el.textContent = `${trip.price}€`;

      const popupHTML = `
        <div style="font-family:Inter,sans-serif;min-width:180px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <img src="https://i.pravatar.cc/40?u=${trip.id}" style="width:36px;height:36px;border-radius:50%;"/>
            <div>
              <div style="font-weight:600;font-size:14px;">${trip.driver}</div>
              <div style="font-size:12px;color:#888;">★ ${trip.rating}</div>
            </div>
          </div>
          <div style="font-size:13px;color:#555;margin-bottom:4px;">${trip.from} → ${trip.to}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12px;color:#888;">${trip.time} · ${trip.seats} places</span>
            <span style="font-weight:700;color:hsl(214,100%,50%);font-size:16px;">${trip.price}€</span>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, maxWidth: '240px' }).setHTML(popupHTML);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([trip.lng, trip.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        // Show popup first, navigate on popup click
        popup.getElement()?.addEventListener('click', () => onTripClick(trip.id));
      });

      markersRef.current.push(marker);
    });
  }, [trips, loaded]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl ${className}`}>
        <p className="text-sm text-muted-foreground">Clé Mapbox manquante</p>
      </div>
    );
  }

  return <div ref={containerRef} className={`w-full h-full rounded-xl ${className}`} />;
}

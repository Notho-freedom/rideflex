import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface MapboxMapProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
  route?: { type: 'LineString'; coordinates: [number, number][] } | null;
  markers?: Array<{ lng: number; lat: number; label?: string; color?: string; popup?: string }>;
  radiusKm?: number;
  radiusCenter?: [number, number];
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  interactive?: boolean;
  show3DBuildings?: boolean;
  style?: string;
}

function createCircleGeoJSON(center: [number, number], radiusKm: number, points = 64) {
  const coords: [number, number][] = [];
  const km = radiusKm;
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = km * Math.cos(angle);
    const dy = km * Math.sin(angle);
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

export function MapboxMap({
  className = '',
  center = [-73.5673, 45.5017], // Montreal default
  zoom = 12,
  pitch = 45,
  bearing = -17.6,
  route,
  markers = [],
  radiusKm,
  radiusCenter,
  onMapClick,
  interactive = true,
  show3DBuildings = true,
  style = 'mapbox://styles/mapbox/streets-v12',
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center,
      zoom,
      pitch,
      bearing,
      interactive,
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('style.load', () => {
      setLoaded(true);

      if (show3DBuildings) {
        const layers = map.getStyle().layers;
        const labelLayerId = layers?.find(
          (l) => l.type === 'symbol' && l.layout?.['text-field']
        )?.id;

        map.addLayer(
          {
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
          },
          labelLayerId
        );
      }
    });

    if (onMapClick) {
      map.on('click', (e) => onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat }));
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setLoaded(false);
    };
  }, []);

  // Update route
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    if (map.getSource('route')) {
      (map.getSource('route') as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        geometry: route || { type: 'LineString', coordinates: [] },
        properties: {},
      });
    } else if (route) {
      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: route, properties: {} },
      });
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'hsl(214, 100%, 50%)',
          'line-width': 5,
          'line-opacity': 0.8,
        },
      });
    }

    if (route && route.coordinates.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      route.coordinates.forEach((c) => bounds.extend(c as [number, number]));
      map.fitBounds(bounds, { padding: 60, duration: 1000 });
    }
  }, [route, loaded]);

  // Update radius circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    const rc = radiusCenter || center;
    if (radiusKm && radiusKm > 0) {
      const circle = createCircleGeoJSON(rc, radiusKm);
      if (map.getSource('radius-circle')) {
        (map.getSource('radius-circle') as mapboxgl.GeoJSONSource).setData(circle as any);
      } else {
        map.addSource('radius-circle', { type: 'geojson', data: circle as any });
        map.addLayer({
          id: 'radius-fill',
          type: 'fill',
          source: 'radius-circle',
          paint: { 'fill-color': 'hsl(214, 100%, 50%)', 'fill-opacity': 0.08 },
        });
        map.addLayer({
          id: 'radius-border',
          type: 'line',
          source: 'radius-circle',
          paint: { 'line-color': 'hsl(214, 100%, 50%)', 'line-width': 2, 'line-opacity': 0.4 },
        });
      }
    } else if (map.getSource('radius-circle')) {
      if (map.getLayer('radius-fill')) map.removeLayer('radius-fill');
      if (map.getLayer('radius-border')) map.removeLayer('radius-border');
      map.removeSource('radius-circle');
    }
  }, [radiusKm, radiusCenter, loaded]);

  // Fly to new center when it changes (and no route is active to avoid fighting fitBounds)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded || !center) return;
    if (route && route.coordinates.length > 1) return;
    map.flyTo({ center, zoom: zoom ?? map.getZoom(), duration: 1200, essential: true });
  }, [center?.[0], center?.[1], loaded]);

  // Auto-fit when multiple markers but no route yet
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded || markers.length < 2) return;
    if (route && route.coordinates.length > 1) return;
    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach((m) => bounds.extend([m.lng, m.lat] as [number, number]));
    map.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 14 });
  }, [markers, loaded]);

  // Update markers
  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const map = mapRef.current;
    if (!map) return;

    markers.forEach((m) => {
      const el = document.createElement('div');
      el.className = 'mapbox-custom-marker';
      el.style.cssText = `
        width: 32px; height: 32px; border-radius: 50%;
        background: ${m.color || 'hsl(214, 100%, 50%)'};
        border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 700; font-size: 11px; cursor: pointer;
      `;
      if (m.label) el.textContent = m.label;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([m.lng, m.lat])
        .addTo(map);

      if (m.popup) {
        marker.setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(m.popup));
      }

      markersRef.current.push(marker);
    });
  }, [markers, loaded]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <p className="text-sm text-muted-foreground">Clé Mapbox manquante</p>
      </div>
    );
  }

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
}

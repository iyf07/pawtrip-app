import 'mapbox-gl/dist/mapbox-gl.css';

import { useEffect, useRef, useState } from 'react';
import { Asset } from 'expo-asset';

import type { TripMapProps } from './TripMap.types';

type MapboxGL = typeof import('mapbox-gl').default;
type Map = import('mapbox-gl').Map;
type Marker = import('mapbox-gl').Marker;

const PINS: Record<string, number> = {
  'pin-stop': require('../../assets/icons/pin-stop.png'),
  'pin-stay': require('../../assets/icons/pin-stay.png'),
  'pin-idea': require('../../assets/icons/pin-idea.png'),
};

const TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

/** Mapbox GL map for the web. mapbox-gl is loaded on demand (it needs `window`, and Expo renders on a server first). */
export function TripMap({ pins, line, center, dark, onPin, height }: TripMapProps) {
  const box = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const gl = useRef<MapboxGL | null>(null);
  const markers = useRef<Marker[]>([]);
  const onPinRef = useRef(onPin);
  useEffect(() => {
    onPinRef.current = onPin;
  }, [onPin]);

  // create the map (again when the colour scheme changes)
  useEffect(() => {
    let alive = true;
    let created: Map | null = null;
    import('mapbox-gl').then((mod) => {
      if (!alive || !box.current || !TOKEN) return;
      const mb = mod.default;
      mb.accessToken = TOKEN;
      gl.current = mb;
      created = new mb.Map({
        container: box.current,
        style: dark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/outdoors-v12',
        center: [center?.lon ?? -98, center?.lat ?? 39],
        zoom: center ? 10 : 3,
        attributionControl: true,
      });
      created.addControl(new mb.NavigationControl({ showCompass: false }), 'bottom-right');
      setMap(created);
    });
    return () => {
      alive = false;
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      created?.remove();
      setMap(null);
    };
    // the map is created once per colour scheme; pins/route update separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark]);

  // keep the canvas matched to its box (the box shrinks when a detail pane opens below it)
  useEffect(() => {
    const el = box.current;
    if (!map || !el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);

  // pins + route
  useEffect(() => {
    if (!map || !gl.current) return;
    const mb = gl.current;
    markers.current.forEach((m) => m.remove());
    markers.current = pins.map((p) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.setAttribute('aria-label', p.label);
      const pinUrl = (n: string) => Asset.fromModule(PINS[n] as number).uri;
      const base = 'display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;border:0;background-color:transparent;background-repeat:no-repeat;background-size:contain;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));';
      if (p.kind === 'stop') {
        // the numbered stop sits in the empty circle of the pin
        el.style.cssText = `${base}width:38px;height:46px;background-image:url(${pinUrl('pin-stop')});padding-bottom:10px;font:800 13px Nunito,system-ui,sans-serif;color:#4A3628;`;
        el.textContent = p.label;
      } else if (p.kind === 'stay') {
        el.style.cssText = `${base}width:36px;height:44px;background-image:url(${pinUrl('pin-stay')});`;
      } else {
        el.style.cssText = `${base}width:36px;height:44px;background-image:url(${pinUrl('pin-idea')});`;
      }
      el.addEventListener('click', () => onPinRef.current(p.id));
      return new mb.Marker({ element: el, anchor: 'bottom' }).setLngLat([p.lon, p.lat]).addTo(map);
    });

    const draw = () => {
      const data = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: line ?? [] } } as const;
      const src = map.getSource('route') as import('mapbox-gl').GeoJSONSource | undefined;
      if (src) src.setData(data);
      else if (line && line.length > 1) {
        map.addSource('route', { type: 'geojson', data });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#3D7590', 'line-width': 4, 'line-dasharray': [1, 2] },
        });
      }
    };
    if (map.loaded()) draw();
    else map.once('load', draw);

    const pts: [number, number][] = [...pins.map((p) => [p.lon, p.lat] as [number, number]), ...(line ?? [])];
    const fit = () => {
      if (pts.length === 0) {
        if (center) map.jumpTo({ center: [center.lon, center.lat], zoom: 10 });
      } else if (pts.length === 1) {
        map.jumpTo({ center: pts[0], zoom: 13 });
      } else {
        const b = new mb.LngLatBounds(pts[0], pts[0]);
        pts.forEach((p) => b.extend(p));
        map.fitBounds(b, { padding: 48, maxZoom: 14, duration: 0 });
      }
    };
    map.resize();
    fit();
  }, [map, pins, line, center]);

  // a fixed height, or "fill the parent" (the parent must be position: relative)
  const style: React.CSSProperties =
    typeof height === 'number'
      ? { width: '100%', height, borderRadius: 14, overflow: 'hidden' }
      : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' };
  return <div ref={box} style={style} />;
}

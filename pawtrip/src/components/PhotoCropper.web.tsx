import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import type { CropRect, PickedPhoto } from '@/lib/photos';

import type { PhotoCropperProps } from './PhotoCropper.types';

const V = 280; // viewport (the square the user frames) in CSS px
const MAX_ZOOM = 5;

type View2D = { z: number; ox: number; oy: number };

/** Drag to move, wheel / pinch / slider to zoom. The circle shows how the photo will look as an avatar. */
export function PhotoCropper({ photo, onCancel, onDone }: PhotoCropperProps) {
  return (
    <Sheet visible={!!photo} onClose={onCancel}>
      {photo ? <CropBody key={photo.uri} photo={photo} onCancel={onCancel} onDone={onDone} /> : null}
    </Sheet>
  );
}

function CropBody({ photo, onCancel, onDone }: { photo: PickedPhoto; onCancel: () => void; onDone: (r: CropRect) => void }) {
  const { t } = useT();
  const th = useTheme();
  const { width: w, height: h } = photo;
  const base = V / Math.min(w, h); // scale at which the shorter side exactly fills the viewport

  const clamp = (v: View2D): View2D => {
    const z = Math.min(MAX_ZOOM, Math.max(1, v.z));
    const dw = w * base * z;
    const dh = h * base * z;
    return { z, ox: Math.min(0, Math.max(V - dw, v.ox)), oy: Math.min(0, Math.max(V - dh, v.oy)) };
  };
  const centered = (): View2D => ({ z: 1, ox: (V - w * base) / 2, oy: (V - h * base) / 2 });

  const [view, setViewState] = useState<View2D>(centered);
  const viewRef = useRef(view);
  const box = useRef<HTMLDivElement | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; z: number } | null>(null);

  const setView = (v: View2D) => {
    const c = clamp(v);
    viewRef.current = c;
    setViewState(c);
  };

  /** Zoom to `z`, keeping the picture point under (fx, fy) (viewport coordinates) where it is. */
  const zoomAt = (z: number, fx: number, fy: number) => {
    const cur = viewRef.current;
    const nz = Math.min(MAX_ZOOM, Math.max(1, z));
    const sc = base * cur.z;
    const px = (fx - cur.ox) / sc;
    const py = (fy - cur.oy) / sc;
    setView({ z: nz, ox: fx - px * base * nz, oy: fy - py * base * nz });
  };

  // wheel needs a non-passive listener so the page does not scroll while zooming
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(viewRef.current.z * Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // zoomAt only uses refs and constants of this photo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const local = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), z: viewRef.current.z };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const now = local(e);
    pointers.current.set(e.pointerId, now);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(pinch.current.z * (dist / Math.max(1, pinch.current.dist)), (a.x + b.x) / 2, (a.y + b.y) / 2);
    } else if (pointers.current.size === 1) {
      const cur = viewRef.current;
      setView({ ...cur, ox: cur.ox + (now.x - prev.x), oy: cur.oy + (now.y - prev.y) });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  function done() {
    const sc = base * viewRef.current.z;
    onDone({ x: -viewRef.current.ox / sc, y: -viewRef.current.oy / sc, size: V / sc });
  }

  const sc = base * view.z;
  return (
    <View style={{ alignItems: 'center' }}>
      <Text weight={800} size={20} style={{ alignSelf: 'flex-start' }}>
        {t('dog.cropTitle')}
      </Text>
      <View style={{ height: 14 }} />

      <div
        ref={box}
        data-testid="crop-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ position: 'relative', width: V, height: V, overflow: 'hidden', borderRadius: 18, background: th.line, touchAction: 'none', cursor: 'grab', userSelect: 'none' }}>
        <img
          src={photo.uri}
          alt=""
          draggable={false}
          data-testid="crop-image"
          style={{ position: 'absolute', left: 0, top: 0, width: w * sc, height: h * sc, maxWidth: 'none', transform: `translate(${view.ox}px, ${view.oy}px)`, pointerEvents: 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 0 999px rgba(0,0,0,0.45)', border: '3px solid #fff', pointerEvents: 'none' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: V, marginTop: 14 }}>
        <Icon name="ui-zoom" size={26} />
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={view.z}
          aria-label={t('dog.cropZoom')}
          onChange={(e) => zoomAt(Number(e.target.value), V / 2, V / 2)}
          style={{ flex: 1, accentColor: th.gold }}
        />
      </div>

      <View style={{ alignSelf: 'stretch', marginTop: 18, gap: 8 }}>
        <Button label={t('dog.cropUse')} block onPress={done} />
        <Button label={t('nav.cancel')} variant="text" block onPress={onCancel} />
      </View>
    </View>
  );
}

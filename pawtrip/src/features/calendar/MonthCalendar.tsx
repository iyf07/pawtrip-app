import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, View, type ViewStyle } from 'react-native';

import { countScheduled, useMoveTrip, useTrips, type TripListItem } from '@/api/trips';
import { useAuth } from '@/auth/AuthProvider';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { layoutSegments, monthGrid, type Seg } from '@/lib/calendar';
import { MAX_TRIP_DAYS, addDaysIso, daysBetween, datesLabel, isoOf, parseIso, todayIso } from '@/lib/dates';

/** Pastel bars for trips (dark text on all of them, light or dark mode). */
const BARS = [
  ['#FFE08A', '#E6B422'],
  ['#F9C4D2', '#E08AA3'],
  ['#BFE3C6', '#6FB383'],
  ['#BFD9EA', '#6A9FC0'],
  ['#FFD0A8', '#E8914F'],
  ['#D9CCF0', '#9C84CF'],
] as const;
const INK = '#4A3628';
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);

const LANE_TOP = 26;
const LANE_H = 26;
const FACE = 20;
const LANE_GAP = 3;

type Drag =
  | { kind: 'select'; from: string; to: string }
  | { kind: 'move'; tripId: string; from: string; to: string }
  | null;

type Pending = { trip: TripListItem; start: string; end: string; n: number };

/**
 * Month view of all trips. Tap an empty day (or drag across days) to start a new trip there; drag a trip bar to
 * move it to other dates. Moving turns everything that was scheduled into ideas, so it asks first.
 */
export function MonthCalendar() {
  const { t, locale } = useT();
  const th = useTheme();
  const toast = useToast();
  const { wide } = useLayout();
  const { userId } = useAuth();
  const trips = useTrips();
  const move = useMoveTrip();

  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [w, setW] = useState(0);
  const [drag, setDrag] = useState<Drag>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  const rowH = wide ? 124 : 84;
  const { gridStart, rows, dayAt } = useMemo(() => monthGrid(cursor.y, cursor.m), [cursor]);
  const list = useMemo(() => trips.data ?? [], [trips.data]);
  const byId = useMemo(() => new Map(list.map((x) => [x.id, x])), [list]);
  const layout = useMemo(() => layoutSegments(list, gridStart, rows), [list, gridStart, rows]);
  const maxLanes = Math.max(1, Math.floor((rowH - LANE_TOP) / (LANE_H + LANE_GAP)));
  const cw = w / 7;
  const today = todayIso();

  // the responder reads the newest data through this ref (it is only read while a finger moves)
  const live = useRef({ layout, rowH, cw, byId, dayAt, userId, maxLanes });
  useEffect(() => {
    live.current = { layout, rowH, cw, byId, dayAt, userId, maxLanes };
  });
  const drop = useRef<{ x: number; y: number; hit: Hit; moved: boolean } | null>(null);

  type Hit = { iso: string; seg: Seg | null };
  const hitAt = (x: number, y: number): Hit => {
    const s = live.current;
    const col = Math.min(6, Math.max(0, Math.floor(x / s.cw)));
    const row = Math.min(s.layout.length - 1, Math.max(0, Math.floor(y / s.rowH)));
    const yIn = y - row * s.rowH - LANE_TOP;
    const lane = yIn >= 0 ? Math.floor(yIn / (LANE_H + LANE_GAP)) : -1;
    const seg = lane >= 0 && lane < s.maxLanes ? (s.layout[row].find((g) => g.lane === lane && col >= g.sc && col <= g.ec) ?? null) : null;
    return { iso: s.dayAt(row, col), seg };
  };

  async function askMove(trip: TripListItem, delta: number) {
    const start = addDaysIso(trip.start_date, delta);
    const end = addDaysIso(trip.end_date, delta);
    try {
      const n = await countScheduled(trip.id);
      setPending({ trip, start, end, n });
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  function release(h: Hit, moved: boolean, startHit: Hit) {
    const s = live.current;
    if (!moved) {
      if (startHit.seg) router.push({ pathname: '/trip/[id]/plan', params: { id: startHit.seg.tripId } });
      else router.push({ pathname: '/new-trip', params: { start: startHit.iso, end: startHit.iso } });
      return;
    }
    if (startHit.seg) {
      const trip = s.byId.get(startHit.seg.tripId);
      const delta = daysBetween(startHit.iso, h.iso);
      if (!trip || delta === 0) return;
      if (trip.creator_id !== s.userId) return void toast(t('cal.onlyLeader'));
      if (trip.status === 'completed') return void toast(t('cal.done'));
      void askMove(trip, delta);
      return;
    }
    const a = startHit.iso < h.iso ? startHit.iso : h.iso;
    let b = startHit.iso < h.iso ? h.iso : startHit.iso;
    if (daysBetween(a, b) + 1 > MAX_TRIP_DAYS) b = addDaysIso(a, MAX_TRIP_DAYS - 1);
    router.push({ pathname: '/new-trip', params: { start: a, end: b } });
  }

  // eslint-disable-next-line react-hooks/refs -- handlers only touch refs while a finger is down, never while rendering
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        drop.current = { x, y, hit: hitAt(x, y), moved: false };
      },
      onPanResponderMove: (e) => {
        const d = drop.current;
        if (!d) return;
        const { locationX: x, locationY: y } = e.nativeEvent;
        if (!d.moved && Math.hypot(x - d.x, y - d.y) < 6) return;
        d.moved = true;
        const h = hitAt(x, y);
        setDrag(d.hit.seg ? { kind: 'move', tripId: d.hit.seg.tripId, from: d.hit.iso, to: h.iso } : { kind: 'select', from: d.hit.iso, to: h.iso });
      },
      onPanResponderRelease: (e) => {
        const d = drop.current;
        drop.current = null;
        setDrag(null);
        if (!d) return;
        release(hitAt(e.nativeEvent.locationX, e.nativeEvent.locationY), d.moved, d.hit);
      },
      onPanResponderTerminate: () => {
        drop.current = null;
        setDrag(null);
      },
    }),
  );

  async function confirmMove() {
    if (!pending) return;
    const p = pending;
    try {
      const n = await move.mutateAsync({ tripId: p.trip.id, start: p.start, end: p.end });
      toast(n > 0 ? t('cal.moved', { n }) : t('cal.movedPlain'));
      setCursor({ y: parseIso(p.start).getFullYear(), m: parseIso(p.start).getMonth() });
    } catch {
      toast(t('common.saveFailed'));
    }
    setPending(null);
  }

  const monthTitle = new Date(cursor.y, cursor.m, 1).toLocaleDateString(locale, { year: 'numeric', month: 'long' });
  const shift = (n: number) => setCursor((c) => ({ y: new Date(c.y, c.m + n, 1).getFullYear(), m: new Date(c.y, c.m + n, 1).getMonth() }));
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 7 + i).toLocaleDateString(locale, { weekday: wide ? 'short' : 'narrow' }));

  // what the drag looks like: a highlighted range, or the trip bar shifted to where it would land
  const range = drag?.kind === 'select' ? (drag.from < drag.to ? [drag.from, drag.to] : [drag.to, drag.from]) : null;
  const dragged = drag?.kind === 'move' ? byId.get(drag.tripId) : null;
  const delta = drag?.kind === 'move' ? daysBetween(drag.from, drag.to) : 0;
  const ghost = useMemo(() => {
    if (!dragged || delta === 0) return null;
    const g = { id: dragged.id, name: dragged.name, start_date: addDaysIso(dragged.start_date, delta), end_date: addDaysIso(dragged.end_date, delta) };
    return { trip: g, segs: layoutSegments([g], gridStart, rows).flat() };
  }, [dragged, delta, gridStart, rows]);

  const cell = (row: number, col: number) => {
    const iso = dayAt(row, col);
    const d = parseIso(iso);
    const inMonth = d.getMonth() === cursor.m;
    const picked = range ? iso >= range[0] && iso <= range[1] : false;
    const isToday = iso === today;
    const style: ViewStyle = {
      position: 'absolute',
      left: col * cw,
      top: row * rowH,
      width: cw,
      height: rowH,
      borderRightWidth: col < 6 ? 1 : 0,
      borderBottomWidth: 1,
      borderColor: th.line,
      backgroundColor: picked ? th.goldBg : inMonth ? th.card : 'transparent',
      padding: 4,
    };
    return (
      <View key={iso} pointerEvents="none" style={style}>
        <View style={{ alignSelf: 'flex-start', minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: isToday ? th.gold : 'transparent', paddingHorizontal: 4 }}>
          <Text plain size={12} weight={800} color={isToday ? 'onGold' : inMonth ? 'text' : 'muted'} style={{ lineHeight: 16 }}>
            {d.getDate()}
          </Text>
        </View>
      </View>
    );
  };

  // everyone on the trip (people, then dogs) on the first piece of its bar, as many as fit
  const faces = (trip: TripListItem | undefined, barW: number) => {
    if (!trip) return null;
    const all = [
      ...trip.trip_members.map((m) => ({ key: `p-${m.user_id}`, person: { id: m.user_id, name: m.profiles?.display_name, url: m.profiles?.avatar_url } })),
      ...trip.trip_dogs.map((d) => ({ key: `d-${d.dog_id}`, dogUrl: d.dogs?.photo_url ?? null, person: null })),
    ];
    const fit = Math.floor((barW - 70) / (FACE - 8));
    if (fit < 1) return null;
    const shown = all.length > fit ? all.slice(0, Math.max(1, fit - 1)) : all;
    const rest = all.length - shown.length;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {shown.map((f, i) => (
          <View key={f.key} style={{ marginLeft: i === 0 ? 0 : -8 }}>
            {f.person ? <Avatar id={f.person.id} name={f.person.name} url={f.person.url} size={FACE} border={2} /> : <DogAvatar url={'dogUrl' in f ? f.dogUrl : null} size={FACE} border={2} />}
          </View>
        ))}
        {rest > 0 ? (
          <Text weight={800} size={10} style={{ color: INK, marginLeft: 3 }}>
            +{rest}
          </Text>
        ) : null}
      </View>
    );
  };

  const bar = (s: Seg, trip: { id: string; name: string }, opts?: { ghost?: boolean }) => {
    const [bg, border] = BARS[Math.abs(hash(trip.id)) % BARS.length];
    const faded = !opts?.ghost && dragged?.id === trip.id && delta !== 0;
    return (
      <View
        key={`${opts?.ghost ? 'g' : 's'}${trip.id}-${s.row}-${s.sc}`}
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: s.sc * cw + 2,
          top: s.row * rowH + LANE_TOP + s.lane * (LANE_H + LANE_GAP),
          width: (s.ec - s.sc + 1) * cw - 4,
          height: LANE_H,
          backgroundColor: bg,
          borderWidth: opts?.ghost ? 2 : 1,
          borderStyle: opts?.ghost ? 'dashed' : 'solid',
          borderColor: border,
          borderTopLeftRadius: s.startsHere ? 11 : 3,
          borderBottomLeftRadius: s.startsHere ? 11 : 3,
          borderTopRightRadius: s.endsHere ? 11 : 3,
          borderBottomRightRadius: s.endsHere ? 11 : 3,
          justifyContent: 'center',
          paddingHorizontal: 8,
          opacity: faded ? 0.35 : opts?.ghost ? 0.92 : 1,
          zIndex: opts?.ghost ? 5 : 1,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text weight={800} size={12} numberOfLines={1} style={{ color: INK, lineHeight: 16, flex: 1 }}>
            {trip.name}
          </Text>
          {s.startsHere ? faces(byId.get(trip.id), (s.ec - s.sc + 1) * cw - 4) : null}
        </View>
      </View>
    );
  };

  // "+n more" when a row has more stacked trips than lanes
  const more = layout.flatMap((segs, row) => {
    const hidden = new Map<number, number>();
    segs.filter((g) => g.lane >= maxLanes).forEach((g) => {
      for (let c = g.sc; c <= g.ec; c++) hidden.set(c, (hidden.get(c) ?? 0) + 1);
    });
    return [...hidden].map(([col, n]) => (
      <View key={`m${row}-${col}`} pointerEvents="none" style={{ position: 'absolute', left: col * cw + 4, top: row * rowH + rowH - 18 }}>
        <Meta size={11}>{t('cal.more', { n })}</Meta>
      </View>
    ));
  });

  const nav = (label: string, onPress: () => void) => (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: th.card, borderWidth: 2, borderColor: th.line }}>
      <Text plain weight={800} size={18} color="muted" style={{ lineHeight: 22 }}>
        {label}
      </Text>
    </Pressable>
  );

  const body = pending
    ? pending.n > 0
      ? t('cal.moveBody', { name: pending.trip.name, from: datesLabel(pending.trip.start_date, pending.trip.end_date, locale), to: datesLabel(pending.start, pending.end, locale), n: pending.n })
      : t('cal.moveBody0', { name: pending.trip.name, from: datesLabel(pending.trip.start_date, pending.trip.end_date, locale), to: datesLabel(pending.start, pending.end, locale) })
    : '';

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        {nav('‹', () => shift(-1))}
        <Text weight={800} size={22} style={{ minWidth: 150, textAlign: 'center' }}>
          {monthTitle}
        </Text>
        {nav('›', () => shift(1))}
        <Pressable onPress={() => setCursor({ y: new Date().getFullYear(), m: new Date().getMonth() })} accessibilityRole="button" style={{ paddingHorizontal: 14, height: 36, borderRadius: 18, justifyContent: 'center', backgroundColor: th.card, borderWidth: 2, borderColor: th.line }}>
          <Text weight={800} size={14}>
            {t('cal.today')}
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {weekdays.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
            <Meta weight={800}>{d}</Meta>
          </View>
        ))}
      </View>
      <View
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        style={[{ height: rows * rowH, borderWidth: 1, borderColor: th.line, borderRadius: 16, overflow: 'hidden', backgroundColor: th.bg }, { touchAction: 'none', userSelect: 'none' } as ViewStyle]}
        {...pan.panHandlers}>
        {w > 0 ? (
          <>
            {Array.from({ length: rows }, (_, r) => Array.from({ length: 7 }, (_, c) => cell(r, c)))}
            {layout.flatMap((segs) => segs.filter((s) => s.lane < maxLanes).map((s) => bar(s, byId.get(s.tripId)!)))}
            {ghost ? ghost.segs.map((s) => bar({ ...s, lane: 0 }, ghost.trip, { ghost: true })) : null}
            {more}
          </>
        ) : null}
      </View>

      <ConfirmSheet
        visible={pending !== null}
        title={t('cal.moveTitle')}
        body={body}
        confirmLabel={pending && pending.n > 0 ? t('cal.moveBtnIdeas') : t('cal.moveBtn')}
        danger={!!pending && pending.n > 0}
        busy={move.isPending}
        onConfirm={confirmMove}
        onClose={() => setPending(null)}
      />
    </View>
  );
}

export const monthKey = (d: Date) => isoOf(d).slice(0, 7);

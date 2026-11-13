import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, PanResponder, Pressable, ScrollView, View } from 'react-native';

import { usePatchItem } from '@/api/items';
import { useSettings } from '@/api/profile';
import { TripMap } from '@/components/TripMap';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Chip';
import { useToast } from '@/components/ui/Toast';
import { Meta, Text } from '@/components/ui/Text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLayout } from '@/hooks/use-layout';
import { useTimeFmt } from '@/hooks/use-prefs';
import { useCatColors, useTheme } from '@/hooks/use-theme';
import { FacePile } from '@/features/plan/FacePile';
import { aloneIssues, conflictsOf, dayItems, dogMode, hasTime, isIdea, isLive, layoutDay, timeFields, type ItemView } from '@/features/plan/model';
import { ItemDetailPanel } from '@/features/plan/ItemDetailSheet';
import { PlanMap } from '@/features/plan/PlanMap';
import { buildPins, useDayRoute, useItemCoords } from '@/features/plan/useDayGeo';
import { WeatherBanner } from '@/features/plan/WeatherBanner';
import { TabBody, useTripCtx } from '@/features/trip/TripContext';
import { useT } from '@/i18n';
import { parseIso, weekdayShort } from '@/lib/dates';
import { WX_EMOJI, tempOut, useWeather } from '@/lib/weather';

const PX = 96; // pixels per hour: the whole day, opened scrolled to the morning
const GUTTER = 46;

export default function Plan() {
  const { t, locale } = useT();
  const { wide } = useLayout();
  const dark = useColorScheme() === 'dark';
  const { fmtMin, hourLabel } = useTimeFmt();
  const th = useTheme();
  const { trip, dogs, days, day, setDay, items, itemsLoading, itemsError, refetchItems, addItem, openItem, openItemId } = useTripCtx();
  const [show, setShow] = useState<'all' | 'confirmed'>('all');
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);

  const dayList = dayItems(items, day).filter((i) => show === 'all' || i.confirmed);
  const stays = items.filter((i) => isLive(i) && i.type === 'stay' && i.stayFrom != null && day >= i.stayFrom && day <= (i.stayTo ?? i.stayFrom) && (show === 'all' || i.confirmed));
  const layout = layoutDay(dayList);

  // weather + sun for the selected day
  const settings = useSettings();
  const unit = settings.data?.temp_unit === 'C' ? 'C' : 'F';
  const weather = useWeather(trip, days);
  const wx = weather.data?.[days[day]];

  // map: today's stops in time order, loose ideas and the stay as extra pins, route + drive times between stops
  const near = { lat: trip.lat, lon: trip.lon };
  const looseIdeas = items.filter((i) => isLive(i) && isIdea(i) && !hasTime(i));
  const coords = useItemCoords([...dayList, ...looseIdeas, ...stays], near);
  const stops = [...dayList]
    .sort((a, b) => a.start! - b.start!)
    .filter((i) => coords[i.id])
    .map((i) => ({ id: i.id, ...coords[i.id] }));
  const { line, travelTo } = useDayRoute(stops);
  const pins = buildPins(
    stops,
    looseIdeas.filter((i) => coords[i.id]).map((i) => ({ id: i.id, ...coords[i.id] })),
    stays.filter((i) => coords[i.id]).map((i) => ({ id: i.id, ...coords[i.id] })),
  );

  // open scrolled to the first item of the day (or 7 AM)
  const firstStart = dayList.length ? Math.min(...dayList.map((i) => i.start!)) : 7 * 60;
  useEffect(() => {
    const id = setTimeout(() => scroller.current?.scrollTo({ y: Math.max(0, (firstStart / 60 - 0.5) * PX), animated: false }), 50);
    return () => clearTimeout(id);
  }, [day, firstStart, itemsLoading]);

  const timeline = (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
          {days.map((iso, i) => {
            const on = i === day;
            const dw = weather.data?.[iso];
            const d = parseIso(iso);
            return (
              <Pressable
                key={iso}
                onPress={() => setDay(i)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={{
                  minWidth: 72,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 18,
                  alignItems: 'center',
                  backgroundColor: on ? th.gold : th.card,
                  borderWidth: on ? 4 : 2,
                  borderColor: on ? th.sticker : th.line,
                  boxShadow: on ? `0 2px 6px -1px ${th.shadow}` : undefined,
                }}>
                <Text size={11} weight={800} color={on ? 'onGold' : 'muted'}>
                  {weekdayShort(iso, locale)}
                </Text>
                <Text size={20} weight={800} color={on ? 'onGold' : 'text'}>
                  {`${d.getMonth() + 1}/${d.getDate()}`}
                </Text>
                {dw ? (
                  <View style={{ alignItems: 'center', marginTop: 2 }}>
                    <Text size={16} style={{ lineHeight: 20 }}>
                      {WX_EMOJI[dw.icon]}
                    </Text>
                    <Text size={11} weight={700} color={on ? 'onGold' : 'muted'}>
                      {tempOut(dw.hi, unit)}°/{tempOut(dw.lo, unit)}°
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ marginTop: 10 }}>
          <Segmented
            value={show}
            onChange={setShow}
            options={[
              { value: 'all', label: t('plan.showAll') },
              { value: 'confirmed', label: t('plan.showConfirmed') },
            ]}
          />
        </View>

        {wx ? <WeatherBanner wx={wx} dogs={dogs} unit={unit} /> : null}
        {wide ? null : (
          <PlanMap
            pins={pins}
            line={line}
            center={trip.lat != null && trip.lon != null ? { lat: trip.lat, lon: trip.lon } : null}
            stops={stops.length}
            onPin={openItem}
          />
        )}
        {!itemsLoading && !itemsError ? stays.map((s) => <StayStrip key={s.id} item={s} />) : null}
      </View>
      <TabBody innerRef={scroller}>
        {itemsLoading ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <ActivityIndicator color={th.muted} />
          </View>
        ) : itemsError ? (
          <Card style={{ alignItems: 'center', marginTop: 16 }}>
            <Text weight={800}>{t('common.loadFailed')}</Text>
            <Button label={t('common.retry')} small onPress={refetchItems} style={{ marginTop: 8 }} />
          </Card>
        ) : (
          <>
            {dayList.length === 0 ? (
              <Card style={{ alignItems: 'center', marginTop: 12 }}>
                <Text size={30}>🦴</Text>
                <Text weight={800}>{t('plan.emptyDay.title', { day: weekdayShort(days[day], locale) })}</Text>
                <Text size={13} color="muted" style={{ textAlign: 'center', marginTop: 2 }}>
                  {t('plan.emptyDay.body')}
                </Text>
              </Card>
            ) : null}

            <View style={{ marginTop: 14, height: 24 * PX + 10 }}>
              {Array.from({ length: 25 }, (_, h) => (
                <View key={h} pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: h * PX, height: 0, borderTopWidth: 1, borderColor: th.line }}>
                  <Text size={12} weight={800} color="muted" style={{ position: 'absolute', top: -10, left: 0, width: 42, backgroundColor: th.bg, lineHeight: 20 }}>
                    {hourLabel(h)}
                  </Text>
                  {wx?.hours?.[h] ? (
                    <Text size={11} weight={700} color="muted" style={{ position: 'absolute', top: 12, left: 0, width: 42, lineHeight: 15 }}>
                      {WX_EMOJI[wx.hours[h].icon]}
                      {tempOut(wx.hours[h].temp, unit)}°
                    </Text>
                  ) : null}
                </View>
              ))}
              {/* tap empty time to add */}
              <Pressable
                accessibilityLabel={t('plan.addAt', { time: '' })}
                onPress={(e) => {
                  // locationY is missing on some touch events; fall back to the pointer position, then to 10 AM
                  const ne = e.nativeEvent as unknown as { locationY?: number; clientY?: number; touches?: { clientY: number }[]; changedTouches?: { clientY: number }[] };
                  let y = ne.locationY;
                  if (!Number.isFinite(y)) {
                    const rect = (e.currentTarget as unknown as { getBoundingClientRect?: () => { top: number } }).getBoundingClientRect?.();
                    const cy = ne.clientY ?? ne.touches?.[0]?.clientY ?? ne.changedTouches?.[0]?.clientY;
                    y = rect && Number.isFinite(cy) ? (cy as number) - rect.top : 10 * PX;
                  }
                  const raw = Math.floor((((y as number) / PX) * 60) / 30) * 30;
                  const start = Math.max(0, Math.min(Number.isFinite(raw) ? raw : 600, 23 * 60));
                  addItem({ origin: 'plan', day, start, end: Math.min(start + 60, 1440) });
                }}
                style={{ position: 'absolute', left: GUTTER, right: 0, top: 0, bottom: 0 }}
              />
              {wx?.rise != null && wx?.set != null ? (
                <>
                  <View pointerEvents="none" style={{ position: 'absolute', left: GUTTER, right: 0, top: 0, height: wx.rise * (PX / 60), backgroundColor: th.night, borderRadius: 6 }} />
                  <View pointerEvents="none" style={{ position: 'absolute', left: GUTTER, right: 0, top: wx.set * (PX / 60), bottom: 0, backgroundColor: th.night, borderRadius: 6 }} />
                  {([['rise', wx.rise, th.sun, '☀︎'], ['set', wx.set, th.sunset, '☾']] as const).map(([k, m, color, icon]) => (
                    <View key={k} pointerEvents="none" style={{ position: 'absolute', left: GUTTER, right: 0, top: m * (PX / 60), height: 0, borderTopWidth: 1.5, borderColor: color }}>
                      <View style={{ position: 'absolute', left: 6, top: -10, paddingHorizontal: 8, height: 20, justifyContent: 'center', borderRadius: 10, backgroundColor: th.bg, borderWidth: 1.5, borderColor: color }}>
                        <Text size={11} weight={700} style={{ color, lineHeight: 14 }}>
                          {icon} {t(`sun.${k}`)} {fmtMin(m)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              ) : null}
              <View pointerEvents="box-none" style={{ position: 'absolute', left: GUTTER, right: 0, top: 0, bottom: 0 }}>
                {dayList.map((it) => (
                  <Block key={it.id} item={it} col={layout[it.id].col} n={layout[it.id].n} travel={travelTo[it.id]} />
                ))}
              </View>
            </View>
          </>
        )}
      </TabBody>

      <Pressable
        onPress={() => addItem({ origin: 'plan', day, start: 600, end: 660 })}
        accessibilityLabel={t('add.title')}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: 62,
          height: 62,
          borderRadius: 31,
          backgroundColor: th.gold,
          borderWidth: 5,
          borderColor: th.sticker,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 14px -4px ${th.shadow}`,
        }}>
        <Text size={32} weight={800} color="onGold" style={{ lineHeight: 36 }}>
          +
        </Text>
      </Pressable>
    </View>
  );

  if (!wide) return timeline;

  // desktop: timeline column (same width as on a phone, so entries stay readable) + a map that fills the rest
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 16, paddingRight: 16, paddingBottom: 16 }}>
      <View style={{ width: 560 }}>{timeline}</View>
      <View style={{ flex: 1, position: 'relative', borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: th.line }}>
        {openItemId ? (
          // over the map (kept mounted underneath so closing is instant)
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
            <ItemDetailPanel />
          </View>
        ) : null}
        <TripMap pins={pins} line={line} center={trip.lat != null && trip.lon != null ? { lat: trip.lat, lon: trip.lon } : null} dark={dark} onPin={openItem} height="100%" />
        {pins.length === 0 ? (
          <View pointerEvents="none" style={{ position: 'absolute', left: 16, right: 16, bottom: 16, alignItems: 'center' }}>
            <View style={{ backgroundColor: th.card, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 2, borderColor: th.line }}>
              <Meta>{t('map.empty.body')}</Meta>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function StayStrip({ item }: { item: ItemView }) {
  const { t, locale } = useT();
  const th = useTheme();
  const c = useCatColors('stay');
  const { openItem, days } = useTripCtx();
  const label = `${weekdayShort(days[item.stayFrom!], locale)} → ${weekdayShort(days[item.stayTo ?? item.stayFrom!], locale)}`;
  return (
    <Pressable
      onPress={() => openItem(item.id)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: 10,
        borderRadius: 10,
        backgroundColor: item.confirmed ? c.tint : th.card,
        borderLeftWidth: 5,
        borderLeftColor: c.c,
        borderWidth: item.confirmed ? 0 : 2,
        borderStyle: item.confirmed ? 'solid' : 'dashed',
        borderColor: c.c,
      }}>
      <Text>🏨</Text>
      <Text weight={800} size={14} style={{ flex: 1 }} numberOfLines={1}>
        {item.title}
      </Text>
      <Meta>
        {item.confirmed ? '' : `${t('st.idea')} · `}
        {label}
      </Meta>
    </Pressable>
  );
}

const SNAP = 15; // minutes

function Block({ item, col, n, travel }: { item: ItemView; col: number; n: number; travel?: number }) {
  const { t } = useT();
  const { fmtMin, fmtRange } = useTimeFmt();
  const th = useTheme();
  const toast = useToast();
  const c = useCatColors(item.cat);
  const { trip, days, items, dogs, openItem, isLeader } = useTripCtx();
  const patch = usePatchItem(trip.id);

  // drag the grip on the right edge to move the entry in time (confirmed entries: leader only)
  const canDrag = !item.confirmed || isLeader;
  const [dragMin, setDragMin] = useState<number | null>(null); // minutes moved while dragging
  const [movedTo, setMovedTo] = useState<number | null>(null); // new start, kept until the saved value arrives
  const dur = item.end! - item.start!;
  const start = dragMin != null ? item.start! + dragMin : (movedTo ?? item.start!);
  const live = useRef({ start: item.start!, dur, dayIdx: item.day });
  const touchedGrip = useRef(false); // a drag (or a tap on the grip) must not also open the entry
  useEffect(() => {
    live.current = { start: item.start!, dur, dayIdx: item.day };
  });
  const clamp = (dy: number) => {
    const { start: s0, dur: d0 } = live.current;
    const m = Math.round(((dy / PX) * 60) / SNAP) * SNAP;
    return Math.max(-s0, Math.min(m, 1440 - d0 - s0));
  };
  const grip = useMemo(
    () =>
      // the handlers read `live` only when a touch happens, never during render
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          touchedGrip.current = true;
        },
        onPanResponderMove: (_e, g) => setDragMin(clamp(g.dy)),
        onPanResponderRelease: (_e, g) => {
          const m = clamp(g.dy);
          setDragMin(null);
          setTimeout(() => (touchedGrip.current = false), 300);
          if (m === 0) return;
          const s = live.current.start + m;
          setMovedTo(s);
          patch.mutate(
            { id: item.id, patch: timeFields(days, live.current.dayIdx, s, s + live.current.dur) },
            { onError: () => toast(t('common.saveFailed')), onSettled: () => setMovedTo(null) },
          );
        },
        onPanResponderTerminate: () => {
          setDragMin(null);
          setTimeout(() => (touchedGrip.current = false), 300);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.id, days],
  );

  const top = start * (PX / 60);
  const h = Math.max(dur * (PX / 60) - 4, 28);
  const short = h < 52;
  const hasConflict = conflictsOf(item, items).length > 0;
  const hasAlone = aloneIssues(item, dogs).length > 0;
  const withDog = dogs.some((d) => dogMode(item, d.id) === 'with');

  return (
    <Pressable
      onPress={() => {
        if (!touchedGrip.current) openItem(item.id);
      }}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} ${fmtRange(item.start!, item.end!)}`}
      style={{
        position: 'absolute',
        top,
        height: h,
        left: `${(col / n) * 100}%`,
        width: `${100 / n}%`,
        paddingLeft: col ? 3 : 0,
        zIndex: dragMin != null ? 10 : 0,
        opacity: dragMin != null ? 0.9 : 1,
      }}>
      <View
        style={{
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: item.confirmed ? c.tint : th.card,
          borderLeftWidth: 5,
          borderLeftColor: c.c,
          borderWidth: item.confirmed ? 0 : 2,
          borderStyle: item.confirmed ? 'solid' : 'dashed',
          borderColor: c.c,
          paddingLeft: canDrag ? 24 : 10,
          paddingRight: 10,
          paddingVertical: short ? 2 : 6,
          flexDirection: short ? 'row' : 'column',
          alignItems: short ? 'center' : 'stretch',
          gap: short ? 8 : 1,
        }}>
        <Text weight={item.confirmed ? 800 : 700} size={15} numberOfLines={short ? 1 : 2} style={{ flexShrink: 1, paddingRight: n > 1 ? 0 : 44 }}>
          {item.confirmed ? '' : '💡 '}
          {item.emoji} {item.title}
        </Text>
        <Text size={13} weight={700} color="muted" numberOfLines={1}>
          {short ? fmtMin(start) : fmtRange(start, start + dur)}
          {travel ? ` · ${t('travel', { n: travel })}` : ''}
        </Text>
        {!short ? <FacePile item={item} size={18} /> : null}
        <View style={{ position: 'absolute', top: 4, right: 4, flexDirection: 'row', gap: 4 }}>
          {withDog ? <Text size={14}>🐕</Text> : null}
          {hasAlone ? <Text size={14} accessibilityLabel={t('item.assign')}>🐕⚠️</Text> : null}
          {hasConflict ? <Text size={14}>⚠️</Text> : null}
        </View>
        {canDrag ? (
          <View
            {...grip.panHandlers}
            accessibilityLabel={t('plan.drag')}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, alignItems: 'center', justifyContent: 'center', touchAction: 'none', cursor: 'grab' } as never}>
            <Text size={16} weight={800} color="muted" style={{ lineHeight: 18 }}>
              ⠿
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

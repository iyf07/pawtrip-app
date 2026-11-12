import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Chip';
import { Meta, Text } from '@/components/ui/Text';
import { useCatColors, useTheme } from '@/hooks/use-theme';
import { FacePile } from '@/features/plan/FacePile';
import { aloneIssues, conflictsOf, dayItems, dogMode, isLive, layoutDay, type ItemView } from '@/features/plan/model';
import { TabBody, useTripCtx } from '@/features/trip/TripContext';
import { useT } from '@/i18n';
import { parseIso, weekdayShort } from '@/lib/dates';
import { fmtMin, fmtRange, hourLabel } from '@/lib/time';

const PX = 96; // pixels per hour: the whole day, opened scrolled to the morning
const GUTTER = 46;

export default function Plan() {
  const { t, locale } = useT();
  const th = useTheme();
  const { days, day, setDay, items, itemsLoading, itemsError, refetchItems, addItem } = useTripCtx();
  const [show, setShow] = useState<'all' | 'confirmed'>('all');
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);

  const dayList = dayItems(items, day).filter((i) => show === 'all' || i.confirmed);
  const stays = items.filter((i) => isLive(i) && i.type === 'stay' && i.stayFrom != null && day >= i.stayFrom && day <= (i.stayTo ?? i.stayFrom) && (show === 'all' || i.confirmed));
  const layout = layoutDay(dayList);

  // open scrolled to the first item of the day (or 7 AM)
  const firstStart = dayList.length ? Math.min(...dayList.map((i) => i.start!)) : 7 * 60;
  useEffect(() => {
    const id = setTimeout(() => scroller.current?.scrollTo({ y: Math.max(0, (firstStart / 60 - 0.5) * PX), animated: false }), 50);
    return () => clearTimeout(id);
  }, [day, firstStart, itemsLoading]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
          {days.map((iso, i) => {
            const on = i === day;
            return (
              <Pressable
                key={iso}
                onPress={() => setDay(i)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={{
                  minWidth: 64,
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
                  {parseIso(iso).getDate()}
                </Text>
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
                </View>
              ))}
              {/* tap empty time to add */}
              <Pressable
                accessibilityLabel={t('plan.addAt', { time: '' })}
                onPress={(e) => {
                  const start = Math.min(Math.floor(((e.nativeEvent.locationY / PX) * 60) / 30) * 30, 23 * 60);
                  addItem({ origin: 'plan', day, start, end: Math.min(start + 60, 1440) });
                }}
                style={{ position: 'absolute', left: GUTTER, right: 0, top: 0, bottom: 0 }}
              />
              <View pointerEvents="box-none" style={{ position: 'absolute', left: GUTTER, right: 0, top: 0, bottom: 0 }}>
                {dayList.map((it) => (
                  <Block key={it.id} item={it} col={layout[it.id].col} n={layout[it.id].n} />
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

function Block({ item, col, n }: { item: ItemView; col: number; n: number }) {
  const { t } = useT();
  const th = useTheme();
  const c = useCatColors(item.cat);
  const { items, dogs, openItem } = useTripCtx();

  const top = item.start! * (PX / 60);
  const h = Math.max((item.end! - item.start!) * (PX / 60) - 4, 28);
  const short = h < 52;
  const hasConflict = conflictsOf(item, items).length > 0;
  const hasAlone = aloneIssues(item, dogs).length > 0;
  const withDog = dogs.some((d) => dogMode(item, d.id) === 'with');

  return (
    <Pressable
      onPress={() => openItem(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} ${fmtRange(item.start!, item.end!)}`}
      style={{
        position: 'absolute',
        top,
        height: h,
        left: `${(col / n) * 100}%`,
        width: `${100 / n}%`,
        paddingLeft: col ? 3 : 0,
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
          paddingHorizontal: 10,
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
          {short ? fmtMin(item.start!) : fmtRange(item.start!, item.end!)}
        </Text>
        {!short ? <FacePile item={item} size={18} /> : null}
        <View style={{ position: 'absolute', top: 4, right: 4, flexDirection: 'row', gap: 4 }}>
          {withDog ? <Text size={14}>🐕</Text> : null}
          {hasAlone ? <Text size={14} accessibilityLabel={t('item.assign')}>🐕⚠️</Text> : null}
          {hasConflict ? <Text size={14}>⚠️</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

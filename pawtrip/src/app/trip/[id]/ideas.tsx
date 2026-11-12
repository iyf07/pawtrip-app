import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useSetDeleted } from '@/api/items';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DogIllo } from '@/components/ui/DogIllo';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTimeFmt } from '@/hooks/use-prefs';
import { useCatColors, useTheme } from '@/hooks/use-theme';
import { FacePile } from '@/features/plan/FacePile';
import { hasTime, isIdea, isLive, type ItemView } from '@/features/plan/model';
import { TabBody, useTripCtx } from '@/features/trip/TripContext';
import { useT, type Key } from '@/i18n';
import { weekdayShort } from '@/lib/dates';
import { relTime } from '@/lib/format';

/** Ideas the group is still deciding on. The leader puts them in the plan from the item detail. */
export default function Ideas() {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { trip, items, itemsLoading, itemsError, refetchItems, addItem } = useTripCtx();
  const setDeleted = useSetDeleted(trip.id);
  const [deletedOpen, setDeletedOpen] = useState(false);

  const ideas = items.filter((i) => isLive(i) && isIdea(i));
  const deleted = items.filter((i) => !isLive(i)).sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));

  async function restore(i: ItemView) {
    try {
      await setDeleted.mutateAsync({ id: i.id, deleted: false });
      toast(t('toast.restored', { name: i.title }));
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return (
    <TabBody>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <Text weight={800} size={20}>
          {t('ideas.thisTrip')}
        </Text>
        <Button label={`+ ${t('add.newIdea')}`} small onPress={() => addItem({ origin: 'idea' })} />
      </View>

      {itemsLoading ? (
        <View style={{ alignItems: 'center', paddingTop: 40 }}>
          <ActivityIndicator color={th.muted} />
        </View>
      ) : itemsError ? (
        <Card style={{ alignItems: 'center', marginTop: 16 }}>
          <Text weight={800}>{t('common.loadFailed')}</Text>
          <Button label={t('common.retry')} small onPress={refetchItems} style={{ marginTop: 8 }} />
        </Card>
      ) : ideas.length === 0 ? (
        <View style={{ alignItems: 'center', paddingTop: 32 }}>
          <DogIllo size={120} tilt={2} />
          <Text weight={800} size={20} style={{ marginTop: 18 }}>
            {t('ideas.empty.title')}
          </Text>
          <Text color="muted" style={{ marginTop: 4, textAlign: 'center' }}>
            {t('ideas.empty.body')}
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12, marginTop: 12 }}>
          {ideas.map((i) => (
            <IdeaCard key={i.id} item={i} />
          ))}
        </View>
      )}

      {deleted.length > 0 ? (
        <View style={{ marginTop: 24 }}>
          <Pressable onPress={() => setDeletedOpen((v) => !v)} accessibilityRole="button" accessibilityState={{ expanded: deletedOpen }} style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 44, alignItems: 'center' }}>
            <Text weight={800} color="muted">
              {t('ideas.deleted', { n: deleted.length })}
            </Text>
            <Text weight={800} color="muted">
              {deletedOpen ? '⌃' : '⌄'}
            </Text>
          </Pressable>
          {deletedOpen
            ? deleted.map((i) => (
                <View key={i.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1.5, borderStyle: 'dashed', borderColor: th.line }}>
                  <View style={{ flex: 1 }}>
                    <Text weight={800}>{i.title}</Text>
                    <Meta>
                      {t('ideas.removedAgo', { ago: relTime(i.deletedAt ?? 0, t) })}
                    </Meta>
                  </View>
                  <Button label={t('ideas.restore')} variant="text" small onPress={() => restore(i)} />
                </View>
              ))
            : null}
        </View>
      ) : null}
    </TabBody>
  );
}

function IdeaCard({ item }: { item: ItemView }) {
  const { t, locale } = useT();
  const { fmtMin } = useTimeFmt();
  const c = useCatColors(item.cat);
  const { days, openItem } = useTripCtx();
  const when = !hasTime(item)
    ? t('item.noTime')
    : item.type === 'stay'
      ? `${weekdayShort(days[item.stayFrom!], locale)} →`
      : `${weekdayShort(days[item.day!], locale)} ${fmtMin(item.start!)}`;
  return (
    <Card onPress={() => openItem(item.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.tint, alignItems: 'center', justifyContent: 'center' }}>
        <Text size={22}>{item.emoji}</Text>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text weight={800} size={16} numberOfLines={2}>
          {item.title}
        </Text>
        <Meta numberOfLines={1}>
          {t(`cat.${item.cat}` as Key)} · {when}
        </Meta>
        <FacePile item={item} size={22} />
      </View>
    </Card>
  );
}

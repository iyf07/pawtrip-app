import { useState } from 'react';
import { View } from 'react-native';

import { useAddBuddiesToTrip, useBuddies } from '@/api/buddies';
import type { TripDetail } from '@/api/trips';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';

/** "Add my buddies": pick accepted buddies who are not on the trip yet (and whether their dogs come too). */
export function AddBuddiesSheet({ visible, onClose, trip }: { visible: boolean; onClose: () => void; trip: TripDetail }) {
  const { t } = useT();
  const toast = useToast();
  const buddies = useBuddies();
  const add = useAddBuddiesToTrip();
  const [picked, setPicked] = useState<string[]>([]);
  const [dogs, setDogs] = useState(true);

  const onTrip = new Set(trip.trip_members.map((m) => m.user_id));
  const free = (buddies.data ?? []).filter((b) => b.status === 'accepted' && !onTrip.has(b.userId));

  async function save() {
    try {
      await add.mutateAsync({ tripId: trip.id, buddyIds: picked, withDogs: dogs });
      toast(t('bd.addedToTrip'));
      setPicked([]);
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={20}>
        {t('bd.addMine')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {free.length === 0 ? (
          <Text color="muted">{t('bd.none')}</Text>
        ) : (
          free.map((b) => (
            <Chip
              key={b.userId}
              icon={<Avatar id={b.userId} name={b.name} url={b.avatar} size={24} border={2} />}
              label={b.name}
              on={picked.includes(b.userId)}
              onPress={() => setPicked((cur) => (cur.includes(b.userId) ? cur.filter((x) => x !== b.userId) : [...cur, b.userId]))}
            />
          ))
        )}
        {picked.length > 0 ? <Chip label={t('nt.buddies.dogs')} on={dogs} onPress={() => setDogs((v) => !v)} /> : null}
      </View>
      <View style={{ marginTop: 16, gap: 8 }}>
        <Button label={t('bd.addBtn')} block disabled={picked.length === 0} loading={add.isPending} onPress={save} />
        <Button label={t('common.cancel')} variant="text" block onPress={onClose} />
      </View>
    </Sheet>
  );
}

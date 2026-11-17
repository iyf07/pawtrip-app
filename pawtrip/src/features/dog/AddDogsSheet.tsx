import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { useAddDogToTrip, type TripDetail } from '@/api/trips';
import { DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';

/** "Add my dogs": tick which of your dogs come on this trip; with no dog profile yet it leads to creating one. */
export function AddDogsSheet({ visible, onClose, trip }: { visible: boolean; onClose: () => void; trip: TripDetail }) {
  const { t } = useT();
  const toast = useToast();
  const here = usePathname();
  const dogs = useMyDogs();
  const add = useAddDogToTrip();
  const [picked, setPicked] = useState<string[]>([]);

  const onTrip = new Set(trip.trip_dogs.map((d) => d.dog_id));
  const mine = dogs.data ?? [];
  const free = mine.filter((d) => !onTrip.has(d.id));

  async function save() {
    try {
      for (const id of picked) await add.mutateAsync({ tripId: trip.id, dogId: id });
      setPicked([]);
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  function create() {
    onClose();
    // the new dog is made in its own flow, which returns here afterwards
    router.push({ pathname: '/dogs/[id]', params: { id: 'new', returnTo: here } });
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text weight={800} size={20}>
        {t('dogs.addMine')}
      </Text>
      {free.length > 0 ? (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {free.map((d) => (
              <Chip
                key={d.id}
                icon={<DogAvatar url={d.photo_url} size={26} border={2} />}
                label={d.name}
                on={picked.includes(d.id)}
                onPress={() => setPicked((cur) => (cur.includes(d.id) ? cur.filter((x) => x !== d.id) : [...cur, d.id]))}
              />
            ))}
          </View>
          <View style={{ marginTop: 16, gap: 8 }}>
            <Button label={t('dogs.addBtn')} block disabled={picked.length === 0} loading={add.isPending} onPress={save} />
            <Button label={t('dogs.newProfile')} variant="ghost" block onPress={create} />
          </View>
        </>
      ) : (
        <View style={{ marginTop: 16, gap: 8 }}>
          <Button label={t('dogs.newProfile')} block onPress={create} />
        </View>
      )}
    </Sheet>
  );
}

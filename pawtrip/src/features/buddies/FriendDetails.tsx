import { useState } from 'react';
import { Pressable, View } from 'react-native';

import type { Buddy, FriendDog } from '@/api/buddies';
import { InterestIcon } from '@/components/InterestIcon';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { DOG_SCALES, dogScales } from '@/constants/options';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';

/** Selected interests and read-only dog profiles, shared by every friend card. */
export function FriendDetails({ buddy }: { buddy: Pick<Buddy, 'interests' | 'dogs' | 'status'> }) {
  const { t } = useT();
  const th = useTheme();
  const [selectedDog, setSelectedDog] = useState<FriendDog | null>(null);
  const scales = dogScales(selectedDog ?? {});
  return (
    <View style={{ gap: 10, marginTop: 12 }}>
      <Text size={12} weight={800} color="muted">{t('friend.interests')}</Text>
      {buddy.interests.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {buddy.interests.map((interest) => (
            <View key={interest} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 14, borderWidth: 1, borderColor: th.line }}>
              <InterestIcon interest={interest} size={20} />
              <Text size={12}>{t(`interest.${interest}` as Key)}</Text>
            </View>
          ))}
        </View>
      ) : <Text size={12} color="muted">{t('friend.noInterests')}</Text>}
      {buddy.status === 'accepted' ? (
        <>
          <Text size={12} weight={800} color="muted">{t('friend.dogs')}</Text>
          {buddy.dogs.length ? buddy.dogs.map((dog) => (
            <Pressable key={dog.id} accessibilityRole="button" accessibilityLabel={t('friend.viewDog', { name: dog.name })} onPress={() => setSelectedDog(dog)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
              <DogAvatar url={dog.photo_url} size={36} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text size={14} weight={800}>{dog.name}</Text>
                {dog.weight_lb != null ? <Text size={12} color="muted">{Math.round((dog.weight_unit === 'kg' ? dog.weight_lb / 2.20462 : dog.weight_lb) * 10) / 10} {dog.weight_unit}</Text> : null}
              </View>
              <Text plain color="muted" size={20}>›</Text>
            </Pressable>
          )) : <Text size={12} color="muted">{t('friend.noDogs')}</Text>}
        </>
      ) : null}
      <Sheet visible={!!selectedDog} onClose={() => setSelectedDog(null)}>
        {selectedDog ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DogAvatar url={selectedDog.photo_url} size={60} />
              <Text size={22} weight={800}>{selectedDog.name}</Text>
            </View>
            {DOG_SCALES.map((field) => <ScaleInput key={field} field={field} value={scales[field]} description={t(`scale.${scaleStem(field)}.${scales[field]}.description` as Key)} readOnly onChange={() => {}} />)}
            <Button label={t('common.close')} variant="text" block onPress={() => setSelectedDog(null)} style={{ marginTop: 16 }} />
          </>
        ) : null}
      </Sheet>
    </View>
  );
}

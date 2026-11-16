import { useState } from 'react';
import { Pressable, View } from 'react-native';

import type { Buddy, FriendDog } from '@/api/buddies';
import { DogInterests } from '@/components/DogInterests';
import { InterestIcon } from '@/components/InterestIcon';
import { PersonTraits } from '@/components/PersonTraits';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { dietIcon } from '@/components/DietIcon';
import { Chip } from '@/components/ui/Chip';
import { useLayout } from '@/hooks/use-layout';
import { DOG_SCALES, dogScales, PERSON_SCALES, DIETS } from '@/constants/options';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';

const lb = (d: FriendDog) => (d.weight_lb == null ? null : `${Math.round((d.weight_unit === 'kg' ? d.weight_lb / 2.20462 : d.weight_lb) * 10) / 10} ${d.weight_unit}`);

/** A friend's profile in a popup: who they are, their interests and dogs. The list itself stays light. */
export function FriendSheet({ buddy, onClose, onRemove, inline = false }: { inline?: boolean; buddy: Buddy | null; onClose: () => void; onRemove?: (b: Buddy) => void }) {
  const { t } = useT();
  const th = useTheme();
  const { wide } = useLayout();
  const columns = inline && wide;
  const [dog, setDog] = useState<FriendDog | null>(null);
  const scales = dogScales(dog ?? {});
  const profile = buddy ? (
          <View style={{ gap: 24 }}>
            {!inline ? <Text weight={800} size={26}>{t('friend.home', { name: buddy.name })}</Text> : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Avatar id={buddy.userId} name={buddy.name} url={buddy.avatar} size={64} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text weight={800} size={22} numberOfLines={1}>{buddy.name}</Text>
                <Meta size={14} numberOfLines={1}>@{buddy.handle}</Meta>
                <PersonTraits size={13} profile={buddy.traits} />
              </View>
            </View>

            <View style={{ flexDirection: columns ? 'row' : 'column', gap: 28 }}>
              <View style={{ flex: columns ? 1 : undefined, minWidth: 0 }}>
                <Text weight={800} size={20}>{t('friend.preferences')}</Text>
                <View style={!columns ? { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 } : undefined}>
                  {PERSON_SCALES.map((f) => <ScaleInput key={f} field={f} value={buddy.traits[f]} compact={!columns} readOnly
                    description={t(`scale.${f}.${buddy.traits[f] ?? 3}.description` as Key)} onChange={() => {}} />)}
                </View>
              </View>
              <View style={{ flex: columns ? 1 : undefined, minWidth: 0, gap: 28 }}>
            <View style={{ gap: 8 }}>
              <Text weight={800} size={20}>{t('friend.interests')}</Text>
              {buddy.interests.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {buddy.interests.map((i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 2, borderColor: th.line }}>
                      <InterestIcon interest={i} size={28} />
                      <Text size={14} weight={700}>{t(`interest.${i}` as Key)}</Text>
                    </View>
                  ))}
                </View>
              ) : <Meta size={14}>{t('friend.noInterests')}</Meta>}
            </View>

                <View style={{ gap: 10 }}>
                  <Text weight={800} size={20}>{t('friend.diet')}</Text>
                  {buddy.diet.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {buddy.diet.map((d) => <Chip key={d} icon={dietIcon(d, 28)} label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d} />)}
                  </View> : <Meta size={14}>{t('friend.noDiet')}</Meta>}
                </View>
              </View>
            </View>

            {buddy.status === 'accepted' ? (
              <View style={{ gap: 8 }}>
                <Text weight={800} size={14} color="muted">{t('friend.dogs')}</Text>
                {buddy.dogs.length ? buddy.dogs.map((d) => (
                  <Pressable key={d.id} accessibilityRole="button" accessibilityLabel={t('friend.viewDog', { name: d.name })} onPress={() => setDog(d)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 }}>
                    <DogAvatar url={d.photo_url} size={48} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text size={16} weight={800} numberOfLines={1}>{d.name}</Text>
                      {lb(d) ? <Meta size={13}>{lb(d)}</Meta> : null}
                    </View>
                    <Text plain color="muted" size={22} weight={800}>›</Text>
                  </Pressable>
                )) : <Meta size={14}>{t('friend.noDogs')}</Meta>}
              </View>
            ) : null}

            <View style={{ gap: 4, marginTop: 4 }}>
              {onRemove ? <Button label={t('bd.removeFriend')} variant="danger" small onPress={() => { onRemove(buddy); onClose(); }} /> : null}
              {!inline ? <Button label={t('common.close')} variant="text" block onPress={onClose} /> : null}
            </View>
          </View>
        ) : null;
  return <>
      {inline ? profile : <Sheet visible={!!buddy && !dog} onClose={onClose}>{profile}</Sheet>}
      <Sheet visible={!!dog} onClose={() => setDog(null)}>
        {dog ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DogAvatar url={dog.photo_url} size={60} />
              <Text size={22} weight={800}>{dog.name}</Text>
            </View>
            <Text weight={800} size={20}>{t('dog.interests', { name: dog.name })}</Text>
            <DogInterests values={dog.interests} />
            <Text weight={800} size={20}>{t('dog.preferences', { name: dog.name })}</Text>
            {DOG_SCALES.map((field) => <ScaleInput key={field} field={field} value={scales[field]} description={t(`scale.${scaleStem(field)}.${scales[field]}.description` as Key)} readOnly onChange={() => {}} />)}
            <Button label={t('common.close')} variant="text" block onPress={() => setDog(null)} style={{ marginTop: 16 }} />
          </>
        ) : null}
      </Sheet>
    </>;
}

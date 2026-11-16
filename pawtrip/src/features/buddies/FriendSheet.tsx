import { useState } from 'react';
import { View } from 'react-native';

import type { Buddy, FriendDog } from '@/api/buddies';
import { DogInterests } from '@/components/DogInterests';
import { InterestIcon } from '@/components/InterestIcon';
import { PersonTraits } from '@/components/PersonTraits';
import { DogTraits } from '@/components/DogTraits';
import { ProfileTabs } from '@/components/ProfileTabs';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmSheet, Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { dietIcon } from '@/components/DietIcon';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useLayout } from '@/hooks/use-layout';
import { DOG_SCALES, dogScales, PERSON_SCALES, DIETS } from '@/constants/options';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';

function DogProfile({ dog }: { dog: FriendDog }) {
  const { t } = useT();
  const { wide } = useLayout();
  const scales = dogScales(dog);
  const weight = dog.weight_lb == null ? null : `${Math.round((dog.weight_unit === 'kg' ? dog.weight_lb / 2.20462 : dog.weight_lb) * 10) / 10} ${dog.weight_unit}`;
  return <View style={{ gap: 16, marginTop: 12 }}>
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}><DogAvatar url={dog.photo_url} size={60} /><View style={{ flex: 1 }}><Text weight={800} size={20}>{dog.name}</Text>{weight ? <Meta>{weight}</Meta> : null}<DogTraits dog={dog} /></View></View>
    <View style={{ flexDirection: wide ? 'row' : 'column', gap: 24 }}>
      <View style={{ flex: wide ? 1 : undefined, minWidth: 0 }}><Text size={18} weight={800}>{t('dog.preferences', { name: dog.name })}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>{DOG_SCALES.map((f) => <ScaleInput key={f} compact field={f} value={scales[f]} description={t(`scale.${scaleStem(f)}.${scales[f]}.description` as Key)} readOnly onChange={() => {}} />)}</View>
      </View>
      <View style={{ flex: wide ? 1 : undefined, minWidth: 0, gap: 12 }}><Text size={18} weight={800}>{t('dog.interests', { name: dog.name })}</Text><DogInterests values={dog.interests} /></View>
    </View>
  </View>;
}

export function FriendSheet({ buddy, onClose, onRemove, inline = false }: { inline?: boolean; buddy: Buddy | null; onClose: () => void; onRemove?: (b: Buddy) => void }) {
  const { t } = useT();
  const th = useTheme();
  const { wide } = useLayout();
  const [tab, setTab] = useState<'style' | 'interests' | 'diet' | 'dogs'>('style');
  const [confirm, setConfirm] = useState(false);
  const profile = buddy ? <View style={{ gap: 24 }}>
    {!inline ? <Text weight={800} size={26}>{t('friend.home', { name: buddy.name })}</Text> : null}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}><Avatar id={buddy.userId} name={buddy.name} url={buddy.avatar} size={64} /><View style={{ flex: 1, minWidth: 0 }}><Text weight={800} size={22} numberOfLines={1}>{buddy.name}</Text><Meta size={14}>@{buddy.handle}</Meta><PersonTraits size={13} profile={buddy.traits} /></View></View>
    <ProfileTabs value={tab} onChange={setTab} tabs={[
      { value: 'style', label: t('pf.tab.style'), icon: 'scale-walk-4' },
      { value: 'interests', label: t('pf.tab.interests'), icon: 'cat-fun' },
      { value: 'diet', label: t('pf.tab.diet'), icon: 'diet-vegetarian' },
      { value: 'dogs', label: t('friend.dogs'), icon: 'nav-dogs' },
    ]} />
    {tab === 'style' ? <View><Text weight={800} size={20}>{t('friend.namedPreferences', { name: buddy.name })}</Text>{PERSON_SCALES.map((f) => <ScaleInput key={f} field={f} value={buddy.traits[f]} readOnly description={t(`scale.${f}.${buddy.traits[f] ?? 3}.description` as Key)} onChange={() => {}} />)}</View> : null}
    {tab === 'interests' ? <View style={{ gap: 12 }}><Text weight={800} size={20}>{t('friend.namedInterests', { name: buddy.name })}</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{buddy.interests.length ? buddy.interests.map((i) => <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 2, borderColor: th.line }}><InterestIcon interest={i} size={28} /><Text size={14} weight={700}>{t(`interest.${i}` as Key)}</Text></View>) : <Chip icon={<Icon name="empty-discover" size={28} />} label={t('friend.emptyInterests')} />}</View></View> : null}
    {tab === 'diet' ? <View style={{ gap: 12 }}><Text weight={800} size={20}>{t('friend.namedDiet', { name: buddy.name })}</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{buddy.diet.length ? buddy.diet.map((d) => <Chip key={d} icon={dietIcon(d, 28)} label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d} />) : <Chip icon={<Icon name="empty-discover" size={28} />} label={t('friend.emptyDiet')} />}</View></View> : null}
    {tab === 'dogs' ? <View style={{ gap: 12 }}><Text weight={800} size={20}>{t('friend.namedDogs', { name: buddy.name })}</Text>{buddy.dogs.length ? buddy.dogs.map((dog) => <DogProfile key={dog.id} dog={dog} />) : <Meta>{t('friend.noDogs')}</Meta>}</View> : null}
    {onRemove ? <Button label={t('bd.removeFriend')} variant="danger" block style={{ maxWidth: wide ? 500 : undefined }} onPress={() => setConfirm(true)} /> : null}
    {!inline ? <Button label={t('common.close')} variant="text" block onPress={onClose} /> : null}
    <ConfirmSheet visible={confirm} title={t('friend.removeConfirm')} body={t('friend.removeBody', { name: buddy.name })} confirmLabel={t('bd.removeFriend')} danger onConfirm={() => { setConfirm(false); onRemove?.(buddy); onClose(); }} onClose={() => setConfirm(false)} />
  </View> : null;
  return inline ? profile : <Sheet visible={!!buddy} onClose={onClose}>{profile}</Sheet>;
}

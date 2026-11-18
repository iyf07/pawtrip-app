import { useState } from 'react';
import { View } from 'react-native';

import { RELATIONS, useRespondBuddyRelation, useSetBuddyRelation, useWithdrawBuddyRelation, type Buddy, type FriendDog } from '@/api/buddies';
import { DogInterests } from '@/components/DogInterests';
import { InterestPicker } from '@/components/InterestPicker';
import { PersonTraits } from '@/components/PersonTraits';
import { DogTraits } from '@/components/DogTraits';
import { ProfileTabs } from '@/components/ProfileTabs';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { dietIcon } from '@/components/DietIcon';
import { Chip } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useSettings } from '@/api/profile';
import { weightIn } from '@/lib/dog-weight';
import { useLayout } from '@/hooks/use-layout';
import { DOG_SCALES, dogScales, PERSON_SCALES, DIETS } from '@/constants/options';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';
import { Reveal } from '@/components/ui/Reveal';

function Heading({ title, size = 20 }: { title: string; size?: number }) {
  const th = useTheme();
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40 }}><Text weight={800} size={size} style={{ flexShrink: 1 }}>{title}</Text><View style={{ flex: 1, borderTopWidth: 2, borderStyle: 'dashed', borderColor: th.line }} /></View>;
}

function DogProfile({ dog }: { dog: FriendDog }) {
  const { t } = useT();
  const { wide } = useLayout();
  const scales = dogScales(dog);
  const unit = useSettings().data?.weight_unit === 'kg' ? 'kg' : 'lb';
  const [width, setWidth] = useState(0);
  const cols = Math.max(1, Math.min(4, Math.floor((width + 10) / 170)));
  const cardWidth = width ? (width - (cols - 1) * 10) / cols : undefined;
  const weight = weightIn(dog.weight_lb, unit);
  return <View style={{ gap: 16, marginTop: 12 }}>
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}><DogAvatar url={dog.photo_url} size={60} /><View style={{ flex: 1 }}><Text weight={800} size={20}>{dog.name}</Text>{weight ? <Meta>{weight}</Meta> : null}<DogTraits dog={dog} /></View></View>
    <View style={{ flexDirection: wide ? 'row' : 'column', gap: 24 }}>
      <View style={{ flex: wide ? 1 : undefined, minWidth: 0 }}><Heading size={18} title={t('dog.preferences', { name: dog.name })} />
        <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>{DOG_SCALES.map((f, n) => <ScaleInput key={f} index={n} compact compactWidth={cardWidth} field={f} value={scales[f]} description={t(`scale.${scaleStem(f)}.${scales[f]}.description` as Key)} readOnly onChange={() => {}} />)}</View>
      </View>
      <View style={{ flex: wide ? 1 : undefined, minWidth: 0, gap: 12 }}><Heading size={18} title={t('dog.interests', { name: dog.name })} /><DogInterests values={dog.interests} /></View>
    </View>
  </View>;
}

export type FriendTab = 'style' | 'interests' | 'diet' | 'dogs' | 'friend';

/** The friend page's tabs (shown on top on desktop, in the bottom bar on a phone). */
export function useFriendTabs() {
  const { t } = useT();
  return [
    { value: 'dogs', label: t('friend.dogs'), icon: 'nav-dogs' },
    { value: 'style', label: t('pf.tab.style'), icon: 'scale-walk-4' },
    { value: 'interests', label: t('pf.tab.interests'), icon: 'cat-fun' },
    { value: 'diet', label: t('pf.tab.diet'), icon: 'diet-vegetarian' },
    { value: 'friend', label: t('friend.tab'), icon: 'tab-members' },
  ] as { value: FriendTab; label: string; icon: IconName }[];
}

export function FriendSheet({ buddy, onClose, onRemove, tab: tabProp, onTab, externalTabs }: { buddy: Buddy | null; onClose: () => void; onRemove?: (b: Buddy) => void; tab?: FriendTab; onTab?: (t: FriendTab) => void; /** the page draws the tab bar itself (phone) */ externalTabs?: boolean }) {
  const { t, locale } = useT();
  const { wide } = useLayout();
  const setRelation = useSetBuddyRelation();
  const respondRelation = useRespondBuddyRelation();
  const withdrawRelation = useWithdrawBuddyRelation();
  const [now] = useState(() => Date.now());
  const [ownTab, setOwnTab] = useState<FriendTab>('dogs');
  const tab = tabProp ?? ownTab;
  const setTab = onTab ?? setOwnTab;
  const tabs = useFriendTabs();
  const [gridWidth, setGridWidth] = useState(0);
  const columns = Math.max(1, Math.min(4, Math.floor((gridWidth + 10) / 170)));
  const cardWidth = gridWidth ? (gridWidth - (columns - 1) * 10) / columns : undefined;
  const [confirm, setConfirm] = useState(false);
  const days = buddy ? Math.max(0, Math.floor((now - new Date(buddy.since).getTime()) / 86400000)) : 0;
  const profile = buddy ? <View style={{ gap: 24 }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginTop: 4 }}><Avatar id={buddy.userId} name={buddy.name} url={buddy.avatar} size={wide ? 128 : 84} /><View style={{ flex: 1, minWidth: 0 }}><Text weight={800} size={wide ? 30 : 22} numberOfLines={1}>{buddy.name}</Text><Meta size={14}>@{buddy.handle}</Meta><PersonTraits size={13} profile={buddy.traits} /></View></View>
    {externalTabs ? null : <ProfileTabs value={tab} onChange={setTab} tabs={tabs} />}
    {tab === 'style' ? <View style={{ gap: 12 }}><Heading title={t('friend.namedPreferences', { name: buddy.name })} /><View onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{PERSON_SCALES.map((f, n) => <ScaleInput key={f} index={n} compact compactWidth={cardWidth} field={f} value={buddy.traits[f]} readOnly description={t(`scale.${f}.${buddy.traits[f] ?? 3}.description` as Key)} onChange={() => {}} />)}</View></View> : null}
    {tab === 'interests' ? <View style={{ gap: 12 }}><Heading title={t('friend.namedInterests', { name: buddy.name })} />{buddy.interests.length ? <InterestPicker value={buddy.interests} readOnly selectedOnly /> : <Chip icon={<Icon name="empty-discover" size={28} />} label={t('friend.emptyInterests')} />}</View> : null}
    {tab === 'diet' ? <View style={{ gap: 12 }}><Heading title={t('friend.namedDiet', { name: buddy.name })} /><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{buddy.diet.length ? buddy.diet.map((d, n) => <Reveal key={d} index={n}><Chip icon={dietIcon(d, 28)} label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d} /></Reveal>) : <Chip icon={<Icon name="cat-food" size={28} />} label={t('friend.emptyDiet')} />}</View></View> : null}
    {tab === 'dogs' ? <View style={{ gap: 12 }}><Heading title={t('friend.namedDogs', { name: buddy.name })} />{buddy.dogs.length ? buddy.dogs.map((dog) => <DogProfile key={dog.id} dog={dog} />) : <Meta>{t('friend.noDogs')}</Meta>}</View> : null}
    {tab === 'friend' ? <View style={{ gap: 16 }}><Heading title={t('friend.relationship')} />
      {buddy.status === 'accepted' ? <View style={{ alignItems: 'center', gap: 6 }}>
        <Icon name="tab-members" size={64} />
        <Text weight={800} size={18} style={{ textAlign: 'center' }}>{t('friend.since', { date: new Date(buddy.since).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) })}</Text>
        <Meta weight={700}>{days > 0 ? t('friend.days', { n: days }) : t('friend.daysToday')}</Meta>
      </View> : <Meta style={{ textAlign: 'center' }}>{t('bd.pending')}</Meta>}
      {buddy.status === 'accepted' ? <View style={{ alignItems: 'center', gap: 12 }}>
        {buddy.relation ? <Text weight={800} size={18}>{t('friend.relNow', { rel: t(`rel.${buddy.relation}` as Key) })}</Text> : null}
        {buddy.relationProposed && !buddy.relationProposedByMe ? <View style={{ alignItems: 'center', gap: 8 }}>
          <Text weight={700} style={{ textAlign: 'center' }}>{t('friend.relAsks', { name: buddy.name, rel: t(`rel.${buddy.relationProposed}` as Key) })}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label={t('bd.accept')} small onPress={() => respondRelation.mutate({ other: buddy.userId, accept: true })} />
            <Button label={t('bd.decline')} small variant="ghost" onPress={() => respondRelation.mutate({ other: buddy.userId, accept: false })} />
          </View>
        </View> : null}
        {buddy.relationProposed && buddy.relationProposedByMe ? <View style={{ alignItems: 'center', gap: 4 }}>
          <Meta weight={700} style={{ textAlign: 'center' }}>{t('friend.relProposedMe', { rel: t(`rel.${buddy.relationProposed}` as Key) })}</Meta>
          <Button label={t('friend.relWithdraw')} small variant="text" onPress={() => withdrawRelation.mutate(buddy.userId)} style={{ alignSelf: 'center' }} />
        </View> : null}
        <Text weight={800} size={15}>{t('friend.relPick')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {RELATIONS.map((r) => <Chip key={r} label={t(`rel.${r}` as Key)} on={buddy.relation === r || (buddy.relationProposedByMe && buddy.relationProposed === r)} onPress={() => setRelation.mutate({ other: buddy.userId, relation: buddy.relation === r ? null : r })} />)}
        </View>
      </View> : null}
      {onRemove ? <View style={{ alignItems: 'center', marginTop: 8 }}><Button label={t('bd.removeFriend')} variant="danger" onPress={() => setConfirm(true)} style={{ alignSelf: 'center' }} /></View> : null}
    </View> : null}
    <ConfirmSheet visible={confirm} title={t('friend.removeConfirm')} body={t('friend.removeBody', { name: buddy.name })} confirmLabel={t('bd.removeFriend')} danger onConfirm={() => { setConfirm(false); onRemove?.(buddy); onClose(); }} onClose={() => setConfirm(false)} />
  </View> : null;
  return profile;
}

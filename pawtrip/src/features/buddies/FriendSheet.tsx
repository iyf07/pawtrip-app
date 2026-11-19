import { useState } from 'react';
import { View } from 'react-native';

import { RELATIONS, useRespondBuddyRelation, useSetBuddyRelation, useWithdrawBuddyRelation, type Buddy, type FriendDog } from '@/api/buddies';
import { DogInterests } from '@/components/DogInterests';
import { InterestPicker } from '@/components/InterestPicker';
import { PersonTraits } from '@/components/PersonTraits';
import { DogTraits } from '@/components/DogTraits';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { Avatar, DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { dietIcon } from '@/components/DietIcon';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useSettings } from '@/api/profile';
import { weightIn } from '@/lib/dog-weight';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { DOG_SCALES, dogScales, PERSON_SCALES, DIETS } from '@/constants/options';
import { useT, type Key } from '@/i18n';
import { Reveal } from '@/components/ui/Reveal';
import { BENTO_GAP, BentoCard, Hero } from '@/features/circle/Bento';

function DogCard({ dog, index }: { dog: FriendDog; index: number }) {
  const { t } = useT();
  const unit = useSettings().data?.weight_unit === 'kg' ? 'kg' : 'lb';
  const scales = dogScales(dog);
  const weight = weightIn(dog.weight_lb, unit);
  return (
    <BentoCard index={index} title={dog.name}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <DogAvatar url={dog.photo_url} size={60} />
        <View style={{ flex: 1, minWidth: 0 }}>{weight ? <Meta>{weight}</Meta> : null}<DogTraits dog={dog} /></View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {DOG_SCALES.map((f, n) => <ScaleInput key={f} index={n} compact inset field={f} value={scales[f]} description={t(`scale.${scaleStem(f)}.${scales[f]}.description` as Key)} readOnly onChange={() => {}} />)}
      </View>
      <DogInterests values={dog.interests} />
    </BentoCard>
  );
}

export function FriendSheet({ buddy, onClose, onRemove }: { buddy: Buddy | null; onClose: () => void; onRemove?: (b: Buddy) => void }) {
  const { t, locale } = useT();
  const { wide } = useLayout();
  const th = useTheme();
  const setRelation = useSetBuddyRelation();
  const respondRelation = useRespondBuddyRelation();
  const withdrawRelation = useWithdrawBuddyRelation();
  const [now] = useState(() => Date.now());
  const [confirm, setConfirm] = useState(false);
  if (!buddy) return null;
  const days = Math.max(0, Math.floor((now - new Date(buddy.since).getTime()) / 86400000));
  const dogCount = buddy.dogs.length;
  return (
    <View style={{ gap: BENTO_GAP, marginTop: 8 }}>
      <Hero index={0} minHeight={wide ? 260 : 240} color={th.softBlue} avatar={<Avatar id={buddy.userId} name={buddy.name} url={buddy.avatar} size={92} />} title={buddy.name} subtitle={`@${buddy.handle}`}>
        <PersonTraits size={13} profile={buddy.traits} />
      </Hero>
      {buddy.dogs.map((dog, i) => <DogCard key={dog.id} dog={dog} index={1 + i} />)}
      <BentoCard index={1 + dogCount} title={t('profile.travelStyle')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {PERSON_SCALES.map((f, n) => <ScaleInput key={f} index={n} compact inset field={f} value={buddy.traits[f]} readOnly description={t(`scale.${f}.${buddy.traits[f] ?? 3}.description` as Key)} onChange={() => {}} />)}
        </View>
      </BentoCard>
      <BentoCard index={2 + dogCount} tone="tint" title={t('profile.interests')}>
        {buddy.interests.length ? <InterestPicker value={buddy.interests} readOnly selectedOnly /> : <Chip icon={<Icon name="empty-discover" size={28} />} label={t('friend.emptyInterests')} />}
      </BentoCard>
      <BentoCard index={3 + dogCount} title={t('profile.diet')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{buddy.diet.length ? buddy.diet.map((d, n) => <Reveal key={d} index={n}><Chip icon={dietIcon(d, 28)} label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d} /></Reveal>) : <Chip icon={<Icon name="cat-food" size={28} />} label={t('friend.emptyDiet')} />}</View>
      </BentoCard>
      <BentoCard index={4 + dogCount} tone="gold" title={t('friend.relationship')}>
        {buddy.status === 'accepted' ? <View style={{ alignItems: 'center', gap: 6 }}>
          <Icon name="tab-members" size={56} />
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
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {RELATIONS.map((r) => <Chip key={r} label={t(`rel.${r}` as Key)} on={buddy.relation === r || (buddy.relationProposedByMe && buddy.relationProposed === r)} onPress={() => setRelation.mutate({ other: buddy.userId, relation: buddy.relation === r ? null : r })} />)}
          </View>
        </View> : null}
      </BentoCard>
      {onRemove ? <BentoCard index={5 + dogCount}><Button label={t('bd.removeFriend')} variant="danger" block onPress={() => setConfirm(true)} /></BentoCard> : null}
      <ConfirmSheet visible={confirm} title={t('friend.removeConfirm')} body={t('friend.removeBody', { name: buddy.name })} confirmLabel={t('bd.removeFriend')} danger onConfirm={() => { setConfirm(false); onRemove?.(buddy); onClose(); }} onClose={() => setConfirm(false)} />
    </View>
  );
}

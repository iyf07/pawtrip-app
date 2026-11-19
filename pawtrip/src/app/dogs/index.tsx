import { router } from 'expo-router';
import { View } from 'react-native';

import { DogTraits } from '@/components/DogTraits';
import { dogWeightLabel } from '@/lib/dog-weight';
import { useDeleteDog, useMyDogs } from '@/api/dogs';
import { useFamily } from '@/api/family';
import { useAuth } from '@/auth/AuthProvider';
import { AddAction } from '@/components/ui/AddAction';
import { DogAvatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { BackButton, Header, Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useT } from '@/i18n';
import { Reveal } from '@/components/ui/Reveal';
import { SwipeRow } from '@/components/ui/SwipeRow';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { useState } from 'react';

/** All sizes start with the collection; selecting a dog opens its profile. */
export default function Dogs() {
  const { t } = useT();
  const dogs = useMyDogs();
  const fam = useFamily();
  const { userId } = useAuth();
  const del = useDeleteDog();
  const [askDog, setAskDog] = useState<{ id: string; name: string } | null>(null);
  const ownerName = (id: string) => (id === userId ? null : fam.data?.members.find((m) => m.userId === id)?.name ?? null);

  return (
    <Screen nav top={<Header title={t('profile.myDogs')} left={<BackButton label={t('nav.back')} onPress={() => router.navigate('/circle')} />} right={<AddAction icon="nav-dogs" label={t('profile.addDog')} onPress={() => router.push('/dogs/new')} />} />} size="narrow">
      {dogs.isPending ? (
        <PageSkeleton cards={3} />
      ) : (
        <View style={{ gap: 12, marginTop: 8 }}>
          {dogs.data?.length === 0 ? (
            <EmptyState icon="nav-dogs" title={t('dogs.emptyTitle')} />
          ) : null}
          {(dogs.data ?? []).map((d, i) => (
            <Reveal key={d.id} index={i}><SwipeRow enabled={d.owner_id === userId} onTrigger={() => setAskDog(d)}><Card onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: d.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DogAvatar url={d.photo_url} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text weight={800} numberOfLines={1}>{d.name}</Text>
                {ownerName(d.owner_id) ? <Meta numberOfLines={1}>{t('family.owner', { name: ownerName(d.owner_id)! })}</Meta> : null}
                {dogWeightLabel(d) ? <Meta>{dogWeightLabel(d)}</Meta> : null}
                <DogTraits dog={d} lines={2} />
              </View>
              <Text plain size={22} color="muted" weight={800}>
                ›
              </Text>
            </Card></SwipeRow></Reveal>
          ))}
          <Reveal index={(dogs.data ?? []).length}><Card dashed onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: 'new' } })} style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="nav-dogs" size={28} /><Text weight={800} color="link">{t('profile.addDog')}</Text></View>
          </Card></Reveal>
        </View>
      )}
      <ConfirmSheet visible={askDog !== null} title={t('dog.removeTitle')} body={t('dog.removeBody', { name: askDog?.name ?? '' })} confirmLabel={t('dog.remove')} danger busy={del.isPending}
        onConfirm={() => { const d = askDog; setAskDog(null); if (d) del.mutate(d.id); }} onClose={() => setAskDog(null)} />
    </Screen>
  );
}

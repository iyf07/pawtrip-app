import { Redirect, router } from 'expo-router';
import { View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { useInShell } from '@/components/shell/ShellContext';
import { DogAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useT } from '@/i18n';

/** Phone: all my dogs first; tap one to see and edit its profile. (On desktop the dog list is a column of the shell.) */
export default function Dogs() {
  const { t } = useT();
  const inShell = useInShell();
  const dogs = useMyDogs();

  if (inShell && dogs.data?.length) {
    return <Redirect href={{ pathname: '/dogs/[id]', params: { id: dogs.data[0].id } }} />;
  }

  return (
    <Screen nav top={<Header title={t('profile.myDogs')} />} size="narrow">
      {dogs.isPending ? (
        <PageSkeleton cards={3} />
      ) : (
        <View style={{ gap: 10, marginTop: 8 }}>
          {dogs.data?.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 18 }}>
              <Icon name="nav-dogs" size={88} />
              <Text weight={800} size={20}>{t('dogs.emptyTitle')}</Text>
              <Button style={{ alignSelf: 'center' }} label={t('profile.addDog')} icon="nav-dogs" onPress={() => router.push('/dogs/new')} />
            </View>
          ) : null}
          {(dogs.data ?? []).map((d) => (
            <Card key={d.id} onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: d.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DogAvatar url={d.photo_url} />
              <Text weight={800} style={{ flex: 1 }}>
                {d.name}
              </Text>
              <Text plain size={22} color="muted" weight={800}>
                ›
              </Text>
            </Card>
          ))}
          {dogs.data?.length ? <Card dashed onPress={() => router.push({ pathname: '/dogs/[id]', params: { id: 'new' } })} style={{ alignItems: 'center' }}>
            <Text weight={800} color="link">
              {t('profile.addDog')}
            </Text>
          </Card> : null}
        </View>
      )}
    </Screen>
  );
}

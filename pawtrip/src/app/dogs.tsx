import { Redirect, router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useMyDogs } from '@/api/dogs';
import { useInShell } from '@/components/shell/ShellContext';
import { DogAvatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Header, Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/** Phone: all my dogs first; tap one to see and edit its profile. (On desktop the dog list is a column of the shell.) */
export default function Dogs() {
  const { t } = useT();
  const th = useTheme();
  const inShell = useInShell();
  const dogs = useMyDogs();

  if (inShell) {
    if (dogs.isPending) return null;
    const first = dogs.data?.[0];
    return <Redirect href={{ pathname: '/dog/[id]', params: { id: first?.id ?? 'new' } }} />;
  }

  return (
    <Screen nav top={<Header title={t('profile.myDogs')} />} size="narrow">
      {dogs.isPending ? (
        <View style={{ alignItems: 'center', paddingTop: 60 }}>
          <ActivityIndicator color={th.muted} />
        </View>
      ) : (
        <View style={{ gap: 10, marginTop: 8 }}>
          {(dogs.data ?? []).map((d) => (
            <Card key={d.id} onPress={() => router.push({ pathname: '/dog/[id]', params: { id: d.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <DogAvatar url={d.photo_url} />
              <Text weight={800} style={{ flex: 1 }}>
                {d.name}
              </Text>
              <Text plain size={22} color="muted" weight={800}>
                ›
              </Text>
            </Card>
          ))}
          <Card dashed onPress={() => router.push({ pathname: '/dog/[id]', params: { id: 'new' } })} style={{ alignItems: 'center' }}>
            <Text weight={800} color="link">
              {t('profile.addDog')}
            </Text>
          </Card>
        </View>
      )}
    </Screen>
  );
}

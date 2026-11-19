import { router } from 'expo-router';

import { BackButton, Header, Screen } from '@/components/ui/Screen';
import { useT } from '@/i18n';

import { FamilyPanel } from './FamilyPanel';

/** /family: my family (members, dogs, invitations). Reached from the circle. */
export function FamilyScreen() {
  const { t } = useT();
  return (
    <Screen nav size="narrow" top={<Header title={t('family.title')} left={<BackButton label={t('nav.back')} onPress={() => router.navigate('/circle')} />} />}>
      <FamilyPanel />
    </Screen>
  );
}

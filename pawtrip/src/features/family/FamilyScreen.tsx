import { router } from 'expo-router';

import { BackButton, Header, Screen } from '@/components/ui/Screen';
import { useT } from '@/i18n';

import { FamilyPanel } from './FamilyPanel';
import { useTheme } from '@/hooks/use-theme';

/** /family: my family (members, dogs, invitations). Reached from the circle. */
export function FamilyScreen() {
  const { t } = useT();
  const th = useTheme();
  return (
    <Screen nav size="narrow" topTint={th.goldBg} top={<Header title={t('family.title')} left={<BackButton label={t('nav.back')} onPress={() => router.navigate('/circle')} />} />}>
      <FamilyPanel />
    </Screen>
  );
}

import { View } from 'react-native';

import { usePeopleTabs } from '@/components/PeopleTabs';
import { Header, Screen } from '@/components/ui/Screen';
import { useT } from '@/i18n';

import { FamilyPanel } from './FamilyPanel';

/** /family: my family (members, dogs, invitations). Reached from the friends/family navigation button. */
export function FamilyScreen() {
  const { t } = useT();
  const tabs = usePeopleTabs('family');
  return (
    <Screen nav size="narrow" bottom={tabs.bottom} top={<Header title={t('family.title')} />}>
      {tabs.top ? <View style={{ marginTop: 4 }}>{tabs.top}</View> : null}
      <FamilyPanel />
    </Screen>
  );
}

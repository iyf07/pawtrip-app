import { View } from 'react-native';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

/** The empty state every collection page uses (trips, dogs, friends, family): same icon size, spacing and title size. */
export function EmptyState({ icon, title }: { icon: IconName; title: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, gap: 18 }}>
      <Icon name={icon} size={88} />
      <Text weight={800} size={20}>{title}</Text>
    </View>
  );
}

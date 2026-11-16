import type { Buddy } from '@/api/buddies';
import { PersonTraits } from '@/components/PersonTraits';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';

import { FriendDetails } from './FriendDetails';

export function FriendChoice({ buddy, selected, onPress }: { buddy: Buddy; selected: boolean; onPress: () => void }) {
  return (
    <Card style={{ width: '100%' }}>
      <Chip icon={<Avatar id={buddy.userId} name={buddy.name} url={buddy.avatar} size={28} />} label={buddy.name} on={selected} onPress={onPress} />
      <Text size={12} color="muted" style={{ marginTop: 6 }}>@{buddy.handle}</Text>
      <PersonTraits profile={buddy.traits} />
      <FriendDetails buddy={buddy} />
    </Card>
  );
}

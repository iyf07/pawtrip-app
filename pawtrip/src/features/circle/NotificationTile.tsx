import { View } from 'react-native';

import { NotificationBell } from '@/components/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

import { Tile } from './Bento';

/** A 1×1 butter card: how many notifications are waiting and the newest one; tap opens the full list. */
export function NotificationTile({ index, width, height }: { index: number; width: number; height: number }) {
  const { t } = useT();
  const th = useTheme();
  return (
    <NotificationBell size={28} box={28} radius={14} renderTrigger={({ count, open, items }) => (
      <Tile index={index} width={width} height={height} tone="peach" onPress={open} accessibilityLabel={t('notif.title')}>
        <View style={{ flex: 1, padding: 18, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 30 }}>
            <Text weight={800} size={12} numberOfLines={1} style={{ flex: 1, color: th.onTint, letterSpacing: 1.4, textTransform: 'uppercase' }}>{t('notif.short')}</Text>
            {count > 0 ? <View style={{ minWidth: 24, height: 24, borderRadius: 12, paddingHorizontal: 7, backgroundColor: th.danger, alignItems: 'center', justifyContent: 'center' }}><Text plain weight={800} size={13} style={{ color: '#FFFFFF', lineHeight: 16 }}>{count}</Text></View> : null}
          </View>
          {items.length === 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Icon name="nav-notifications" size={48} /></View> : (
            <View style={{ flex: 1, justifyContent: 'center', gap: 6 }}>
              <Avatar id={items[0].id} name={items[0].name} url={items[0].avatar} size={28} border={0} />
              <Text weight={700} size={13} numberOfLines={2} style={{ color: th.onTint }}>{items[0].text}</Text>
            </View>
          )}
        </View>
      </Tile>
    )} />
  );
}

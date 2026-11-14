import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { Icon } from '@/components/ui/Icon';
import { usePhotoUpload } from '@/components/PhotoField';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

type Props = {
  name: string;
  url: string | null;
  size?: number;
  onChange: (url: string | null) => void | Promise<void>;
};

/** Avatar with a small pencil badge at its bottom-right corner; tapping it opens change / remove. */
export function AvatarEditor({ name, url, size = 84, onChange }: Props) {
  const { t } = useT();
  const th = useTheme();
  const { userId } = useAuth();
  const [menu, setMenu] = useState(false);
  const { choose, busy, error, cropper } = usePhotoUpload('avatar', onChange);

  return (
    <View>
      <Pressable onPress={() => setMenu(true)} accessibilityRole="button" accessibilityLabel={t('pf.avatar.edit')}>
        <Avatar id={userId ?? 'me'} name={name} url={url} size={size} />
        <View
          style={{
            position: 'absolute',
            right: -4,
            bottom: -4,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: th.card,
            borderWidth: 2,
            borderColor: th.line,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 6px -1px ${th.shadow}`,
          }}>
          {busy ? <ActivityIndicator size="small" color={th.link} /> : <Icon name="ui-camera" size={22} />}
        </View>
      </Pressable>

      <Sheet visible={menu} onClose={() => setMenu(false)}>
        <Text weight={800} size={20}>
          {t('pf.avatar.edit')}
        </Text>
        <View style={{ marginTop: 14, gap: 8 }}>
          <Button
            label={t('pf.avatar.change')}
            block
            onPress={() => {
              setMenu(false);
              choose();
            }}
          />
          {url ? (
            <Button
              label={t('pf.avatar.remove')}
              variant="danger"
              block
              onPress={() => {
                setMenu(false);
                onChange(null);
              }}
            />
          ) : null}
          <Button label={t('common.cancel')} variant="text" block onPress={() => setMenu(false)} />
        </View>
      </Sheet>
      {error ? <Meta color="danger" style={{ marginTop: 4, maxWidth: size + 40 }}>{error}</Meta> : null}
      {cropper}
    </View>
  );
}

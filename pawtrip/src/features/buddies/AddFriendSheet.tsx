import { useState } from 'react';
import { View } from 'react-native';

import { useFindBuddy, useRequestBuddy, type FoundBuddy } from '@/api/buddies';
import { FriendDetails } from './FriendDetails';
import { isCode } from '@/api/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Meta, Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

/** "Add a friend": enter their ID, see who it is, then confirm. */
export function AddFriendSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const find = useFindBuddy();
  const request = useRequestBuddy();
  const [handle, setHandle] = useState('');
  const [found, setFound] = useState<FoundBuddy | null>(null);

  function close() {
    setHandle('');
    setFound(null);
    onClose();
  }

  async function lookup() {
    if (!handle.trim()) return;
    try {
      const res = await find.mutateAsync(handle);
      if (!res) return void toast(t('bd.unknown'));
      setFound(res);
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function confirmAdd() {
    if (!found) return;
    try {
      await request.mutateAsync(found.handle);
      toast(found.relation === 'pending_in' ? t('bd.joined', { name: found.display_name }) : t('bd.asked'));
      close();
    } catch (e) {
      toast(isCode(e, 'self') ? t('bd.self') : t('common.saveFailed'));
    }
  }

  return (
    <Sheet visible={visible} onClose={close}>
      <Text weight={800} size={20}>
        {t('bd.addTitle')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Field
            containerStyle={{ marginTop: 0 }}
            value={handle}
            onChangeText={(v) => {
              setHandle(v.toLowerCase());
              setFound(null);
            }}
            placeholder={t('bd.idPh')}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            onSubmitEditing={lookup}
            returnKeyType="search"
          />
        </View>
        <Button label={t('bd.find')} style={{ alignSelf: 'center', minHeight: 46 }} small onPress={lookup} loading={find.isPending} disabled={!handle.trim()} />
      </View>
      {found ? (
        <View style={{ marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: th.goldBg, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar id={found.id} name={found.display_name} url={found.avatar_url} size={52} />
            <View style={{ flex: 1 }}>
              <Text weight={800} size={17} numberOfLines={1}>
                {found.display_name}
              </Text>
              <Meta numberOfLines={1}>@{found.handle}</Meta>
            </View>
          </View>
          <FriendDetails buddy={{ interests: found.interests, dogs: found.dogs, status: 'accepted' }} />
          {found.relation === 'none' || found.relation === 'pending_in' ? (
            <Button label={found.relation === 'pending_in' ? t('bd.accept') : t('bd.confirmAdd')} block loading={request.isPending} onPress={confirmAdd} />
          ) : (
            <Meta weight={700}>{found.relation === 'self' ? t('bd.isSelf') : found.relation === 'accepted' ? t('bd.isFriend') : t('bd.sentAlready')}</Meta>
          )}
        </View>
      ) : null}
    </Sheet>
  );
}

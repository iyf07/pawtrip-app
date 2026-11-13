import { useState } from 'react';
import { View } from 'react-native';

import { useUpdateProfile } from '@/api/profile';
import type { Profile } from '@/api/types';
import { HandleField } from '@/components/HandleField';
import { Field } from '@/components/ui/Field';
import { SaveBar } from '@/components/ui/SaveBar';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';

/** Edit your name and ID in a popup (opened by the pencil next to your name). */
export function ProfileEditSheet({ profile, onClose }: { profile: Profile | null; onClose: () => void }) {
  if (!profile) return <Sheet visible={false} onClose={onClose}>{null}</Sheet>;
  // mounted per open so the fields start from the saved values
  return <Form key={profile.id + profile.handle + profile.display_name} profile={profile} onClose={onClose} />;
}

function Form({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const { t } = useT();
  const toast = useToast();
  const update = useUpdateProfile();
  const [name, setName] = useState(profile.display_name);
  const [handle, setHandle] = useState(profile.handle);
  const [handleOk, setHandleOk] = useState(true);

  const handleChanged = handle !== profile.handle;
  const dirty = name.trim() !== profile.display_name || handleChanged;
  const canSave = name.trim().length > 0 && (!handleChanged || handleOk);

  async function save() {
    try {
      await update.mutateAsync({ display_name: name.trim(), ...(handleChanged ? { handle } : {}) });
      toast(t('toast.saved'));
      onClose();
    } catch (e) {
      const code = (e as { code?: string })?.code;
      toast(code === '23505' ? t('pf.handle.taken') : t('common.saveFailed')); // someone took it a moment ago
    }
  }

  return (
    <Sheet
      visible
      onClose={onClose}
      footer={dirty ? <SaveBar saving={update.isPending} canSave={canSave} onSave={save} onDiscard={() => { setName(profile.display_name); setHandle(profile.handle); setHandleOk(true); }} /> : null}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text weight={800} size={22}>
          {t('pf.editTitle')}
        </Text>
        <Text weight={800} size={22} color="muted" onPress={onClose} accessibilityRole="button" accessibilityLabel={t('common.cancel')} style={{ paddingHorizontal: 8 }}>
          ✕
        </Text>
      </View>
      <Field label={t('pf.name')} value={name} onChangeText={setName} maxLength={60} />
      <View style={{ marginTop: 4 }}>
        <HandleField label={t('pf.handle')} value={handle} onChangeText={setHandle} onValid={setHandleOk} current={profile.handle} />
      </View>
    </Sheet>
  );
}

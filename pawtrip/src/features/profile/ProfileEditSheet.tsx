import { useState } from 'react';
import { View } from 'react-native';

import { useUpdateProfile } from '@/api/profile';
import type { Profile } from '@/api/types';
import { AvatarEditor } from '@/components/AvatarEditor';
import { dietIcon } from '@/components/DietIcon';
import { HandleField } from '@/components/HandleField';
import { InterestPicker } from '@/components/InterestPicker';
import { ScaleInput } from '@/components/ScaleInput';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { addDietaryNeed, DIETS, PERSON_SCALES, normalizeInterests, personScales, type PersonScale } from '@/constants/options';
import { useT, type Key } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';

const label = (text: string) => <Text weight={800} size={12} color="muted" style={{ letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 20, marginBottom: 6 }}>{text}</Text>;

/** One place to edit the whole profile: name, ID, travel style, interests, diet. One Save, tap outside to cancel. */
export function ProfileEditSheet({ visible, onClose, profile }: { visible: boolean; onClose: () => void; profile: Profile }) {
  return (
    <Sheet visible={visible} tall onClose={onClose}>
      <Form profile={profile} onClose={onClose} />
    </Sheet>
  );
}

// mounted fresh each time the sheet opens, so the drafts always start from the saved profile
function Form({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const { t } = useT();
  const toast = useToast();
  const update = useUpdateProfile();
  const [name, setName] = useState(profile.display_name);
  const [handle, setHandle] = useState(profile.handle);
  const [handleOk, setHandleOk] = useState(true);
  const [scales, setScales] = useState<Record<PersonScale, number | null>>(() => personScales(profile));
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [diet, setDiet] = useState<string[]>(profile.diet);
  const [customDiet, setCustomDiet] = useState('');
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const handleChanged = handle !== profile.handle;
  const canSave = name.trim().length > 0 && (!handleChanged || handleOk);

  function customDietCode() {
    const text = customDiet.trim();
    return DIETS.find((d) => t(`diet.${d}` as Key).toLocaleLowerCase() === text.toLocaleLowerCase()) ?? text;
  }
  function addCustomDiet() {
    setDiet((cur) => addDietaryNeed(cur, customDietCode()));
    setCustomDiet('');
  }
  async function changeAvatar(url: string | null) {
    const old = profile.avatar_url;
    try {
      await update.mutateAsync({ avatar_url: url });
      await deletePhotoByUrl(old);
    } catch {
      toast(t('common.saveFailed'));
    }
  }
  async function save() {
    try {
      await update.mutateAsync({ display_name: name.trim(), ...(handleChanged ? { handle } : {}), ...scales, interests: normalizeInterests(interests), diet: addDietaryNeed(diet, customDietCode()) });
      toast(t('toast.saved'));
      onClose();
    } catch (e) {
      const code = (e as { code?: string })?.code;
      toast(code === '23505' ? t('pf.handle.taken') : t('common.saveFailed'));
    }
  }

  return (
    <View>
      <Text weight={800} size={22} style={{ textAlign: 'center' }}>{t('pf.edit')}</Text>
      <View style={{ alignItems: 'center', marginTop: 14 }}><AvatarEditor name={profile.display_name} url={profile.avatar_url} size={96} onChange={changeAvatar} /></View>
      <Field label={t('pf.name')} value={name} onChangeText={setName} maxLength={60} />
      <HandleField label={t('pf.handle')} value={handle} onChangeText={setHandle} onValid={setHandleOk} current={profile.handle} />
      {label(t('profile.travelStyle'))}
      {PERSON_SCALES.map((f) => (
        <ScaleInput key={f} field={f} iconSize={28} value={scales[f]} description={scales[f] == null ? undefined : t(`scale.${f}.${scales[f]}.description` as Key)} onChange={(v) => setScales((s) => ({ ...s, [f]: v }))} />
      ))}
      {label(t('profile.interests'))}
      <InterestPicker value={interests} onToggle={(i) => setInterests((c) => toggle(c, i))} />
      {label(t('profile.diet'))}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {[...DIETS, ...diet.filter((d) => !(DIETS as readonly string[]).includes(d))].map((d) => (
          <Chip key={d} icon={dietIcon(d)} label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d} on={diet.includes(d)} onPress={() => setDiet((c) => toggle(c, d))} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 10 }}>
        <View style={{ flex: 1 }}><Field accessibilityLabel={t('pf.customDiet')} placeholder={t('pf.customDiet')} value={customDiet} onChangeText={setCustomDiet} maxLength={40} returnKeyType="done" onSubmitEditing={addCustomDiet} containerStyle={{ marginTop: 0 }} /></View>
        <Button label={t('pf.addDiet')} onPress={addCustomDiet} disabled={!customDiet.trim()} />
      </View>
      <Button label={t('nav.save')} block disabled={!canSave} loading={update.isPending} onPress={save} style={{ marginTop: 22 }} />
    </View>
  );
}

import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { DOG_SCALES, useDeleteDog, useSaveDog, type DogScale } from '@/api/dogs';
import type { Dog } from '@/api/types';
import { DogInterests } from '@/components/DogInterests';
import { normalizeDogInterests } from '@/constants/dog-interests';
import { DogTraits } from '@/components/DogTraits';
import { AvatarEditor } from '@/components/AvatarEditor';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { Button } from '@/components/ui/Button';
import { DogAvatar } from '@/components/ui/Avatar';
import { Segmented } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Field } from '@/components/ui/Field';
import { InlineFieldRow } from '@/components/ui/InlineFieldRow';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';
import { dogScales } from '@/constants/options';
import { RingButton } from '@/components/ui/RingButton';

const LB_PER_KG = 2.20462;
const round1 = (x: number) => Math.round(x * 10) / 10;

/** Everything needed to edit a dog; the caller chooses the frame (a page or a popup). */
export function DogForm({ dog, onClose, children }: { dog: Dog; onClose: () => void; children: (parts: { body: ReactNode; footer: ReactNode }) => ReactNode }) {
  const id = dog.id;
  const { t } = useT();
  const toast = useToast();
  const save = useSaveDog();
  const th = useTheme();
  const { wide } = useLayout();
  const del = useDeleteDog();
  const { userId } = useAuth();

  const [photo, setPhoto] = useState<string | null>(dog.photo_url ?? null);
  const [name, setName] = useState(dog.name ?? '');
  const [unit, setUnit] = useState<'lb' | 'kg'>((dog.weight_unit as 'lb' | 'kg') ?? 'lb');
  const [weight, setWeight] = useState(
    dog.weight_lb != null ? String(dog.weight_unit === 'kg' ? round1(Number(dog.weight_lb) / LB_PER_KG) : Number(dog.weight_lb)) : '',
  );
  const [scales, setScales] = useState<Record<DogScale, number | null>>(() => dogScales(dog));
  const [interests, setInterests] = useState<string[]>(() => normalizeDogInterests(dog.interests));
  const [errs, setErrs] = useState<{ name?: string; weight?: string }>({});
  const [askDelete, setAskDelete] = useState(false);
  // read-only until the pencil is tapped
  const [editing, setEditing] = useState<'identity' | 'preferences' | 'interests' | null>(null);

  // what the form started with, to know whether there is anything to save
  const [init, setInit] = useState(() => ({ name, photo, unit, weight, scales, interests }));
  function discard() {
    const i = init;
    setName(i.name);
    setPhoto(i.photo);
    setUnit(i.unit);
    setWeight(i.weight);
    setScales(i.scales);
    setInterests(i.interests);
    setErrs({});
    setEditing(null);
  }

  async function submit() {
    if (!editing) return;
    const section = editing;
    const w = Number(weight);
    if (section === 'identity') {
      const e: typeof errs = {};
      if (!name.trim()) e.name = t('dog.errName');
      if (!weight.trim() || !Number.isFinite(w) || w <= 0) e.weight = t('dog.errWeight');
      setErrs(e);
      if (e.name || e.weight) return;
    }
    try {
      await save.mutateAsync({ id, ...(section === 'identity' ? {
        name: name.trim(), photo_url: photo, weight_unit: unit,
        weight_lb: round1(unit === 'kg' ? w * LB_PER_KG : w),
      } : section === 'interests' ? { interests } : scales) });
      if (section === 'identity' && init.photo && init.photo !== photo) await deletePhotoByUrl(init.photo);
      setInit((current) => section === 'identity'
        ? { ...current, name: name.trim(), photo, unit, weight }
        : section === 'interests' ? { ...current, interests } : { ...current, scales });
      toast(t('toast.saved'));
      setEditing(null);
    } catch { toast(t('common.saveFailed')); }
  }

  function editActions(section: 'identity' | 'preferences' | 'interests', title: string) {
    const active = editing === section;
    const actionStyle = { width: 40, height: 40, borderRadius: 20, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center' as const, justifyContent: 'center' as const };
    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {active ? <>
          <RingButton kind="save" label={t('pf.saveSection', { section: title })} loading={save.isPending} onPress={submit} />
          <RingButton kind="discard" label={t('pf.discardSection', { section: title })} disabled={save.isPending} onPress={discard} />
        </> : <Pressable accessibilityRole="button" accessibilityLabel={t('pf.editSection', { section: title })}
          disabled={save.isPending} onPress={() => { if (editing) toast(t('pf.finishSection')); else setEditing(section); }} accessibilityState={{ disabled: !!editing }} style={[actionStyle, { opacity: editing ? 0.45 : 1 }]}>
          <Icon name="ui-pencil" size={24} />
        </Pressable>}
      </View>
    );
  }

  async function remove() {
    try {
      await del.mutateAsync(id);
      setAskDelete(false);
      onClose();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  const identity = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginTop: 4 }}>
      {editing === 'identity' ? <AvatarEditor kind="dog" name={name} url={photo} size={wide ? 128 : 84} onChange={setPhoto} /> : <DogAvatar url={photo} size={wide ? 128 : 84} />}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text weight={800} size={wide ? 30 : 22} numberOfLines={1} style={{ flex: 1 }}>{name}</Text>
          {editActions('identity', t('dog.basic'))}
        </View>
        {editing === 'identity' ? (
          <>
            <InlineFieldRow label={t('dog.shortName')}><Field accessibilityLabel={t('dog.name')} containerStyle={{ marginTop: 0 }} value={name} onChangeText={setName} placeholder={t('dog.namePh')} error={errs.name} maxLength={40} /></InlineFieldRow>
            <InlineFieldRow index={1} label={t('dog.shortWeight')}>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <View style={{ flex: 1, minWidth: 0 }}><Field containerStyle={{ marginTop: 0 }} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="0" error={errs.weight} /></View>
                <View style={{ paddingTop: 2 }}><Segmented value={unit} onChange={setUnit} options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]} /></View>
              </View>
            </InlineFieldRow>
            {!dog.owner_id || dog.owner_id === userId ? <Button label={t('dog.remove')} variant="danger" onPress={() => setAskDelete(true)} style={{ marginTop: 12 }} /> : null}
          </>
        ) : <Text weight={700} size={wide ? 17 : 15} color="muted" numberOfLines={1}>{weight ? `${weight} ${unit}` : '—'}</Text>}
        {editing ? null : <DogTraits dog={init.scales} />}
      </View>
    </View>
  );

  const body = (
    <>
      {identity}

      <View style={{ flexDirection: wide ? 'row' : 'column', gap: wide ? 32 : 0, alignItems: 'flex-start' }}>
      <View style={{ marginTop: 28, flex: wide ? 1 : undefined, width: wide ? undefined : '100%', minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Text weight={800} size={20} style={{ flexShrink: 1 }}>{t('dog.preferences', { name: init.name })}</Text>
          <View style={{ flex: 1, borderTopWidth: 2, borderStyle: 'dashed', borderColor: th.line }} />
          {editActions('preferences', t('dog.preferences', { name: init.name }))}
        </View>
        <View style={{ gap: 10 }}>
          {Array.from({ length: Math.ceil(DOG_SCALES.length / 2) }, (_, row) => (
            <View key={row} style={{ flexDirection: 'row', gap: 10, alignItems: 'stretch' }}>
              {DOG_SCALES.slice(row * 2, row * 2 + 2).map((f, k) => (
                <ScaleInput key={f} index={row * 2 + k} compact iconSize={28} field={f} value={scales[f]}
                  description={t(`scale.${scaleStem(f)}.${scales[f]}.description` as Key)} readOnly={editing !== 'preferences'}
                  onChange={(v) => setScales((current) => ({ ...current, [f]: v }))} />
              ))}
              {DOG_SCALES.slice(row * 2, row * 2 + 2).length === 1 ? <View style={{ width: '48%', flexGrow: 1 }} /> : null}
            </View>
          ))}
        </View>
      </View>
      <View style={{ marginTop: 28, flex: wide ? 1 : undefined, width: wide ? undefined : '100%', minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Text weight={800} size={20} style={{ flexShrink: 1 }}>{t('dog.interests', { name: init.name })}</Text>
          <View style={{ flex: 1, borderTopWidth: 2, borderStyle: 'dashed', borderColor: th.line }} />
          {editActions('interests', t('dog.interests', { name: init.name }))}
        </View>
        <DogInterests values={interests} onChange={editing === 'interests' ? setInterests : undefined} />
      </View>
      </View>

      <ConfirmSheet
        visible={askDelete}
        title={t('dog.removeTitle')}
        body={t('dog.removeBody', { name })}
        confirmLabel={t('dog.remove')}
        danger
        busy={del.isPending}
        onConfirm={remove}
        onClose={() => setAskDelete(false)}
      />
    </>
  );
  const footer = null;
  return <>{children({ body, footer })}</>;
}

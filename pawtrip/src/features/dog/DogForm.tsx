import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { DOG_SCALES, useDeleteDog, useSaveDog, type DogScale } from '@/api/dogs';
import type { Dog } from '@/api/types';
import { DogTraits } from '@/components/DogTraits';
import { AvatarEditor } from '@/components/AvatarEditor';
import { ScaleInput, scaleStem } from '@/components/ScaleInput';
import { Button } from '@/components/ui/Button';
import { DogAvatar } from '@/components/ui/Avatar';
import { Segmented } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Field } from '@/components/ui/Field';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';
import { dogScales } from '@/constants/options';

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

  const [photo, setPhoto] = useState<string | null>(dog.photo_url ?? null);
  const [name, setName] = useState(dog.name ?? '');
  const [unit, setUnit] = useState<'lb' | 'kg'>((dog.weight_unit as 'lb' | 'kg') ?? 'lb');
  const [weight, setWeight] = useState(
    dog.weight_lb != null ? String(dog.weight_unit === 'kg' ? round1(Number(dog.weight_lb) / LB_PER_KG) : Number(dog.weight_lb)) : '',
  );
  const [scales, setScales] = useState<Record<DogScale, number | null>>(() => dogScales(dog));
  const [errs, setErrs] = useState<{ name?: string; weight?: string }>({});
  const [askDelete, setAskDelete] = useState(false);
  // read-only until the pencil is tapped
  const [editing, setEditing] = useState<'identity' | 'preferences' | null>(null);

  // what the form started with, to know whether there is anything to save
  const [init, setInit] = useState(() => ({ name, photo, unit, weight, scales }));
  function discard() {
    const i = init;
    setName(i.name);
    setPhoto(i.photo);
    setUnit(i.unit);
    setWeight(i.weight);
    setScales(i.scales);
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
      } : scales) });
      if (section === 'identity' && init.photo && init.photo !== photo) await deletePhotoByUrl(init.photo);
      setInit((current) => section === 'identity'
        ? { ...current, name: name.trim(), photo, unit, weight }
        : { ...current, scales });
      toast(t('toast.saved'));
      setEditing(null);
    } catch { toast(t('common.saveFailed')); }
  }

  function editActions(section: 'identity' | 'preferences', title: string) {
    const active = editing === section;
    const actionStyle = { width: 40, height: 40, borderRadius: 20, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center' as const, justifyContent: 'center' as const };
    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {active ? <>
          <Pressable accessibilityRole="button" accessibilityLabel={t('pf.saveSection', { section: title })} disabled={save.isPending} onPress={submit} style={actionStyle}>
            {save.isPending ? <ActivityIndicator color={th.muted} /> : <Icon name="ui-save" size={28} />}
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('pf.discardSection', { section: title })} disabled={save.isPending} onPress={discard} style={actionStyle}>
            <Icon name="ui-discard" size={28} />
          </Pressable>
        </> : <Pressable accessibilityRole="button" accessibilityLabel={t('pf.editSection', { section: title })}
          disabled={editing !== null || save.isPending} onPress={() => setEditing(section)} style={[actionStyle, { opacity: editing ? 0.45 : 1 }]}>
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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 }}>
      {editing === 'identity' ? <AvatarEditor kind="dog" name={name} url={photo} size={wide ? 128 : 84} onChange={setPhoto} /> : <DogAvatar url={photo} size={wide ? 128 : 84} />}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text weight={800} size={wide ? 30 : 22} numberOfLines={1} style={{ flex: 1 }}>{name}</Text>
          {editActions('identity', t('dog.basic'))}
        </View>
        {editing === 'identity' ? (
          <>
            <Field label={t('dog.name')} value={name} onChangeText={setName} placeholder={t('dog.namePh')} error={errs.name} maxLength={40} />
            <Text weight={800} size={13} style={{ marginTop: 10, marginBottom: 6 }}>{t('dog.weight')}</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <View style={{ flex: 1, marginTop: -14 }}><Field value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="0" error={errs.weight} /></View>
              <Segmented value={unit} onChange={setUnit} options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]} />
            </View>
          </>
        ) : <Text weight={700} size={wide ? 17 : 15} color="muted" numberOfLines={1}>{weight ? `${weight} ${unit}` : '—'}</Text>}
        <DogTraits dog={editing === 'preferences' ? scales : init.scales} />
      </View>
    </View>
  );

  const body = (
    <>
      {identity}

      <View style={{ marginTop: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Text weight={800} size={20}>{t('dog.preferences')}</Text>
          <View style={{ flex: 1, borderTopWidth: 2, borderStyle: 'dashed', borderColor: th.line }} />
          {editActions('preferences', t('dog.preferences'))}
        </View>
        <View style={{ gap: 10 }}>
          {Array.from({ length: Math.ceil(DOG_SCALES.length / 2) }, (_, row) => (
            <View key={row} style={{ flexDirection: 'row', gap: 10, alignItems: 'stretch' }}>
              {DOG_SCALES.slice(row * 2, row * 2 + 2).map((f) => (
                <ScaleInput key={f} compact iconSize={wide ? 44 : 56} field={f} value={scales[f]}
                  description={t(`scale.${scaleStem(f)}.${scales[f]}.description` as Key)} readOnly={editing !== 'preferences'}
                  onChange={(v) => setScales((current) => ({ ...current, [f]: v }))} />
              ))}
              {DOG_SCALES.slice(row * 2, row * 2 + 2).length === 1 ? <View style={{ width: '48%', flexGrow: 1 }} /> : null}
            </View>
          ))}
        </View>
      </View>
      {editing === 'identity' ? <Button label={t('dog.remove')} variant="danger" block onPress={() => setAskDelete(true)} style={{ marginTop: 24 }} /> : null}

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

import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { DOG_SCALES, useDeleteDog, useSaveDog, type DogScale } from '@/api/dogs';
import type { Dog } from '@/api/types';
import { AvatarEditor } from '@/components/AvatarEditor';
import { ScaleInput } from '@/components/ScaleInput';
import { Button } from '@/components/ui/Button';
import { DogAvatar } from '@/components/ui/Avatar';
import { Chip, Segmented } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Field } from '@/components/ui/Field';
import { SaveBar } from '@/components/ui/SaveBar';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';

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
  const [scales, setScales] = useState<Record<DogScale, number | null>>({
    energy: dog.energy ?? 3,
    temp: dog.temp ?? 3,
    with_dogs: dog.with_dogs ?? 3,
    with_people: dog.with_people ?? 3,
    alone: dog.alone ?? 3,
    car: dog.car ?? 3,
  });
  const [recall, setRecall] = useState<'runner' | 'comes' | null>((dog.recall as 'runner' | 'comes' | null) ?? null);
  const [errs, setErrs] = useState<{ name?: string; weight?: string }>({});
  const [askDelete, setAskDelete] = useState(false);
  // read-only until the pencil is tapped
  const [editing, setEditing] = useState(false);

  // what the form started with, to know whether there is anything to save
  const [init] = useState(() => ({ name, photo, unit, weight, scales, recall }));
  function discard() {
    const i = init;
    setName(i.name);
    setPhoto(i.photo);
    setUnit(i.unit);
    setWeight(i.weight);
    setScales(i.scales);
    setRecall(i.recall);
    setErrs({});
    setEditing(false);
  }

  async function submit() {
    const e: typeof errs = {};
    if (!name.trim()) e.name = t('dog.errName');
    const w = Number(weight);
    if (!weight.trim() || !Number.isFinite(w) || w <= 0) e.weight = t('dog.errWeight');
    setErrs(e);
    if (e.name || e.weight) return;
    try {
      await save.mutateAsync({
        id,
        name: name.trim(),
        photo_url: photo,
        weight_unit: unit,
        weight_lb: round1(unit === 'kg' ? w * LB_PER_KG : w),
        ...scales,
        recall,
      });
      if (dog.photo_url && dog.photo_url !== photo) await deletePhotoByUrl(dog.photo_url);
      toast(t('toast.saved'));
      setEditing(false);
    } catch {
      toast(t('common.saveFailed'));
    }
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
      {editing ? <AvatarEditor kind="dog" name={name} url={photo} size={wide ? 128 : 84} onChange={setPhoto} /> : <DogAvatar url={photo} size={wide ? 128 : 84} />}
      <View style={{ flex: 1 }}>
        {editing ? (
          <>
            <Field label={t('dog.name')} value={name} onChangeText={setName} placeholder={t('dog.namePh')} error={errs.name} maxLength={40} />
            <Text weight={800} size={13} style={{ marginTop: 10, marginBottom: 6 }}>
              {t('dog.weight')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <View style={{ flex: 1, marginTop: -14 }}>
                <Field value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="0" error={errs.weight} />
              </View>
              <Segmented
                value={unit}
                onChange={setUnit}
                options={[
                  { value: 'lb', label: 'lb' },
                  { value: 'kg', label: 'kg' },
                ]}
              />
            </View>
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text weight={800} size={wide ? 30 : 22} numberOfLines={1} style={{ flexShrink: 1 }}>
                {name}
              </Text>
              <Pressable
                onPress={() => setEditing(true)}
                accessibilityRole="button"
                accessibilityLabel={t('dog.edit')}
                hitSlop={8}
                style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ui-pencil" size={20} />
              </Pressable>
            </View>
            <Text weight={700} size={wide ? 17 : 15} color="muted" numberOfLines={1}>
              {weight ? `${weight} ${unit}` : '—'}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  const body = (
    <>
      {identity}

      <View style={{ height: 18 }} />
      {DOG_SCALES.map((f) => (
        <ScaleInput key={f} field={f} value={scales[f]} readOnly={!editing} onChange={(v) => setScales((s) => ({ ...s, [f]: v }))} />
      ))}

      <Text weight={800} size={13} style={{ marginTop: 18 }}>
        {t('recall.q')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        {(['runner', 'comes'] as const).map((r) => (
          <View key={r} style={{ flex: 1 }}>
            <Chip
              icon={<Icon name={r === 'runner' ? 'trait-runner' : 'trait-recall'} size={30} />}
              label={t(`recall.${r}`)}
              on={recall === r}
              onPress={editing ? () => setRecall(recall === r ? null : r) : undefined}
              style={{ minHeight: 52, borderRadius: 16, opacity: !editing && recall !== r ? 0.45 : 1 }}
            />
          </View>
        ))}
      </View>

      {editing ? <Button label={t('dog.remove')} variant="danger" block onPress={() => setAskDelete(true)} style={{ marginTop: 24 }} /> : null}

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
  const footer = editing ? <SaveBar saving={save.isPending} onSave={submit} onDiscard={discard} /> : null;
  return <>{children({ body, footer })}</>;
}

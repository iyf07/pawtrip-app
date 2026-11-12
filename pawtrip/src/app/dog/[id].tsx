import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { DOG_SCALES, useDeleteDog, useDog, useSaveDog, type DogScale } from '@/api/dogs';
import type { Dog } from '@/api/types';
import { PhotoField } from '@/components/PhotoField';
import { ScaleInput } from '@/components/ScaleInput';
import { Button } from '@/components/ui/Button';
import { Chip, Segmented } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Header, Screen } from '@/components/ui/Screen';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT } from '@/i18n';
import { deletePhotoByUrl } from '@/lib/photos';

const LB_PER_KG = 2.20462;
const round1 = (x: number) => Math.round(x * 10) / 10;

export default function DogEditorRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const dog = useDog(id);
  // Mount the form only once the dog is loaded, so its fields start from the saved values.
  if (!isNew && !dog.data) return <Screen scroll={false}>{null}</Screen>;
  return <DogForm key={dog.data?.id ?? 'new'} id={id} dog={dog.data ?? null} />;
}

function DogForm({ id, dog }: { id: string; dog: Dog | null }) {
  const { t } = useT();
  const toast = useToast();
  const isNew = id === 'new';
  const save = useSaveDog();
  const del = useDeleteDog();

  const [photo, setPhoto] = useState<string | null>(dog?.photo_url ?? null);
  const [name, setName] = useState(dog?.name ?? '');
  const [unit, setUnit] = useState<'lb' | 'kg'>((dog?.weight_unit as 'lb' | 'kg') ?? 'lb');
  const [weight, setWeight] = useState(
    dog?.weight_lb != null ? String(dog.weight_unit === 'kg' ? round1(Number(dog.weight_lb) / LB_PER_KG) : Number(dog.weight_lb)) : '',
  );
  const [scales, setScales] = useState<Record<DogScale, number | null>>({
    energy: dog?.energy ?? null,
    temp: dog?.temp ?? null,
    with_dogs: dog?.with_dogs ?? null,
    with_people: dog?.with_people ?? null,
    alone: dog?.alone ?? null,
    car: dog?.car ?? null,
  });
  const [recall, setRecall] = useState<'runner' | 'comes' | null>((dog?.recall as 'runner' | 'comes' | null) ?? null);
  const [errs, setErrs] = useState<{ name?: string; weight?: string }>({});
  const [askDelete, setAskDelete] = useState(false);

  async function submit() {
    const e: typeof errs = {};
    if (!name.trim()) e.name = t('dog.errName');
    const w = Number(weight);
    if (!weight.trim() || !Number.isFinite(w) || w <= 0) e.weight = t('dog.errWeight');
    setErrs(e);
    if (e.name || e.weight) return;
    try {
      await save.mutateAsync({
        id: isNew ? undefined : id,
        name: name.trim(),
        photo_url: photo,
        weight_unit: unit,
        weight_lb: round1(unit === 'kg' ? w * LB_PER_KG : w),
        ...scales,
        recall,
      });
      if (dog?.photo_url && dog.photo_url !== photo) await deletePhotoByUrl(dog.photo_url);
      toast(t('toast.saved'));
      router.back();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  async function remove() {
    try {
      await del.mutateAsync(id);
      setAskDelete(false);
      router.back();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return (
    <Screen
      top={
        <Header
          title={t(isNew ? 'dog.add' : 'dog.edit')}
          left={<Button label={t('nav.cancel')} variant="text" onPress={() => router.back()} />}
        />
      }>
      <View style={{ marginTop: 4 }}>
        <PhotoField kind="dog" url={photo} onChange={setPhoto} />
      </View>
      <Field label={t('dog.name')} value={name} onChangeText={setName} placeholder={t('dog.namePh')} error={errs.name} maxLength={40} />

      <Text weight={800} size={13} style={{ marginTop: 14, marginBottom: 6 }}>
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

      <Text size={13} color="muted" style={{ marginTop: 18 }}>
        {t('dog.scaleHint')}
      </Text>
      {DOG_SCALES.map((f) => (
        <ScaleInput key={f} field={f} value={scales[f]} onChange={(v) => setScales((s) => ({ ...s, [f]: v }))} />
      ))}

      <Text weight={800} size={13} style={{ marginTop: 18 }}>
        {t('recall.q')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        {(['runner', 'comes'] as const).map((r) => (
          <View key={r} style={{ flex: 1 }}>
            <Chip label={t(`recall.${r}`)} on={recall === r} onPress={() => setRecall(recall === r ? null : r)} style={{ minHeight: 52, borderRadius: 16 }} />
          </View>
        ))}
      </View>

      <Text size={13} color="muted" style={{ marginTop: 20 }}>
        {t('dog.req')}
      </Text>
      <Button label={t('nav.save')} block loading={save.isPending} onPress={submit} style={{ marginTop: 16 }} />
      {!isNew ? <Button label={t('dog.remove')} variant="danger" block onPress={() => setAskDelete(true)} style={{ marginTop: 12 }} /> : null}

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
    </Screen>
  );
}

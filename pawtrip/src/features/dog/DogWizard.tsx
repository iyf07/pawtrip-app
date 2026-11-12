import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { DOG_SCALES, useSaveDog, type DogScale } from '@/api/dogs';
import { useSettings } from '@/api/profile';
import { PhotoField } from '@/components/PhotoField';
import { ScaleInput } from '@/components/ScaleInput';
import { Wizard, type WizardStep } from '@/components/Wizard';
import { Chip, Segmented } from '@/components/ui/Chip';
import { DogAvatar } from '@/components/ui/Avatar';
import { Field } from '@/components/ui/Field';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { useT, type Key } from '@/i18n';

const LB_PER_KG = 2.20462;
const round1 = (x: number) => Math.round(x * 10) / 10;

/** New dog profile, one question at a time. Editing an existing dog stays a single page. */
export function DogWizard() {
  const { t } = useT();
  const toast = useToast();
  const save = useSaveDog();
  const settings = useSettings();

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [unitPick, setUnitPick] = useState<'lb' | 'kg' | null>(null);
  const unit = unitPick ?? (settings.data?.weight_unit === 'kg' ? 'kg' : 'lb');
  const [scales, setScales] = useState<Record<DogScale, number | null>>({ energy: null, temp: null, with_dogs: null, with_people: null, alone: null, car: null });
  const [recall, setRecall] = useState<'runner' | 'comes' | null>(null);

  const w = Number(weight);
  const weightOk = weight.trim() !== '' && Number.isFinite(w) && w > 0;

  const steps: WizardStep[] = [
    {
      key: 'name',
      title: t('dw.name.q'),
      hint: t('dw.name.hint'),
      canContinue: name.trim().length > 0,
      content: ({ next }) => (
        <Field value={name} onChangeText={setName} maxLength={40} placeholder={t('dog.namePh')} autoFocus returnKeyType="next" onSubmitEditing={() => name.trim() && next()} style={{ fontSize: 22 }} />
      ),
    },
    {
      key: 'photo',
      title: t('dw.photo.q'),
      hint: t('dw.photo.hint'),
      optional: true,
      content: <PhotoField kind="dog" url={photo} onChange={setPhoto} />,
    },
    {
      key: 'weight',
      title: t('dw.weight.q'),
      hint: t('dw.weight.hint'),
      canContinue: weightOk,
      content: ({ next }) => (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={{ flex: 1, marginTop: -14 }}>
            <Field value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="0" autoFocus returnKeyType="next" onSubmitEditing={() => weightOk && next()} style={{ fontSize: 22 }} />
          </View>
          <Segmented
            value={unit}
            onChange={setUnitPick}
            options={[
              { value: 'lb', label: 'lb' },
              { value: 'kg', label: 'kg' },
            ]}
          />
        </View>
      ),
    },
    ...DOG_SCALES.map(
      (f): WizardStep => ({
        key: f,
        title: t(`scale.${f === 'with_dogs' ? 'withDogs' : f === 'with_people' ? 'withPeople' : f}` as Key),
        hint: t('dog.scaleHint'),
        optional: true,
        content: <ScaleInput field={f} hideTitle value={scales[f]} onChange={(v) => setScales((s) => ({ ...s, [f]: v }))} />,
      }),
    ),
    {
      key: 'recall',
      title: t('recall.q'),
      optional: true,
      content: (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {(['runner', 'comes'] as const).map((r) => (
            <View key={r} style={{ flex: 1 }}>
              <Chip label={t(`recall.${r}`)} on={recall === r} onPress={() => setRecall(recall === r ? null : r)} style={{ minHeight: 56, borderRadius: 16 }} />
            </View>
          ))}
        </View>
      ),
    },
    {
      key: 'done',
      title: t('dw.done.title', { name: name.trim() }),
      hint: t('dw.done.body'),
      content: (
        <View style={{ alignItems: 'center', gap: 10, marginTop: 8 }}>
          <DogAvatar url={photo} size={120} />
          <Text weight={800} size={22}>
            {name.trim()}
          </Text>
        </View>
      ),
    },
  ];

  async function finish() {
    try {
      await save.mutateAsync({
        name: name.trim(),
        photo_url: photo,
        weight_unit: unit,
        weight_lb: round1(unit === 'kg' ? w * LB_PER_KG : w),
        ...scales,
        recall,
      });
      toast(t('toast.saved'));
      router.back();
    } catch {
      toast(t('common.saveFailed'));
    }
  }

  return <Wizard steps={steps} onFinish={finish} finishLabel={t('dw.save')} onClose={() => router.back()} />;
}

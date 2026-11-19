import { View } from 'react-native';

import { DOG_INTERESTS, normalizeDogInterests } from '@/constants/dog-interests';
import { DIETS, normalizeInterests } from '@/constants/options';
import { dietIcon } from '@/components/DietIcon';
import { DogInterests } from '@/components/DogInterests';
import { ExpandBlock, IconGrid, type IconItem } from '@/components/ExpandCard';
import { InterestIcon } from '@/components/InterestIcon';
import { InterestPicker } from '@/components/InterestPicker';
import { ScaleInput, scaleIconName, scaleStem } from '@/components/ScaleInput';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { useT, type Key } from '@/i18n';

const BIG = 52; // icon size while folded
const FULL = 40; // icon size in the opened view

/** The 1-5 scales of a person or a dog: six big icons until tapped, then every scale with its answer and description. */
export function ScaleBlock({ fields, values, describe }: { fields: readonly string[]; values: Record<string, number | null | undefined>; describe?: (f: string, v: number) => string }) {
  const { t } = useT();
  const icons: IconItem[] = fields.flatMap((f) => {
    const name = scaleIconName(f, values[f] ?? null);
    return name ? [{ key: f, node: <Icon name={name} size={BIG} />, label: `${t(`scale.${scaleStem(f)}` as Key)}: ${t(`scale.${scaleStem(f)}.${values[f] ?? 3}` as Key)}` }] : [];
  });
  return (
    <ExpandBlock icons={icons}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {fields.map((f) => (
          <ScaleInput key={f} compact inset readOnly iconSize={FULL} field={f} value={values[f] ?? null} description={describe?.(f, values[f] ?? 3)} onChange={() => {}} />
        ))}
      </View>
    </ExpandBlock>
  );
}

/** Chosen interests: icons until tapped, then the labelled sections. */
export function InterestsBlock({ value, empty }: { value: string[]; empty: string }) {
  const { t } = useT();
  const icons: IconItem[] = normalizeInterests(value).flatMap((i) => (InterestIcon({ interest: i }) ? [{ key: i, node: <InterestIcon interest={i} size={BIG} />, label: t(`interest.${i}` as Key) }] : []));
  return (
    <ExpandBlock icons={icons} empty={<IconGrid items={[{ key: 'none', node: <Icon name="empty-discover" size={BIG} />, label: empty }]} />}>
      <InterestPicker value={value} readOnly selectedOnly />
    </ExpandBlock>
  );
}

/** Dietary needs: icons until tapped (a custom need has no icon, so it stays a labelled chip), then the labelled list. */
export function DietBlock({ value, empty }: { value: string[]; empty: string }) {
  const { t } = useT();
  const label = (d: string) => ((DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d);
  const icons: IconItem[] = value.flatMap((d) => { const n = dietIcon(d, BIG); return n ? [{ key: d, node: n, label: label(d) }] : []; });
  const custom = value.filter((d) => !dietIcon(d));
  return (
    <ExpandBlock icons={[...icons, ...custom.map((d) => ({ key: d, node: <Icon name="cat-food" size={BIG} />, label: d }))]} empty={<IconGrid items={[{ key: 'none', node: <Icon name="cat-food" size={BIG} />, label: empty }]} />}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {value.map((d) => <Chip key={d} icon={dietIcon(d, FULL)} label={label(d)} on />)}
      </View>
    </ExpandBlock>
  );
}

/** A dog's interests: icons until tapped, then the labelled chips. */
export function DogInterestsBlock({ values }: { values?: readonly string[] | null }) {
  const { t } = useT();
  const picked = normalizeDogInterests(values);
  const icons: IconItem[] = DOG_INTERESTS.filter((i) => picked.includes(i.value)).map((i) => ({ key: i.value, node: <Icon name={i.icon} size={BIG} />, label: t(`dogInterest.${i.value}` as Key) }));
  return (
    <ExpandBlock icons={icons} empty={<DogInterests values={values} />}>
      <DogInterests values={values} />
    </ExpandBlock>
  );
}

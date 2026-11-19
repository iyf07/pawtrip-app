import { View } from 'react-native';

import { DOG_INTERESTS, normalizeDogInterests } from '@/constants/dog-interests';
import { DIETS, normalizeInterests, selectedInterestSections } from '@/constants/options';
import { dietIcon } from '@/components/DietIcon';
import { ExpandBlock, IconGrid, type IconItem } from '@/components/ExpandCard';
import { InterestIcon } from '@/components/InterestIcon';
import { scaleIconName, scaleStem } from '@/components/ScaleInput';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';

const BIG = 52; // icon size while folded
const ROW = 44; // icon size in an opened row

/** One opened row: a big icon, the name in small caps, the answer, then (muted) the description. */
function Row({ icon, title, answer, note }: { icon: React.ReactNode; title?: string; answer: string; note?: string }) {
  const th = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
        {title ? <Text weight={800} size={11} color="muted" numberOfLines={1} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>{title}</Text> : null}
        <Text weight={800} size={17}>{answer}</Text>
        {note ? <Text size={13} color="muted">{note}</Text> : null}
      </View>
    </View>
  );
}

/** The 1-5 scales of a person or a dog: big icons until tapped, then one row per scale with its answer and description. */
export function ScaleBlock({ id, fields, values, describe }: { id: string; fields: readonly string[]; values: Record<string, number | null | undefined>; describe?: (f: string, v: number) => string }) {
  const { t } = useT();
  const withIcon = fields.filter((f) => scaleIconName(f, values[f] ?? null));
  const icons: IconItem[] = withIcon.map((f) => ({ key: f, node: <Icon name={scaleIconName(f, values[f] ?? null)!} size={BIG} />, label: `${t(`scale.${scaleStem(f)}` as Key)}: ${t(`scale.${scaleStem(f)}.${values[f] ?? 3}` as Key)}` }));
  const rows = withIcon.map((f) => {
    const v = values[f] ?? 3;
    return <Row key={f} icon={<Icon name={scaleIconName(f, v)!} size={ROW} />} title={t(`scale.${scaleStem(f)}` as Key)} answer={describe?.(f, v) ?? t(`scale.${scaleStem(f)}.${v}` as Key)} note={t(`scale.${scaleStem(f)}.${v}` as Key)} />;
  });
  return <ExpandBlock id={id} icons={icons} rows={rows} />;
}

/** Chosen interests: icons until tapped, then a labelled row per group. */
export function InterestsBlock({ id, value, empty }: { id: string; value: string[]; empty: string }) {
  const { t } = useT();
  const picked = normalizeInterests(value);
  const icons: IconItem[] = picked.flatMap((i) => (InterestIcon({ interest: i }) ? [{ key: i, node: <InterestIcon interest={i} size={BIG} />, label: t(`interest.${i}` as Key) }] : []));
  const rows = selectedInterestSections(value).map((s) => (
    <View key={s.key} style={{ gap: 8 }}>
      <Text size={12} weight={800} color="muted" style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(`interest.group.${s.key}` as Key)}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {s.items.map((i) => <Chip key={i} icon={<InterestIcon interest={i} size={32} />} label={t(`interest.${i}` as Key)} on />)}
      </View>
    </View>
  ));
  return <ExpandBlock id={id} icons={icons} rows={rows} max={3} empty={<IconGrid items={[{ key: 'none', node: <Icon name="empty-interest" size={BIG} />, label: empty }]} />} />;
}

/** Dietary needs: icons until tapped (a custom need has no icon of its own), then one row each. */
export function DietBlock({ id, value, empty }: { id: string; value: string[]; empty: string }) {
  const { t } = useT();
  const label = (d: string) => ((DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d);
  const node = (d: string, size: number) => dietIcon(d, size) ?? <Icon name="cat-food" size={size} />;
  const icons: IconItem[] = value.map((d) => ({ key: d, node: node(d, BIG), label: label(d) }));
  const rows = value.map((d) => <Row key={d} icon={node(d, ROW)} answer={label(d)} />);
  return <ExpandBlock id={id} icons={icons} rows={rows} max={3} empty={<IconGrid items={[{ key: 'none', node: <Icon name="empty-diet" size={BIG} />, label: empty }]} />} />;
}

/** A dog's interests: icons until tapped, then the labelled chips. */
export function DogInterestsBlock({ id, values }: { id: string; values?: readonly string[] | null }) {
  const { t } = useT();
  const picked = normalizeDogInterests(values);
  const list = DOG_INTERESTS.filter((i) => picked.includes(i.value));
  const icons: IconItem[] = list.map((i) => ({ key: i.value, node: <Icon name={i.icon} size={BIG} />, label: t(`dogInterest.${i.value}` as Key) }));
  const rows = [<View key="all" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{list.map((i) => <Chip key={i.value} icon={<Icon name={i.icon} size={32} />} label={t(`dogInterest.${i.value}` as Key)} on />)}</View>];
  return <ExpandBlock id={id} icons={icons} rows={rows} max={3} empty={<IconGrid items={[{ key: 'none', node: <Icon name="empty-interest" size={BIG} />, label: t('dog.emptyInterests') }]} />} />;
}

import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT, type Key } from '@/i18n';

/** DB column name -> i18n key stem (the prototype used camelCase). */
const STEM: Record<string, string> = { with_dogs: 'withDogs', with_people: 'withPeople' };
export const scaleStem = (col: string) => STEM[col] ?? col;

type Props = {
  /** DB column / profile field, e.g. 'energy', 'with_dogs', 'walking' */
  field: string;
  value: number | null;
  onChange: (v: number) => void;
  /** the surrounding screen already shows the question (wizard) */
  hideTitle?: boolean;
};

/** One 1-5 personality scale: question, five steps, and the label of the chosen step. Starts in the middle (3). */
export function ScaleInput({ field, value, onChange, hideTitle }: Props) {
  const { t } = useT();
  const th = useTheme();
  const stem = scaleStem(field);
  const v = value ?? 3;
  return (
    <View
      style={{
        marginTop: 14,
        padding: 14,
        backgroundColor: th.card,
        borderWidth: 2,
        borderColor: th.line,
        borderRadius: 18,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        {hideTitle ? <View style={{ flex: 1 }} /> : (
          <Text weight={800} size={14} style={{ flex: 1 }}>
            {t(`scale.${stem}` as Key)}
          </Text>
        )}
        <Text weight={800} size={14} color="link">
          {t(`scale.${stem}.${v}` as Key)}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= v;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              accessibilityRole="button"
              accessibilityLabel={`${t(`scale.${stem}` as Key)} ${n}`}
              accessibilityState={{ selected: v === n }}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 17,
                backgroundColor: on ? th.gold : th.line,
                borderWidth: v === n ? 4 : 0,
                borderColor: th.sticker,
                boxShadow: v === n ? `0 2px 6px -1px ${th.shadow}` : undefined,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

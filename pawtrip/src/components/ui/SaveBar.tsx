import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

import { Button } from './Button';

type Props = {
  saving?: boolean;
  /** false greys out Save (e.g. a field is invalid) */
  canSave?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  /** the bar sits above a bottom tab bar, so skip the safe-area padding */
  aboveTabs?: boolean;
};

/**
 * The one save bar for every editable page: pinned to the bottom, shown only while there are unsaved changes.
 * Pass it to `Screen`'s `bottom` prop (or render it last inside a tab's flex column).
 */
export function SaveBar({ saving, canSave = true, onSave, onDiscard, aboveTabs }: Props) {
  const { t } = useT();
  const th = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 + (aboveTabs ? 0 : insets.bottom), backgroundColor: th.card, borderTopWidth: 2, borderStyle: 'dashed', borderColor: th.line, gap: 4 }}>
      <Button label={t('pf.save')} block loading={saving} disabled={!canSave} onPress={onSave} />
      <Button label={t('pf.discard')} variant="text" block disabled={saving} onPress={onDiscard} />
    </View>
  );
}

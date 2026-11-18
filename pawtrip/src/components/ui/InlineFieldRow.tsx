import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Reveal } from './Reveal';
import { Text } from './Text';

/** Short labelled input aligned on one line, with space below for validation. */
/** The row slides in (like list items) when edit mode shows it; `index` staggers rows that appear together. */
export function InlineFieldRow({ label, children, index = 0 }: { label: string; children: ReactNode; index?: number }) {
  return <Reveal index={index} style={{ marginTop: 10 }}><View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
    <Text size={13} weight={800} style={{ width: 64, paddingTop: 14 }} numberOfLines={1}>{label}</Text>
    <View style={{ flex: 1, minWidth: 0, maxWidth: 280 }}>{children}</View>
  </View></Reveal>;
}

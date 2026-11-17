import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from './Text';

/** Short labelled input aligned on one line, with space below for validation. */
export function InlineFieldRow({ label, children }: { label: string; children: ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 10 }}>
    <Text size={13} weight={800} style={{ width: 64, paddingTop: 14 }} numberOfLines={1}>{label}</Text>
    <View style={{ flex: 1, minWidth: 0, maxWidth: 240 }}>{children}</View>
  </View>;
}

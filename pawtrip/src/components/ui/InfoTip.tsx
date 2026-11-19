import { useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';

/**
 * The way to give extra information without permanent secondary text: a small "i" button; the tip shows on hover
 * (web), focus or tap and hides itself. The tip text is also the accessible name, so screen readers read it.
 */
export function InfoTip({ tip, align = 'right' }: { tip: string; align?: 'left' | 'right' }) {
  const th = useTheme();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(id);
  }, [open]);
  const hover = Platform.OS === 'web' ? ({ onHoverIn: () => setOpen(true), onHoverOut: () => setOpen(false) } as object) : {};
  return (
    <View style={{ zIndex: open ? 20 : 0 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={tip} onPress={() => setOpen((v) => !v)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} hitSlop={8} {...hover}
        style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: th.muted, alignItems: 'center', justifyContent: 'center' }}>
        <Text plain weight={800} size={13} color="muted" style={{ lineHeight: 15 }}>i</Text>
      </Pressable>
      {open ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: 28, [align]: 0, width: 220, padding: 10, borderRadius: 14, backgroundColor: th.toastBg, boxShadow: '0 8px 20px -8px rgba(0,0,0,0.4)' }}>
          <Text size={13} weight={700} style={{ color: th.toastText }}>{tip}</Text>
        </View>
      ) : null}
    </View>
  );
}

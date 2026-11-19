import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, TextInput, View, type StyleProp, type ViewStyle, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Text, fontStyle } from './Text';

type Props = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  hint?: string;
  error?: string | null;
  /** red border without a message (the caller shows its own) */
  invalid?: boolean;
};

/** Labelled text input with an inline error line. */
export function Field({ containerStyle, label, hint, error, invalid, style, onFocus, onBlur, ...rest }: Props) {
  const t = useTheme();
  const [focus, setFocus] = useState(false);
  const [shake] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(error ? 1 : 0));
  const bad = !!error || !!invalid;
  // on an error: shake left-right 3 times (14 px, decaying) in 420 ms, and fade the message in
  useEffect(() => {
    if (!bad) {
      fade.setValue(0);
      return;
    }
    const native = Platform.OS !== 'web';
    const step = (to: number) => Animated.timing(shake, { toValue: to, duration: 60, easing: Easing.linear, useNativeDriver: native });
    Animated.sequence([14, -11.5, 9, -6.5, 4, -2, 0].map(step)).start();
    Animated.timing(fade, { toValue: 1, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
  }, [bad, error, shake, fade]);
  return (
    <View style={[{ marginTop: 14 }, containerStyle]}>
      {label ? (
        <Text weight={800} size={13} style={{ marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
      <TextInput
        placeholderTextColor={t.muted}
        {...rest}
        onFocus={(e) => {
          setFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        style={[
          {
            minHeight: 46,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: error || invalid ? t.danger : focus ? t.blue : t.line,
            backgroundColor: t.card,
            color: t.text,
            fontSize: 16,
            ...fontStyle(600),
            outlineStyle: 'none',
          } as object,
          style,
        ]}
      />
      </Animated.View>
      {error ? (
        <Animated.View style={{ opacity: fade }}>
          <Text size={14} weight={700} color="danger" style={{ marginTop: 6 }}>
            {error}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

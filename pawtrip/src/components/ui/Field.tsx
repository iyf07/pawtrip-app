import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

type Props = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string | null;
  /** red border without a message (the caller shows its own) */
  invalid?: boolean;
};

/** Labelled text input with an inline error line. */
export function Field({ label, hint, error, invalid, style, onFocus, onBlur, ...rest }: Props) {
  const t = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginTop: 14 }}>
      {label ? (
        <Text weight={800} size={13} style={{ marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
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
            fontFamily: 'Nunito_600SemiBold',
            outlineStyle: 'none',
          } as object,
          style,
        ]}
      />
      {error ? (
        <Text size={14} weight={700} color="danger" style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

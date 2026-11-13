import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Field } from '@/components/ui/Field';
import { Meta, Text } from '@/components/ui/Text';
import { useT } from '@/i18n';
import { HANDLE_RE, cleanHandle, handleAvailable } from '@/lib/handle';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  /** reports whether the current value can be saved (valid and free) */
  onValid: (ok: boolean) => void;
  /** the saved handle: it is always "available" to its owner */
  current?: string;
  label?: string;
  hint?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
};

type State = 'idle' | 'checking' | 'ok' | 'taken' | 'bad';

/** Unique-ID input with live availability. Characters that are not allowed are dropped as you type. */
export function HandleField({ value, onChangeText, onValid, current, label, hint, autoFocus, onSubmit }: Props) {
  const { t } = useT();
  const [checked, setChecked] = useState<{ value: string; state: Exclude<State, 'idle' | 'checking'> } | null>(null);

  const shape = value.length === 0 ? 'idle' : HANDLE_RE.test(value) ? 'valid' : 'bad';

  useEffect(() => {
    if (shape !== 'valid') {
      onValid(false);
      return;
    }
    if (current && value === current) {
      onValid(true);
      return;
    }
    onValid(false);
    let alive = true;
    const id = setTimeout(() => {
      handleAvailable(value)
        .then((free) => {
          if (!alive) return;
          setChecked({ value, state: free ? 'ok' : 'taken' });
          onValid(free);
        })
        .catch(() => {});
    }, 350);
    return () => {
      alive = false;
      clearTimeout(id);
    };
    // onValid is a state setter from the parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, shape, current]);

  const state: State =
    shape === 'idle' ? 'idle' : shape === 'bad' ? 'bad' : current && value === current ? 'idle' : checked?.value === value ? checked.state : 'checking'; // unchanged: say nothing, no lookup

  const line = {
    idle: null,
    checking: <Meta>{t('pf.handle.checking')}</Meta>,
    ok: (
      <Text size={13} weight={700} color="ok">
        ✓ {t('pf.handle.ok')}
      </Text>
    ),
    taken: (
      <Text size={13} weight={700} color="danger">
        {t('pf.handle.taken')}
      </Text>
    ),
    bad: (
      <Text size={13} weight={700} color="danger">
        {t('pf.handle.bad')}
      </Text>
    ),
  }[state];

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <Field
          label={label}
          value={value}
          onChangeText={(v) => onChangeText(cleanHandle(v))}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
          autoFocus={autoFocus}
          returnKeyType="next"
          onSubmitEditing={onSubmit}
          invalid={state === 'taken' || state === 'bad'}
          style={{ paddingLeft: 28, fontSize: 18 }}
        />
        <Text weight={800} color="muted" style={{ position: 'absolute', left: 12, bottom: 11, fontSize: 18 }}>
          @
        </Text>
      </View>
      <View style={{ marginTop: 6, minHeight: 20 }}>{line}</View>
      {hint ? <Meta style={{ marginTop: 4 }}>{hint}</Meta> : null}
    </View>
  );
}

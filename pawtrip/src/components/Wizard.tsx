import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Meta, Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';

export type WizardControls = { next: () => void };

export type WizardStep = {
  key: string;
  /** the question */
  title: string;
  hint?: string;
  /** optional steps get a "skip" action */
  optional?: boolean;
  /** disables "continue" while false (required answers) */
  canContinue?: boolean;
  /** runs before moving on (e.g. save this answer); a throw keeps the user on the step */
  onNext?: () => Promise<void> | void;
  content: ReactNode | ((c: WizardControls) => ReactNode);
};

type Props = {
  steps: WizardStep[];
  /** after the last step's "continue" */
  onFinish: () => Promise<void> | void;
  /** shown on the first step; leaves the wizard */
  onClose?: () => void;
  finishLabel?: string;
};

/** One question at a time: progress bar, back, skip, and a pinned continue button. Answers live in the parent. */
export function Wizard({ steps, onFinish, onClose, finishLabel }: Props) {
  const { t } = useT();
  const th = useTheme();
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const step = steps[i];
  const last = i === steps.length - 1;

  async function next() {
    if (busy) return;
    setBusy(true);
    try {
      await step.onNext?.();
      if (last) await onFinish();
      else setI(i + 1);
    } catch {
      /* the step's own handler already told the user */
    } finally {
      setBusy(false);
    }
  }

  async function skip() {
    if (last) return;
    setI(i + 1);
  }

  const top = (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
        {i > 0 ? (
          <Button label={`‹ ${t('wiz.back')}`} variant="text" onPress={() => setI(i - 1)} />
        ) : onClose ? (
          <Button label="✕" variant="text" onPress={onClose} />
        ) : (
          <View />
        )}
        {step.optional && !last ? <Button label={t('wiz.skip')} variant="text" onPress={skip} /> : <View />}
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }} accessibilityLabel={`${i + 1}/${steps.length}`}>
        {steps.map((s, k) => (
          <View key={s.key} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: k <= i ? th.gold : th.line }} />
        ))}
      </View>
    </View>
  );

  return (
    <Screen scroll={false} top={top}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Animated.View key={step.key} entering={FadeInRight.duration(220)}>
          <Text weight={800} size={28} style={{ marginTop: 28, lineHeight: 36 }}>
            {step.title}
          </Text>
          {step.hint ? <Meta style={{ marginTop: 8, fontSize: 15 }}>{step.hint}</Meta> : null}
          <View style={{ marginTop: 20 }}>{typeof step.content === 'function' ? step.content({ next }) : step.content}</View>
        </Animated.View>
      </ScrollView>
      <View style={{ paddingTop: 8, paddingBottom: 16 }}>
        <Button
          label={last ? (finishLabel ?? t('wiz.finish')) : t('wiz.next')}
          block
          loading={busy}
          disabled={step.canContinue === false}
          onPress={next}
        />
      </View>
    </Screen>
  );
}

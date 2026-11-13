import { View } from 'react-native';

import { useDog } from '@/api/dogs';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useT } from '@/i18n';

import { DogForm } from './DogForm';

/** Edit one of your dogs in a popup (centred dialog on tablet/desktop, tall sheet on a phone). */
export function DogEditSheet({ dogId, onClose }: { dogId: string | null; onClose: () => void }) {
  const { t } = useT();
  const dog = useDog(dogId ?? undefined);
  const ready = !!dogId && !!dog.data;
  if (!ready) return <Sheet visible={false} onClose={onClose}>{null}</Sheet>;
  return (
    // mounted per dog so the fields start from the saved values
    <DogForm key={dog.data!.id} dog={dog.data!} onClose={onClose}>
      {({ body, footer }) => (
        <Sheet visible tall onClose={onClose} footer={footer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text weight={800} size={22}>
              {t('dog.edit')}
            </Text>
            <Text weight={800} size={22} color="muted" onPress={onClose} accessibilityRole="button" accessibilityLabel={t('common.cancel')} style={{ paddingHorizontal: 8 }}>
              ✕
            </Text>
          </View>
          {body}
        </Sheet>
      )}
    </DogForm>
  );
}

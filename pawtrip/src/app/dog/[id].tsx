import { useLocalSearchParams } from 'expo-router';

import { useDog } from '@/api/dogs';
import { DogForm } from '@/features/dog/DogForm';
import { DogWizard } from '@/features/dog/DogWizard';
import { BackButton, Header, Screen } from '@/components/ui/Screen';
import { useT } from '@/i18n';
import { goBack } from '@/lib/nav';

export default function DogEditorRoute() {
  const { t } = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dog = useDog(id);
  // A new dog is created through the one-question-at-a-time wizard; an existing dog is edited in a popup
  // (this page only serves direct links).
  if (id === 'new') return <DogWizard />;
  // Mount the form only once the dog is loaded, so its fields start from the saved values.
  if (!dog.data) return <Screen scroll={false}>{null}</Screen>;
  return (
    <DogForm key={dog.data.id} dog={dog.data} onClose={goBack}>
      {({ body, footer }) => (
        <Screen nav bottom={footer} top={<Header title={t('dog.edit')} left={<BackButton label={t('nav.cancel')} onPress={goBack} />} />}>
          {body}
        </Screen>
      )}
    </DogForm>
  );
}

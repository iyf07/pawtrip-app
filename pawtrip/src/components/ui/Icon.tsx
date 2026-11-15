import { Asset } from 'expo-asset';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

/** The custom sticker icon set (assets/icons). Names match the file names. */
const SOURCES = {
  'logo-paw': require('../../../assets/icons/logo-paw.png'),
  'nav-trips': require('../../../assets/icons/nav-trips.png'),
  'nav-dogs': require('../../../assets/icons/nav-dogs.png'),
  'nav-settings': require('../../../assets/icons/nav-settings.png'),
  'nav-profile': require('../../../assets/icons/nav-profile.png'),
  'tab-plan': require('../../../assets/icons/tab-plan.png'),
  'tab-ideas': require('../../../assets/icons/tab-ideas.png'),
  'tab-members': require('../../../assets/icons/tab-members.png'),
  'cat-outdoors': require('../../../assets/icons/cat-outdoors.png'),
  'cat-coffee': require('../../../assets/icons/cat-coffee.png'),
  'cat-shopping': require('../../../assets/icons/cat-shopping.png'),
  'cat-drinks': require('../../../assets/icons/cat-drinks.png'),
  'cat-fun': require('../../../assets/icons/cat-fun.png'),
  'cat-stay': require('../../../assets/icons/cat-stay.png'),
  'cat-transit': require('../../../assets/icons/cat-transit.png'),
  'ui-camera': require('../../../assets/icons/ui-camera.png'),
  'ui-pencil': require('../../../assets/icons/ui-pencil.png'),
  'ui-trash': require('../../../assets/icons/ui-trash.png'),
  'ui-archive': require('../../../assets/icons/ui-archive.png'),
  'ui-copy': require('../../../assets/icons/ui-copy.png'),
  'ui-share': require('../../../assets/icons/ui-share.png'),
  'ui-invite': require('../../../assets/icons/ui-invite.png'),
  'ui-key': require('../../../assets/icons/ui-key.png'),
  'ui-zoom': require('../../../assets/icons/ui-zoom.png'),
  'cat-food': require('../../../assets/icons/cat-food.png'),
  'cat-sights': require('../../../assets/icons/cat-sights.png'),
  'int-beaches': require('../../../assets/icons/int-beaches.png'),
  'int-camping': require('../../../assets/icons/int-camping.png'),
  'int-wildlife': require('../../../assets/icons/int-wildlife.png'),
  'int-museums': require('../../../assets/icons/int-museums.png'),
  'int-viewpoints': require('../../../assets/icons/int-viewpoints.png'),
  'int-breweries': require('../../../assets/icons/int-breweries.png'),
  'int-hiking': require('../../../assets/icons/int-hiking.png'),
  'wx-sun': require('../../../assets/icons/wx-sun.png'),
  'wx-partly': require('../../../assets/icons/wx-partly.png'),
  'wx-cloud': require('../../../assets/icons/wx-cloud.png'),
  'wx-rain': require('../../../assets/icons/wx-rain.png'),
  'wx-storm': require('../../../assets/icons/wx-storm.png'),
  'wx-snow': require('../../../assets/icons/wx-snow.png'),
  'wx-fog': require('../../../assets/icons/wx-fog.png'),
  'wx-sunrise': require('../../../assets/icons/wx-sunrise.png'),
  'wx-sunset': require('../../../assets/icons/wx-sunset.png'),
  'pin-stop': require('../../../assets/icons/pin-stop.png'),
  'pin-stay': require('../../../assets/icons/pin-stay.png'),
  'pin-idea': require('../../../assets/icons/pin-idea.png'),
  'dog-with': require('../../../assets/icons/dog-with.png'),
  'dog-sitter': require('../../../assets/icons/dog-sitter.png'),
  'dog-alone': require('../../../assets/icons/dog-alone.png'),
  'dog-tbd': require('../../../assets/icons/dog-tbd.png'),
  'ui-warning': require('../../../assets/icons/ui-warning.png'),
  'ui-dog-warning': require('../../../assets/icons/ui-dog-warning.png'),
  'mood-yay': require('../../../assets/icons/mood-yay.png'),
  'mood-ok': require('../../../assets/icons/mood-ok.png'),
  'mood-meh': require('../../../assets/icons/mood-meh.png'),
  'trait-runner': require('../../../assets/icons/trait-runner.png'),
  'trait-recall': require('../../../assets/icons/trait-recall.png'),
  'ui-crown': require('../../../assets/icons/ui-crown.png'),
  'ui-chat': require('../../../assets/icons/ui-chat.png'),
  'ui-clock': require('../../../assets/icons/ui-clock.png'),
  'ui-note': require('../../../assets/icons/ui-note.png'),
  'diet-vegetarian': require('../../../assets/icons/diet-vegetarian.png'),
  'diet-vegan': require('../../../assets/icons/diet-vegan.png'),
  'diet-glutenfree': require('../../../assets/icons/diet-glutenfree.png'),
  'diet-dairyfree': require('../../../assets/icons/diet-dairyfree.png'),
  'diet-nutallergy': require('../../../assets/icons/diet-nutallergy.png'),
  'diet-halal': require('../../../assets/icons/diet-halal.png'),
} as const;

export type IconName = keyof typeof SOURCES;

/** Download every sticker icon up front, so a screen opened for the first time does not show them popping in. */
export function preloadIcons() {
  return Asset.loadAsync(Object.values(SOURCES) as number[]).catch(() => {});
}

export function Icon({ name, size = 32, style }: { name: IconName; size?: number; style?: StyleProp<ImageStyle> }) {
  return <Image source={SOURCES[name]} accessibilityElementsHidden style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

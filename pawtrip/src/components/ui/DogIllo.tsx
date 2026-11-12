import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

/** The sticker dog from the prototype (original illustration). */
export function DogIllo({ size = 120, tilt = -3 }: { size?: number; tilt?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: [{ rotate: `${tilt}deg` }] }}>
      <Circle cx="60" cy="60" r="55" fill="#FFC72C" stroke="#fff" strokeWidth="6" />
      <Ellipse cx="34" cy="52" rx="13" ry="24" fill="#C98A3B" transform="rotate(18 34 52)" />
      <Ellipse cx="86" cy="52" rx="13" ry="24" fill="#C98A3B" transform="rotate(-18 86 52)" />
      <Ellipse cx="60" cy="62" rx="26" ry="28" fill="#F4C27A" />
      <Ellipse cx="60" cy="76" rx="14" ry="10" fill="#FFE7BE" />
      <Circle cx="50" cy="58" r="4" fill="#4A3628" />
      <Circle cx="70" cy="58" r="4" fill="#4A3628" />
      <Circle cx="51.5" cy="56.5" r="1.3" fill="#fff" />
      <Circle cx="71.5" cy="56.5" r="1.3" fill="#fff" />
      <Ellipse cx="60" cy="70" rx="6" ry="4.5" fill="#4A3628" />
      <Path d="M54 78 q6 6 12 0" stroke="#4A3628" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M58 81 q2 7 6 0" fill="#E9707A" />
    </Svg>
  );
}

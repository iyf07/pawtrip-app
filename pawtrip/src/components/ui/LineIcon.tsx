import Svg, { Circle, G, Path } from 'react-native-svg';
import { useTheme } from '@/hooks/use-theme';

// Action icons share one 24-unit canvas and rounded strokes.
const paths: Record<string, string> = {
  'ui-pencil': 'M4 20l4-1 11-11a2.8 2.8 0 0 0-4-4L4 15l-1 5z M13.5 5.5l5 5',
  'ui-save': 'M4 12l5 5L20 6',
  'ui-discard': 'M6 6l12 12 M18 6L6 18',
  'ui-copy': 'M8 8h11v12H8z M5 16H4V4h11v1',
  'ui-share': 'M8 12l8-5 M8 12l8 5 M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  'ui-trash': 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 10v7 M14 10v7',
  'ui-archive': 'M4 8h16v12H4z M3 4h18v4H3z M10 12h4',
  'ui-camera': 'M4 8h4l2-3h4l2 3h4v11H4z M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  'ui-clock': 'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0z M12 7v5h4',
  'ui-key': 'M14 5a5 5 0 0 0-4.6 7L3 18.4V21h3v-2h2v-2h2l1.5-1.5A5 5 0 1 0 14 5z M16 9h.01',
  'ui-chat': 'M4 5h16v11H9l-5 4z',
  'ui-invite': 'M4 6h16v12H4z M4 7l8 6 8-6',
  'ui-note': 'M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h7',
  'ui-warning': 'M12 3L2.5 20h19z M12 9v5 M12 17h.01',
  'ui-zoom': 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0z M14.5 14.5L20 20 M7 10h6 M10 7v6',
  'ui-crown': 'M3 7l5 4 4-7 4 7 5-4-2 12H5z M5 16h14',
  'tab-plan': 'M4 5h16v15H4z M8 3v4 M16 3v4 M4 9h16 M8 13h2 M14 13h2 M8 17h2 M14 17h2',
  'tab-ideas': 'M8 16c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7z M9 19h6 M10 21h4',
  'tab-members': 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M5 20v-1a7 7 0 0 1 14 0v1 M4 5a3 3 0 0 0 0 6 M20 5a3 3 0 0 1 0 6',
  'nav-notifications': 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5z M10 20h4',
  'nav-settings': 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M10 3h4l.5 2.2 2 1.1 2.2-.7 2 3.5-1.7 1.5v2.3l1.7 1.5-2 3.5-2.2-.7-2 1.1L14 21h-4l-.5-2.2-2-1.1-2.2.7-2-3.5L5 13.4v-2.3L3.3 9.6l2-3.5 2.2.7 2-1.1z',
};

export const isLineIcon = (name: string) => Object.hasOwn(paths, name);

export function LineIcon({ name, size }: { name: string; size: number }) {
  const th = useTheme();
  return <Svg width={size} height={size} viewBox="0 0 30 30"><G transform="translate(1 1)"><Path d={paths[name]} fill="none" stroke={th.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></G><G fill={th.text}><Circle cx="23.5" cy="22.3" r="0.9" /><Circle cx="25.7" cy="21.8" r="0.9" /><Circle cx="27.6" cy="22.8" r="0.9" /><Path d="M23.5 26c.2-1.1 1.4-2.2 2.5-2.2s2.3 1.1 2.5 2.2c.1.8-.7 1.3-1.4 1l-1.1-.4-1.1.4c-.7.3-1.5-.2-1.4-1z" /></G></Svg>;
}

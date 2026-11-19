import { createContext, useContext } from 'react';

/** True inside the desktop shell (left rail + list column): screens then skip their own navbar/back/gear. */
export const ShellContext = createContext(false);
export const useInShell = () => useContext(ShellContext);

/** True when one app-level navigation bar sits above the page stack (phones), so it stays put while pages slide. */
export const NavProvidedContext = createContext(false);
export const useNavProvided = () => useContext(NavProvidedContext);

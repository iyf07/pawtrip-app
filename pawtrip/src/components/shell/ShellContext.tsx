import { createContext, useContext } from 'react';

/** True inside the desktop shell (left rail + list column): screens then skip their own navbar/back/gear. */
export const ShellContext = createContext(false);
export const useInShell = () => useContext(ShellContext);

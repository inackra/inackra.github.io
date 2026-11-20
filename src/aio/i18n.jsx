import {createContext,useContext,useCallback} from 'react';
import english from './ui.en.json';
export const LanguageContext=createContext('ru');
export function useAioCopy(){const lang=useContext(LanguageContext);return useCallback(text=>lang==='en'?(english[text]??text):text,[lang])}
